// Lightweight drag & drop and keyboard accessible behavior for the Color Theory page
document.addEventListener('DOMContentLoaded', () => {
  const swatches = Array.from(document.querySelectorAll('.color-swatch'));
  const targets = Array.from(document.querySelectorAll('.shape-target'));
  const feedback = document.getElementById('ct-feedback');
  const resetBtn = document.getElementById('ct-reset');
  const palette = document.getElementById('color-swatches');

  function setFeedback(msg) {
    if (feedback) feedback.textContent = msg;
  }

  // drag events
  swatches.forEach((s) => {
    s.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', s.dataset.color);
      s.classList.add('dragging');
    });
    s.addEventListener('dragend', () => s.classList.remove('dragging'));

    // keyboard/click selection: toggle selected state
    s.addEventListener('click', () => {
      const selected = document.querySelector('.color-swatch.selected');
      if (selected && selected !== s) selected.classList.remove('selected');
      s.classList.toggle('selected');
    });
    s.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        s.click();
      }
    });
  });

  targets.forEach((t) => {
    t.addEventListener('dragover', (e) => e.preventDefault());
    t.addEventListener('drop', (e) => {
      e.preventDefault();
      const color = e.dataTransfer.getData('text/plain');
      handleDrop(color, t);
    });

    // keyboard support: if a swatch is selected, pressing Enter drops it here
    t.addEventListener('click', () => {
      const sel = document.querySelector('.color-swatch.selected');
      if (sel) handleDrop(sel.dataset.color, t, sel);
    });
    t.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        t.click();
      }
    });
  });

  function handleDrop(color, targetEl, swatchEl = null) {
    const mapping = { triangle: 'yellow', square: 'red', circle: 'blue' };
    const shape = targetEl.dataset.shape;
    const correct = mapping[shape] === color;

    // find the corresponding swatch element if not provided
    if (!swatchEl) swatchEl = swatches.find((s) => s.dataset.color === color);
    if (!swatchEl) return;

    // visually place the swatch within the target
    targetEl.querySelector('.placed-swatch')?.remove();
    const placed = swatchEl.cloneNode(true);
    placed.classList.remove('selected');
    placed.classList.add('placed-swatch');
    placed.setAttribute('aria-hidden', 'true');
    // remove draggable on the clone
    placed.removeAttribute('draggable');
    targetEl.appendChild(placed);

    // remove original from palette
    try {
      swatchEl.parentElement.removeChild(swatchEl);
    } catch (e) {}

    if (correct) {
      setFeedback('Correct — ' + color + ' → ' + shape + '!');
      targetEl.classList.add('matched');
    } else {
      setFeedback('Placed ' + color + ' on ' + shape + '. Try again!');
      targetEl.classList.remove('matched');
    }
  }

  function resetExercise() {
    // move any placed swatches back to palette
    document.querySelectorAll('.placed-swatch').forEach((p) => p.remove());
    // ensure palette has the canonical swatches (recreate if missing)
    const colors = ['yellow', 'red', 'blue'];
    palette.innerHTML = '';
    colors.forEach((c) => {
      const el = document.createElement('div');
      el.className = 'color-swatch color-swatch--' + c;
      el.dataset.color = c;
      el.setAttribute('draggable', 'true');
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.innerHTML =
        '<span class="swatch-label">' + c.charAt(0).toUpperCase() + c.slice(1) + '</span>';
      palette.appendChild(el);
      // rebind handlers (simple approach)
      el.addEventListener('dragstart', (e) =>
        e.dataTransfer.setData('text/plain', el.dataset.color),
      );
      el.addEventListener('click', () => {
        document
          .querySelectorAll('.color-swatch.selected')
          .forEach((s) => s.classList.remove('selected'));
        el.classList.add('selected');
      });
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          el.click();
        }
      });
    });
    setFeedback('Exercise reset. Try matching the colors to the shapes.');
  }

  resetBtn && resetBtn.addEventListener('click', resetExercise);
  // initial feedback
  setFeedback('Drag or select a color and place it onto a shape.');
});
