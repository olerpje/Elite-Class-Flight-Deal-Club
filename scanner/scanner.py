import os
import time
import schedule
import requests
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

INGEST_API_URL = os.getenv("INGEST_API_URL")
INGEST_API_SECRET = os.getenv("INGEST_API_SECRET")

MIN_SAVINGS_PCT = 35

BASELINE_PRICES = {
    "business": 3500,
    "first": 7000,
    "premium_economy": 1800,
}

CITY_NAMES = {
    "AMS": "Amsterdam", "LHR": "London", "CDG": "Paris",
    "FRA": "Frankfurt", "MAD": "Madrid", "BCN": "Barcelona",
    "NRT": "Tokyo", "JFK": "New York", "LAX": "Los Angeles",
    "SIN": "Singapore", "DXB": "Dubai", "HKG": "Hong Kong",
    "BKK": "Bangkok", "GRU": "São Paulo", "ORD": "Chicago",
    "YYZ": "Toronto", "SYD": "Sydney", "EZE": "Buenos Aires",
    "BOM": "Mumbai", "DEL": "Delhi", "PEK": "Beijing",
    "ICN": "Seoul", "KUL": "Kuala Lumpur", "MXP": "Milan",
}

ROUTES = [
    ("AMS", "JFK"), ("AMS", "NRT"), ("AMS", "SIN"), ("AMS", "DXB"),
    ("AMS", "HKG"), ("AMS", "LAX"), ("AMS", "BKK"), ("AMS", "GRU"),
    ("LHR", "JFK"), ("LHR", "NRT"), ("LHR", "SIN"), ("LHR", "DXB"),
    ("LHR", "HKG"), ("LHR", "LAX"), ("LHR", "SYD"), ("LHR", "BOM"),
    ("CDG", "JFK"), ("CDG", "NRT"), ("CDG", "SIN"), ("CDG", "DXB"),
    ("FRA", "JFK"), ("FRA", "NRT"), ("FRA", "SIN"), ("FRA", "DXB"),
    ("FRA", "HKG"), ("FRA", "ORD"), ("MAD", "JFK"), ("MAD", "GRU"),
    ("BCN", "JFK"), ("BCN", "LAX"),
]


def get_scan_dates():
    today = datetime.now()
    return [
        (today + timedelta(weeks=w)).strftime("%Y-%m-%d")
        for w in [3, 5, 7, 9, 11, 13]
    ]


def search_klm(origin, destination, date, cabin):
    """Search KLM flights via their public API."""
    try:
        cabin_map = {"business": "B", "first": "F", "premium_economy": "W"}
        cabin_code = cabin_map.get(cabin, "B")

        url = "https://api.klm.com/opendata/flightstatus/v2/flights"
        params = {
            "origin": origin,
            "destination": destination,
            "scheduledDepartureDate": date,
            "cabinClass": cabin_code,
        }
        headers = {
            "User-Agent": "Mozilla/5.0",
            "Accept": "application/json",
        }
        response = requests.get(url, params=params, headers=headers, timeout=15)
        if response.status_code == 200:
            return response.json()
    except Exception as e:
        print(f"  KLM API error: {e}")
    return None


def search_via_google_flights_scrape(origin, destination, date, cabin):
    """
    Use SerpAPI Google Flights with correct parameters.
    Falls back gracefully if not available.
    """
    try:
        from dotenv import load_dotenv
        load_dotenv()
        serpapi_key = os.getenv("SERPAPI_KEY")
        if not serpapi_key:
            return []

        cabin_num = {"premium_economy": 2, "business": 3, "first": 4}.get(cabin, 3)

        params = {
            "engine": "google_flights",
            "departure_id": origin,
            "arrival_id": destination,
            "outbound_date": date,
            "currency": "EUR",
            "hl": "en",
            "travel_class": cabin_num,
            "type": "2",  # one-way
            "api_key": serpapi_key,
        }

        response = requests.get(
            "https://serpapi.com/search.json",
            params=params,
            timeout=30
        )

        if response.status_code != 200:
            return []

        data = response.json()
        flights = []

        for section in ["best_flights", "other_flights"]:
            for group in data.get(section, []):
                price = group.get("price")
                if not price:
                    continue
                flights_data = group.get("flights", [])
                if not flights_data:
                    continue
                airline = flights_data[0].get("airline", "Unknown")
                flights.append({"price": price, "airline": airline})

        return flights

    except Exception as e:
        print(f"  SerpAPI error: {e}")
        return []


def calculate_savings(price, cabin):
    baseline = BASELINE_PRICES.get(cabin, 3500)
    if price >= baseline:
        return 0
    return round(((baseline - price) / baseline) * 100)


def ingest_deal(deal):
    try:
        response = requests.post(
            INGEST_API_URL,
            json=deal,
            headers={
                "Content-Type": "application/json",
                "x-api-key": INGEST_API_SECRET,
            },
            timeout=15,
        )
        if response.status_code == 201:
            print(f"  ✅ Ingested: {deal['origin']} -> {deal['destination']} {deal['cabin_class']} €{deal['deal_price']} ({deal['savings_percentage']}% off)")
            return True
        else:
            print(f"  ❌ Failed {response.status_code}: {response.text[:100]}")
            return False
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return False


def run_scan():
    print(f"\n🔍 Scan started at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    deals_found = 0
    scan_dates = get_scan_dates()
    date_index = 0

    for origin, destination in ROUTES:
        for cabin in ["business", "first"]:
            date = scan_dates[date_index % len(scan_dates)]
            date_index += 1

            print(f"  Scanning {origin} -> {destination} [{cabin}] {date}")
            flights = search_via_google_flights_scrape(origin, destination, date, cabin)

            for flight in flights:
                price = flight["price"]
                savings = calculate_savings(price, cabin)

                if savings < MIN_SAVINGS_PCT:
                    continue

                deal = {
                    "origin": origin,
                    "origin_city": CITY_NAMES.get(origin, origin),
                    "destination": destination,
                    "destination_city": CITY_NAMES.get(destination, destination),
                    "airline": flight["airline"],
                    "original_price": float(BASELINE_PRICES[cabin]),
                    "deal_price": float(price),
                    "currency": "EUR",
                    "cabin_class": cabin,
                    "booking_url": f"https://www.google.com/flights#flt={origin}.{destination}.{date};c:EUR;e:1;sd:1",
                    "travel_window_start": date,
                    "is_error_fare": savings >= 60,
                    "tags": ["scanner", cabin, origin.lower()],
                }

                if ingest_deal(deal):
                    deals_found += 1

            time.sleep(3)

    print(f"\n✅ Scan complete — {deals_found} deals ingested.")


if __name__ == "__main__":
    print("✈  Elite Flight Scanner")
    print(f"   Routes: {len(ROUTES)}")
    print(f"   Min discount: {MIN_SAVINGS_PCT}%")
    print(f"   Target: {INGEST_API_URL}")
    print()

    run_scan()

    schedule.every(6).hours.do(run_scan)
    print("\n⏰ Running every 6 hours. Press Ctrl+C to stop.")
    while True:
        schedule.run_pending()
        time.sleep(60)