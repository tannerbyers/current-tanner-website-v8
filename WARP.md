# tannerbyers.com — Eleventy Development Guide

## Project Overview
Personal blog and portfolio for Tanner Byers. Built with Eleventy v1, Nunjucks templates, deployed to Vercel.

## Architecture
- **Input**: `src/` (content and pages)
- **Includes**: `_includes/` (layouts, components)
- **Data**: `_data/metadata.json` (global site config)
- **Output**: `_site/` (built files, gitignored)
- **Config**: `.eleventy.js` (root)
- **Template engine**: Nunjucks (`.njk`) for layouts, Markdown (`.md`) for content

## Commands
- `npm run serve` — local dev server with hot reload
- `npm run build` — production build (minified HTML)
- `npm run new-post -- "Post Title"` — scaffold a new blog post
- `npm run dev` — alias for serve
- `npm run debug` — build with debug output

## Writing a New Blog Post
1. Run `npm run new-post -- "My Post Title"` to scaffold the file
2. Edit the generated file in `src/posts/`
3. Fill in `description` (used for SEO meta, OG tags, and post lists)
4. Add relevant `tags` (used for categorization, related posts, and OG article:tag)
5. Optionally add `image: /img/my-image.jpg` for a custom OG/Twitter card image
6. Optionally add `lastModified: YYYY-MM-DD` when updating an old post
7. Use `<!-- excerpt -->` to mark where the auto-excerpt ends (optional)
8. The `layout` is inherited from `posts.json` — do NOT add it to individual post frontmatter

### Post Frontmatter Template
```yaml
---
title: "Post Title"
description: Short SEO-friendly summary (required for good SEO)
date: YYYY-MM-DD
tags: [tag1, tag2]
image: /img/optional-og-image.jpg    # optional, falls back to /img/tanner.jpg
lastModified: YYYY-MM-DD             # optional, used in structured data + sitemap
draft: true                          # optional, hides from production builds
---
```

## Conventions
- **Tags**: Use lowercase, consistent names. Avoid duplicates like "AI" vs "ai". Current tags include: SaaS, AI, Business, learning, consulting, solution, process, project, java.
- **Descriptions**: Every post and page MUST have a `description` in frontmatter. It's used for meta tags, OG tags, structured data, and post list previews.
- **Images**: Place in `src/img/`. Use descriptive alt text. Markdown images auto-get `loading="lazy"` and `decoding="async"`.
- **Internal links**: Use relative paths like `/posts/slug/`, `/about/`, etc. External links auto-get `target="_blank"` and `rel="noopener noreferrer"` via `external-links.js`.
- **Dates**: Use ISO format `YYYY-MM-DD` in frontmatter.

## Layout Hierarchy
- `base.njk` — HTML shell, `<head>`, nav, footer, structured data, analytics
  - `home.njk` — wraps base, used for list/index pages
  - `post.njk` — wraps base, adds TOC, reading time, tags, related posts, subscribe CTA, prev/next nav

## Key Features
- **SEO**: Canonical URLs, OG tags, Twitter cards, article meta, WebSite + Person + BlogPosting + BreadcrumbList structured data, sitemap.xml, robots.txt
- **Performance**: HTML minification, cache-busted CSS/JS, preconnect hints, lazy-loaded images
- **UX**: Reading progress bar, back-to-top button, auto TOC, related posts, subscribe CTA
- **Feeds**: Atom XML (`/feed/feed.xml`) and JSON Feed (`/feed/feed.json`)
- **Drafts**: Set `draft: true` in frontmatter to hide from production. Drafts show during `serve`/`watch`.
- **Newsletter**: Buttondown (account: `tannerbyers`). Forms in post template and footer.

## Editing Tips
- Global site metadata (title, description, author, social links) lives in `_data/metadata.json`
- Navigation is hardcoded in `base.njk` header — edit there to add/remove nav items
- Tag filtering excludes `all`, `nav`, `post`, `posts` — add more to `filterTagList()` in `.eleventy.js` if needed
- The archive page at `/posts/` is paginated (10 per page)
- When adding new passthrough directories, update `eleventyConfig.addPassthroughCopy()` in `.eleventy.js`

## CMS (Content Manager)
- Decap CMS is available at `https://tannerbyers.com/admin/` (or `localhost:8080/admin/` locally)
- **First-time setup**: You must register the site as a GitHub OAuth App to log in. Follow the Decap CMS docs for GitHub backend auth: https://decapcms.org/docs/github-backend/
- The CMS lets you create/edit blog posts and pages with a visual editor
- It commits directly to the `main` branch on GitHub, triggering Vercel deploys
- **Editorial workflow** is enabled — posts go through Draft → In Review → Ready states before publishing
- CMS config lives in `src/admin/config.yml` — edit there to add new collections or fields
- Images uploaded via the CMS go to `src/img/`
- The CMS UI is not indexed by search engines (`noindex` meta tag on admin page)

## Testing Before Deploy
- Always run `npm run build` locally and check for errors before pushing
- Verify new posts render correctly with `npm run serve`
- Check that `description` is set (pages without it inherit the global fallback)
- Validate structured data at https://search.google.com/test/rich-results
- Test OG tags at https://www.opengraph.xyz/

## Deployment
- Hosted on Vercel. Config in `vercel.json`.
- Build command: `npm run build`, output: `_site/`
- Pushes to `main` trigger automatic deploys
