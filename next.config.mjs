/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  images: {
    remotePatterns: [],
    formats: ['image/avif', 'image/webp'],
  },
  headers: async () => {
    const isDev = process.env.NODE_ENV === 'development'

    const csp = [
      "default-src 'self'",
      // dev: React needs eval() for callstack reconstruction; prod: strict
      // googletagmanager.com: GTM loader + gtag.js
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://challenges.cloudflare.com https://www.googletagmanager.com`,
      // Tailwind inline styles
      "style-src 'self' 'unsafe-inline'",
      // Fonts are self-hosted via next/font — no external font origin needed
      "font-src 'self'",
      // Images: allow self, data URIs and blob for canvas/particle, GTM/GA tracking pixels
      "img-src 'self' data: blob: https://www.googletagmanager.com https://www.google-analytics.com",
      // API calls: Resend + Turnstile + GTM config fetch + GA beacons
      "connect-src 'self' https://api.resend.com https://challenges.cloudflare.com https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com",
      // Turnstile iframe + GTM noscript iframe fallback
      "frame-src https://challenges.cloudflare.com https://www.googletagmanager.com",
      // Block all framing of this site
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      // only force HTTPS in production — localhost is HTTP
      ...(!isDev ? ["upgrade-insecure-requests"] : []),
    ].join('; ')

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
          // COEP 'require-corp' is intentionally omitted: it would also block
          // GTM/Turnstile subresources that don't send CORP headers, and this
          // site has no need for cross-origin isolation (SharedArrayBuffer, etc).
        ],
      },
    ]
  },
}

export default nextConfig
