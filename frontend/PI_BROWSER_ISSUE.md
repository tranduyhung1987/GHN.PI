# Pi Browser Blocking Issue - Diagnosis

## Current Status (as of latest conversation)

- ✅ Site works perfectly on normal browsers (Chrome, Edge, etc.)
- ❌ Site is blocked / cannot be accessed in Pi Browser (both raw Vercel URLs and ghn-pi.vercel.app)

## Root Cause

**Pi Browser is aggressively filtering / blocking Vercel-hosted applications.**

This is a known issue in the Pi developer community:
- Vercel subdomains (*.vercel.app) are frequently blocked by Pi Browser.
- Even when using custom domains pointing to Vercel, if the underlying infrastructure is Vercel, it can still be affected.
- Pi Browser has very strict security policies and often flags CDNs like Vercel, especially when the app uses Firebase + external SDKs (Pi SDK).

## What We Have Tried

- Multiple production deployments on Vercel
- Custom domain aliasing (`ghn-pi.vercel.app`)
- Content-Security-Policy (CSP) tuned for Pi SDK + Firebase
- Relaxed security headers (X-Frame-Options, etc.)
- Adding Asian regions for lower latency
- Various header configurations

**Result**: Still blocked in Pi Browser.

## Recommended Solution

**Migrate to Cloudflare Pages**

Cloudflare Pages tends to have much better compatibility with Pi Browser compared to Vercel.

See file: `CLOUDFLARE_PAGES_DEPLOY.md` for detailed migration guide.

## Temporary Workarounds (Not Recommended for Production)

- Ask users to open in normal browser (bad UX)
- Use a reverse proxy (Cloudflare Worker) in front of Vercel (complex, may still be detected)

## Decision Made (2026)

✅ User đã chọn **bỏ Vercel hoàn toàn** và chuyển sang **Cloudflare Pages**.

## Files Prepared for Migration

- `CLOUDFLARE_PAGES_DEPLOY.md` — Hướng dẫn chi tiết
- `.github/workflows/deploy-cloudflare-pages.yml` — Auto deploy
- `public/_headers` + `public/_redirects`
- `wrangler.toml`

## Current Recommended URL for Pi Browser Testing

Sử dụng link từ Cloudflare Pages (`*.pages.dev`) thay vì `ghn-pi.vercel.app`.

Last updated: 2026
