# My SaaS Honey To Do 

- [Hide posts with future dates in production](https://saneef.com/blog/hiding-posts-with-future-dates-in-eleventy/)
- Make blog posts about building healthcare application (modern) -> turn into e-book -> turn into course
- Think of plugins for SEO, Sharability, Accessibility, Localization? 

## Recent accessibility & UX improvements (applied)
- Remove redundant "Home" link from main nav — site title links to home (done)
- Add skip-to-content link for keyboard users (done)
- Add `aria-current="page"` to active nav links for better screen reader support (done)
- Add RSS link to header navigation for easy discovery (done)
- Add focus outlines for keyboard navigation on nav links (done)

## Suggested small improvements (next)
- Add keyboard handling and focus management to the dropdown menu (Close on Esc, toggle on Enter/Space) (done)
- Add `rel="noopener noreferrer"` and `target="_blank"` to external links where appropriate (done via runtime script `src/js/external-links.js`)
- Consider adding client-side search (Lunr.js or Algolia) for quick post lookup
- Add copy-to-clipboard buttons for code blocks
- Consider an assets index/page for shared downloadable resources

