(() => {
  const links = [...document.querySelectorAll('.cover-link')];
  const reader = document.getElementById('reader');
  if (!reader || typeof reader.showModal !== 'function') return;
  const canvas = document.getElementById('reader-canvas');
  const image = document.getElementById('reader-image');
  const zoom = document.getElementById('reader-zoom');
  let selected = 0;
  const buttons = links.map((link, index) => {
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = link.dataset.title;
    button.addEventListener('click', () => select(index));
    document.getElementById('reader-switcher').append(button);
    return button;
  });
  function select(index) {
    selected = index;
    const link = links[index];
    reader.style.setProperty('--accent', link.dataset.accent);
    document.getElementById('reader-title').textContent = link.dataset.title;
    image.src = link.dataset.preview;
    image.alt = `${link.dataset.title} resume, first-page preview`;
    document.getElementById('reader-pdf').href = link.href;
    document.getElementById('reader-download').href = link.href;
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    canvas.scrollTop = 0; canvas.scrollLeft = 0;
  }
  links.forEach((link, index) => link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); select(index); reader.showModal();
  }));
  zoom.addEventListener('click', () => {
    const enlarged = canvas.classList.toggle('is-zoomed');
    zoom.setAttribute('aria-pressed', String(enlarged));
    zoom.textContent = enlarged ? 'Fit width −' : 'Zoom in +';
  });
  document.getElementById('reader-close').addEventListener('click', () => reader.close());
  reader.addEventListener('click', event => {
    if (event.target !== reader) return;
    const box = reader.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) reader.close();
  });
  reader.addEventListener('keydown', event => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    if (event.target === canvas) return;
    event.preventDefault();
    select((selected + (event.key === 'ArrowRight' ? 1 : -1) + links.length) % links.length);
  });
})();
