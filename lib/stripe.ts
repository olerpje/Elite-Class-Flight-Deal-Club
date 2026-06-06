import Stripe from 'stripe'

23:39:23.358 Running build in Washington, D.C., USA (East) – iad1
23:39:23.359 Build machine configuration: 2 cores, 8 GB
23:39:23.507 Cloning github.com/olerpje/Elite-Class-Flight-Deal-Club (Branch: main, Commit: c56c094)
23:39:23.508 Previous build caches not available.
23:39:23.848 Cloning completed: 341.000ms
23:39:24.169 Running "vercel build"
23:39:24.195 Vercel CLI 54.9.0
23:39:24.427 Installing dependencies...
23:39:30.132 npm warn deprecated @react-email/components@1.0.12: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
23:39:30.270 npm warn deprecated @react-email/row@0.0.13: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
23:39:30.308 npm warn deprecated @react-email/text@0.1.6: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
23:39:30.310 npm warn deprecated @react-email/link@0.0.13: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
23:39:30.311 npm warn deprecated @react-email/preview@0.0.14: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
23:39:30.311 npm warn deprecated @react-email/hr@0.0.12: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
23:39:30.312 npm warn deprecated @react-email/img@0.0.12: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
23:39:30.467 npm warn deprecated @react-email/html@0.0.12: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
23:39:30.469 npm warn deprecated @react-email/heading@0.0.16: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
23:39:30.500 npm warn deprecated @react-email/head@0.0.13: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
23:39:30.500 npm warn deprecated @react-email/column@0.0.14: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
23:39:30.501 npm warn deprecated @react-email/font@0.0.10: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
23:39:30.502 npm warn deprecated @react-email/container@0.0.16: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
23:39:30.532 npm warn deprecated @react-email/code-inline@0.0.6: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
23:39:30.557 npm warn deprecated @react-email/section@0.0.17: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
23:39:30.586 npm warn deprecated @react-email/body@0.3.0: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
23:39:30.614 npm warn deprecated @react-email/markdown@0.0.18: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
23:39:30.644 npm warn deprecated @react-email/button@0.2.1: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
23:39:31.550 npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
23:39:32.360 npm warn deprecated @react-email/tailwind@2.0.7: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
23:39:32.664 npm warn deprecated @react-email/code-block@0.2.1: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
23:39:41.270 npm warn deprecated next@15.2.0: This version has a security vulnerability. Please upgrade to a patched version. See https://nextjs.org/blog/CVE-2025-66478 for more details.
23:39:41.910 
23:39:41.911 added 851 packages in 17s
23:39:41.911 
23:39:41.912 260 packages are looking for funding
23:39:41.912   run `npm fund` for details
23:39:42.016 Detected Next.js version: 15.2.0
23:39:42.025 Running "npm run build"
23:39:42.137 
23:39:42.137 > elite-flight-club@0.1.0 build
23:39:42.137 > next build
23:39:42.138 
23:39:42.735  ⚠ Invalid next.config.ts options detected: 
23:39:42.736  ⚠     Unrecognized key(s) in object: 'turbopack'
23:39:42.737  ⚠ See more info here: https://nextjs.org/docs/messages/invalid-next-config
23:39:42.743 Attention: Next.js now collects completely anonymous telemetry regarding usage.
23:39:42.743 This information is used to shape Next.js' roadmap and prioritize features.
23:39:42.744 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
23:39:42.744 https://nextjs.org/telemetry
23:39:42.744 
23:39:42.807    ▲ Next.js 15.2.0
23:39:42.808 
23:39:42.822    Creating an optimized production build ...
23:40:04.101  ✓ Compiled successfully
23:40:04.114    Linting and checking validity of types ...
23:40:12.696 Failed to compile.
23:40:12.697 
23:40:12.697 ./lib/stripe.ts:4:3
23:40:12.697 Type error: Type '"2025-05-28.basil"' is not assignable to type '"2026-05-27.dahlia"'.
23:40:12.697 
23:40:12.697   2 |
23:40:12.698   3 | export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
  typescript: true,
})
23:40:12.698   7 |
23:40:12.728 Next.js build worker exited with code: 1 and signal: null
23:40:12.766 Error: Command "npm run build" exited with 1

export const STRIPE_PRICES = {
  monthly: process.env.STRIPE_PRICE_MONTHLY!,
  annual: process.env.STRIPE_PRICE_ANNUAL!,
} as const

export const SUBSCRIPTION_TIER_MAP: Record<string, 'premium_monthly' | 'premium_annual'> = {
  [process.env.STRIPE_PRICE_MONTHLY!]: 'premium_monthly',
  [process.env.STRIPE_PRICE_ANNUAL!]: 'premium_annual',
}