document.addEventListener('DOMContentLoaded', () => {
  const anchors = document.querySelectorAll('a[href]');
  const host = window.location.host;

  anchors.forEach(a => {
    const href = a.getAttribute('href');
    if (!href) return;
    // Ignore relative links, anchors, mailto, tel
    if (href.startsWith('/') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    // Only process http(s) links
    if (!href.startsWith('http://') && !href.startsWith('https://')) return;
    try {
      const url = new URL(href);
      if (url.host === host) return; // same host, skip
    } catch (e) {
      return; // invalid URL
    }

    // Mark external links to open in new tab safely
    a.setAttribute('target', '_blank');
    const rel = (a.getAttribute('rel') || '').split(' ').filter(Boolean);
    if (!rel.includes('noopener')) rel.push('noopener');
    if (!rel.includes('noreferrer')) rel.push('noreferrer');
    a.setAttribute('rel', rel.join(' '));
  });
});
