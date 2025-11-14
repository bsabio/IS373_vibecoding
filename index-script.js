document.addEventListener('DOMContentLoaded', () => {
  const featuredEl = document.querySelector('.featured-grid');
  // keep core principles in `.notes-grid` (static); use a separate container for posts
  const postsEl = document.querySelector('.posts-grid');

  function el(tag, attrs = {}, ...children) {
    const e = document.createElement(tag);
    for (const k in attrs) {
      if (k === 'class') e.className = attrs[k];
      else if (k === 'html') e.innerHTML = attrs[k];
      else e.setAttribute(k, attrs[k]);
    }
    for (const c of children)
      if (c) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    return e;
  }

  // load projects
  fetch('assets/data/projects.json')
    .then((r) => r.json())
    .then((projects) => {
      if (!featuredEl) return;
      featuredEl.innerHTML = '';
      // Only include projects explicitly marked as featured; limit to 2 cards.
      const featuredProjects = projects.filter((x) => x.featured).slice(0, 2);
      const featuredNodes = [];
      featuredProjects.forEach((p) => {
        const cls = 'feature' + (p.highlight === 'purple' ? ' purple' : '');
        const a = el('a', { class: cls, href: p.url });
        const img = el('img', { src: p.image, alt: p.title, loading: 'lazy' });
        const meta = el(
          'div',
          { class: 'meta' },
          el('strong', {}, document.createTextNode(p.title)),
          el('span', {}, document.createTextNode(p.year)),
        );
        a.appendChild(img);
        a.appendChild(meta);
        featuredEl.appendChild(a);
        featuredNodes.push(a);
      });
      // staggered entrance for a more dynamic feel
      featuredNodes.forEach((n, i) => {
        // small stagger and slight delay so layout settles first
        setTimeout(() => n.classList.add('is-visible'), 120 * i + 80);
      });
    })
    .catch(() => {
      if (featuredEl) featuredEl.innerHTML = '<p>Featured content unavailable.</p>';
    });

  // load posts into a dedicated posts container so we don't overwrite the static core principles
  fetch('assets/data/posts.json')
    .then((r) => r.json())
    .then((posts) => {
      if (!postsEl) return;
      postsEl.innerHTML = '';
      posts.forEach((p) => {
        const art = el('article');
        art.appendChild(el('h4', {}, document.createTextNode(p.title)));
        art.appendChild(el('p', {}, document.createTextNode(p.excerpt)));
        art.appendChild(el('a', { class: 'link', href: p.url }, document.createTextNode('Read →')));
        postsEl.appendChild(art);
      });
    })
    .catch(() => {
      if (postsEl) postsEl.innerHTML = '<p>Posts unavailable.</p>';
    });

  /* Parallax / scroll movement: subtle translate on scroll to make elements appear to move
     while the page background remains fixed. Respects prefers-reduced-motion. */
  (function setupParallax() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const els = Array.from(
      document.querySelectorAll('.featured-grid .feature, .card, .notes-grid article, .hero-right'),
    );
    if (!els.length) return;

    let ticking = false;
    function update() {
      const vh = window.innerHeight;
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        // distance from center of viewport; positive when below center
        const distance = r.top + r.height / 2 - vh / 2;
        // multiplier controls strength; smaller number = subtler motion
        const multiplier = 0.06;
        const move = -distance * multiplier;
        // apply transform only for vertical parallax; preserve existing transform on hover will override as needed
        el.style.transform = `translateY(${move}px)`;
      });
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    // run once to position elements initially
    onScroll();
  })();
});
