# TODO

## ✅ Completed items (verified)
- [x] Hide posts with future dates in production — implemented via `shouldHide()` + `eleventy.before` hook in `.eleventy.js` (done)
- [x] Client-side search — **Pagefind** added at `/search/`, replaces the Lunr.js/Algolia suggestion (done)
- [x] Remove `.travis.yml` — stale Travis CI config targeting node 12 (removed)
- [x] Remove `examples_posts/` — stale Eleventy starter content, not part of live site (removed)
- [x] Move hardcoded Google Analytics ID to `_data/metadata.json` — now referenced via `{{ metadata.gaId }}` in `base.njk` (done)
- [x] Replace Font Awesome CDN with inline SVGs — eliminated render-blocking 18 KiB CSS request for ~1.5 KiB of inline SVG icons. 9 icons replaced: GitHub, LinkedIn, React, TypeScript, Python, Java, Node.js, AWS, Terraform. Mobile Lighthouse perf: 79 → 99. Desktop: 99. All other scores: 100. (done)
- [x] Remove `Disallow: /examples_posts/` from `robots.txt` — directory no longer exists (done)
- [x] Replace broken Netlify contact form with Web3Forms — contact form now works on Vercel. Subject is now a categorized dropdown (freelance, collaboration, etc.) instead of a text field. (done)
- [x] Replace broken Netlify newsletter forms with Web3Forms — both footer and post-CTA forms now actually POST via fetch instead of faking success. Added your access key. (done)
- [x] Remove dead CSS classes `contact-form-success` and `contact-form-note` — no longer referenced after contact form rewrite. (done)

## ✅ All form submissions now fixed
All three forms (contact, footer newsletter, post newsletter) are now wired to Web3Forms with your access key. The JS actually submits via `fetch` and shows real success/error feedback.

## 🔴 Newsletter form still broken on Vercel
Newsletter signup forms in `base.njk` and `post.njk` use `data-netlify="true"` (Netlify Forms attribute). The site deploys to **Vercel**, which does not process Netlify Forms. The forms render but submissions go nowhere in production.
- **Fix**: Switch to Vercel Forms (webhook-based), ConvertKit, Mailchimp, or a form backend service.
- `src/js/newsletter-form.js` may also need updating to match the new backend.

## 🟡 Image optimization
Images in `src/img/` are passed through as-is. No responsive srcsets, WebP/AVIF conversion, or compression pipeline. Consider adding `@11ty/eleventy-img` for automatic optimization. Markdown images already get `loading="lazy"` + `decoding="async"` via custom markdown-it renderer.

## 🟡 No cookie consent banner
Google Analytics runs via gtag.js (`G-HB0Y5K6X23`) on every page. No cookie consent dialog — fine for a personal US-based blog, but needed if targeting EU visitors.

## 🟡 Navigation hardcoded in base.njk
Nav links (About, Blog, Speaking, More dropdown) are hardcoded in `_includes/layouts/base.njk`. Adding a page requires editing the template. Consider driving nav from `eleventy-navigation` plugin data for maintainability.

## 🟡 Stale Tina CMS assets
`base.njk` has `{% if tina %}` blocks and a Tina CSS import (line 57-59). `.env` has stale `TINA_CLIENT_ID`/`TINA_TOKEN`. Safe to clean up but verify nothing depends on it.

## 🟡 Vercel installs with `--production` only
`vercel.json` sets `"installCommand": "npm install --production"`. DevDependencies (`pa11y`, `jsdom`, `axe-core`, etc.) won't be available on Vercel. If the build pipeline ever needs them, this must change.

## Content goals
- [ ] Make blog posts about building healthcare application (modern) → turn into e-book → turn into course
- [ ] Research SEO, shareability, accessibility, and localization plugins/improvements

## Feature wishlist
- [ ] Copy-to-clipboard buttons on code blocks
- [ ] Assets index page for shared downloadable resources