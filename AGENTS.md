# tannerbyers.com — AGENTS.md

Static blog/portfolio for [tannerbyers.com](https://tannerbyers.com). Built with **Eleventy v1**, **Nunjucks** layouts, **Markdown** content. Deployed to **Vercel**.

## Quick commands

| Command | What it does |
|---------|-------------|
| `npm run serve` | Dev server with hot reload (aliases: `start`, `dev`) |
| `npm run build` | Production build: `rm -rf _site && ELEVENTY_ENV=production eleventy && npx pagefind --site _site` |
| `npm run build:fast` | Same but `eleventy --incremental` for speed |
| `npm run new-post -- "Title"` | Scaffold a draft post in `src/posts/` with pre-filled frontmatter |
| `npm run debug` | `DEBUG=* eleventy` — verbose output |

## Build pipeline

The `build` script is **two steps**: Eleventy generates `_site/`, then **Pagefind** indexes it for search. Never run just `eleventy` without Pagefind if search is needed. Both steps are required in `npm run build`.

`ELEVENTY_ENV=production` is set during build but **not consumed** anywhere in the codebase (the `htmlmin` transform runs on all builds regardless). It's a vestigial flag.

## Drafts & future-dated posts

- Set `draft: true` in frontmatter to hide from production.
- Posts with a `date` in the future are also hidden from production.
- Both are visible during `serve`/`watch` (auto-detected in `.eleventy.js` via `eleventy.before` hook).
- Review drafts locally at `/drafts/`.

## Post conventions

- **`layout` is inherited** from `src/posts/posts.json` — do NOT set `layout` in individual post frontmatter.
- **`description` is required** in every post and page frontmatter (SEO meta, OG tags, list previews).
- **Tags**: lowercase, consistent names (e.g. `saas`, `ai`, `business`). The `filterTagList()` function excludes `all`, `nav`, `post`, `posts` from display.
- Optional frontmatter: `image` (OG card, defaults to `/img/tanner.jpg`), `lastModified` (for updated posts).
- The excerpt separator is `<!-- excerpt -->`.

## Architecture quirks

- **Input dir**: `src/`. **Includes** are at `_includes/` (NOT inside `src/` — configured via `dir.includes: "../_includes"` in `.eleventy.js`). **Data** at `_data/` (NOT in `src/`).
- **Layout hierarchy**: `_includes/layouts/base.njk` ← `home.njk` / `post.njk`
- **Passthrough copies** (configured in `.eleventy.js`): `src/img`, `src/css`, `src/js`, `src/fonts`, `src/robots.txt`, `src/site.webmanifest`, `src/admin`.
- **Global site metadata** (title, author, social links, GA ID) lives in `_data/metadata.json`.
- **Pagefind** targets the `data-pagefind-body` attribute on the content div in `base.njk`. Search UI customization via CSS variables in `src/search.njk`.
- **Lava lamp animation** is generated client-side by inline JS in `base.njk`. It creates floating blobs in side containers. If you see `lava-left`/`lava-right` divs or `floating-shape` elements, that's the visual effect — don't mistake it for a bug.

## Shortcodes & filters

- `{% jsFiddle "<iframe-src>" %}` — embeds a jsFiddle iframe.
- `{% year %}` — current year for copyright.
- `cacheBust` filter — appends MD5 hash to asset URLs.
- `gitLastModified` filter — reads `git log` for last-modified date.
- `toc` filter — auto-generates table of contents from h2/h3 elements.
- `relatedPosts` filter — picks posts sharing the most tags.

## Admin (custom SPA, not Decap CMS)

The admin at `/admin/` is a **custom-built SPA** (`src/admin/index.html`) backed by **Vercel serverless functions** in `api/`. It uses GitHub's API directly for CRUD.

If you modify the admin:
- `api/auth.js`, `api/github.js`, `api/login.js`, `api/logout.js`, `api/check-auth.js`, `api/upload.js` — these are Vercel serverless endpoints the admin calls.
- **Env vars required** for the admin to work: `GITHUB_TOKEN`, `ADMIN_PASSWORD`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`.
- The admin authenticates via password (`ADMIN_PASSWORD` env var) or GitHub OAuth.

## Newsletter forms — Netlify dependency

The newsletter signup forms in `base.njk` and `post.njk` use **Netlify Forms** (`data-netlify="true"`). This works on Netlify but **will not process submissions on Vercel**, which is the active deploy target. The forms render but submissions likely go nowhere in production. Fixing this requires a form backend (or switching to Vercel's own form handling).

## Accessibility

- Custom `accessibility-scan.js` script checks built HTML (`_site/`) for alt text, heading hierarchy, contrast, and form labels. Run via `node accessibility-scan.js` after `npm run build`.
- `pa11y` / `pa11y-ci` in devDependencies can also be used.

## CI & deployment

- **GitHub Actions** (`deploy.yml`) runs on pushes to `main` touching `src/posts/**` or `src/img/**`. It waits 60s then purges Vercel CDN cache (the Vercel build is triggered by the push itself).
- **Vercel** builds via `npm run install --production` + `npm run build`, output to `_site/`.
- Netlify config (`netlify.toml`) also exists but is **not** the active deploy target.

## Environment

- `.nvmrc` specifies Node 22.
- EditorConfig: 2-space indent, UTF-8, LF, trailing newline.
- `.gitignore` excludes `_site/`, `node_modules/`, `.vercel`, `.aider*`, `.env`.
- `.env.example` shows expected vars. Actual `.env` also has Tina CMS tokens (legacy / inactive).

## Reference

See `WARP.md` for the full development guide including writing workflow, editing tips, and structured data validation.