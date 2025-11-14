(() => {
  const gallery = document.getElementById('gallery');
  const lightbox = document.getElementById('lightbox');
  const lbImg = lightbox.querySelector('img');
  const lbCaption = lightbox.querySelector('figcaption');
  const closeBtn = lightbox.querySelector('.close');
  const prevBtn = lightbox.querySelector('.prev');
  const nextBtn = lightbox.querySelector('.next');

  let items = [];
  let current = 0;

  function renderGallery(data) {
    items = data;
    gallery.innerHTML = '';
    data.forEach((item, i) => {
      const fig = document.createElement('figure');
      fig.className = 'card';
      fig.setAttribute('data-index', i);

      const img = document.createElement('img');
      img.src = `research/references/${item.file}`;
      img.alt = item.title;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.width = 800;
      img.height = 600;

      const cap = document.createElement('figcaption');
      cap.textContent = item.title;

      fig.appendChild(img);
      fig.appendChild(cap);
      fig.addEventListener('click', () => open(i));
      gallery.appendChild(fig);
    });
  }

  function open(idx) {
    const item = items[idx];
    lbImg.src = `research/references/${item.file}`;
    lbImg.alt = item.title;
    lbCaption.textContent = item.caption || item.title;
    current = idx;
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lightbox.setAttribute('aria-hidden', 'true');
    lbImg.src = '';
    document.body.style.overflow = '';
  }

  function prev() {
    open((current - 1 + items.length) % items.length);
  }
  function next() {
    open((current + 1) % items.length);
  }

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    prev();
  });
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    next();
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.getAttribute('aria-hidden') === 'false') {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    }
  });

  // click backdrop to close
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  // Load gallery data
  fetch('assets/data/images.json')
    .then((res) => res.json())
    .then(renderGallery)
    .catch((err) => {
      console.error('Failed to load gallery data', err);
      gallery.innerHTML = '<p class="muted">Failed to load gallery.</p>';
    });
})();
