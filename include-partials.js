// Simple partial include script: load HTML fragments from /partials and inject
(function () {
  function inject(el, url) {
    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load ' + url);
        return res.text();
      })
      .then(function (html) {
        el.innerHTML = html;
        // mark active nav item
        try {
          var links = el.querySelectorAll('.main-nav a');
          var path = location.pathname.replace(/\/$/, '');
          links.forEach(function (a) {
            var href = a.getAttribute('href').replace(/\/$/, '');
            if (href === path || (href === '' && path === '/')) {
              a.setAttribute('aria-current', 'page');
            } else {
              a.removeAttribute('aria-current');
            }
          });
        } catch (e) {
          /* ignore */
        }
      })
      .catch(function (err) {
        console.error(err);
      });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var els = document.querySelectorAll('[data-include]');
    els.forEach(function (el) {
      var url = el.getAttribute('data-include');
      if (url) {
        // support relative path like "partials/header.html"
        inject(el, url);
      }
    });
  });
})();
