(() => {
  const links = [...document.querySelectorAll('.tile-link')];
  const image = document.getElementById('preview-image');
  const viewer = document.querySelector('.viewer');
  const stage = document.querySelector('.document-stage');
  if (!links.length || !image || !viewer || !stage) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const lowPower = reduced || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || (navigator.deviceMemory && navigator.deviceMemory <= 4) || navigator.connection?.saveData;
  if (lowPower) document.documentElement.classList.add('calm');
  const lenses = [...document.querySelectorAll('.lens-button')];
  const modes = [...document.querySelectorAll('.view-mode')];
  const slug = (link) => link.dataset.preview.split('/').pop().replace('.webp', '');
  let request = 0;
  let selected = links[0];
  const show = async (link) => {
    if (!link || link === selected) return;
    selected = link;
    const ticket = ++request;
    viewer.style.setProperty('--focus', link.dataset.accent);
    links.forEach((item) => { item.closest('.tile').classList.toggle('is-active', item === link); item.setAttribute('aria-current', item === link ? 'true' : 'false'); });
    lenses.forEach((button) => {
      const active = button.dataset.lens === slug(link);
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    const next = new Image();
    next.src = link.dataset.preview;
    try { await next.decode(); } catch { return; }
    if (ticket !== request) return;
    document.getElementById('download-current').href = link.href;
    image.src = next.src;
    stage.scrollTop = 0;
    image.alt = `First page of Adil Sukumar’s ${link.dataset.title} resume`;
    document.getElementById('preview-title').textContent = link.dataset.title;
    document.getElementById('preview-detail').textContent = `${link.dataset.pages} · ${link.dataset.detail}`;
    ['preview-link', 'preview-open'].forEach((id) => {
      const anchor = document.getElementById(id);
      anchor.href = link.href;
      anchor.setAttribute('aria-label', `Open ${link.dataset.title} resume PDF`);
    });
  };
  document.querySelector('.lens-rail').hidden = false;
  document.querySelector('.view-modes').hidden = false;
  lenses.forEach((button, index) => {
    const select = () => show(links.find((link) => slug(link) === button.dataset.lens));
    button.addEventListener('click', select);
    button.addEventListener('focus', select);
    button.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % lenses.length;
      else if (event.key === 'ArrowLeft') next = (index + lenses.length - 1) % lenses.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = lenses.length - 1;
      else return;
      event.preventDefault();
      lenses[next].focus();
    });
  });
  modes.forEach((button) => button.addEventListener('click', () => {
    viewer.classList.toggle('is-reading', button.dataset.mode === 'reading');
    modes.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
  }));
  const zoom = document.getElementById('zoom-preview');
  zoom.addEventListener('click', () => {
    const enlarged = viewer.classList.toggle('is-zoomed');
    zoom.setAttribute('aria-pressed', String(enlarged));
    zoom.setAttribute('aria-label', enlarged ? 'Fit resume to width' : 'Zoom in on resume');
    zoom.innerHTML = enlarged ? '<span>Fit width </span>−' : '<span>Zoom in </span>+';
  });
  links[0].setAttribute('aria-current', 'true');
  const dialog = document.getElementById('preview-dialog');
  const expand = document.getElementById('expand-preview');
  const dialogImage = document.getElementById('dialog-image');
  const updateReader = (link) => {
    show(link);
    dialogImage.src = link.dataset.preview;
    dialogImage.alt = `${link.dataset.title} resume, enlarged first-page preview`;
    document.getElementById('dialog-title').textContent = `${link.dataset.title} resume`;
    document.getElementById('dialog-open').href = link.href;
    document.getElementById('reader-position').textContent = `${link.dataset.title} · ${links.indexOf(link) + 1} of ${links.length}`;
  };
  const moveReader = (direction) => updateReader(links[(links.indexOf(selected) + direction + links.length) % links.length]);
  if (expand && dialog && typeof dialog.showModal === 'function') {
    expand.hidden = false;
    document.querySelector('.reader-navigation').hidden = false;
    const openReader = () => { updateReader(selected); dialog.showModal(); };
    expand.addEventListener('click', openReader);
    const mobileReader = document.getElementById('mobile-reader');
    if (mobileReader) { mobileReader.hidden = false; mobileReader.addEventListener('click', openReader); }
    document.getElementById('reader-previous').addEventListener('click', () => moveReader(-1));
    document.getElementById('reader-next').addEventListener('click', () => moveReader(1));
    document.getElementById('dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      moveReader(event.key === 'ArrowLeft' ? -1 : 1);
    });
    dialog.addEventListener('click', (event) => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
  }
  links.forEach((link) => {
    link.setAttribute('aria-label', `Preview ${link.dataset.title} resume`);
    link.addEventListener('click', (event) => { event.preventDefault(); show(link); });
    link.addEventListener('focus', () => show(link));
    if (finePointer && !reduced) {
      const tile = link.closest('.tile');
      tile.addEventListener('pointermove', (event) => {
        const rect = tile.getBoundingClientRect();
        tile.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
        tile.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
      }, { passive: true });
    }
  });
  if (finePointer && !lowPower) {
    stage.addEventListener('pointermove', (event) => {
      const rect = stage.getBoundingClientRect();
      stage.style.setProperty('--tilt-x', `${((event.clientX - rect.left) / rect.width - .5) * 9}deg`);
      stage.style.setProperty('--tilt-y', `${((event.clientY - rect.top) / rect.height - .5) * -6}deg`);
    }, { passive: true });
    stage.addEventListener('pointerleave', () => {
      stage.style.setProperty('--tilt-x', '0deg');
      stage.style.setProperty('--tilt-y', '0deg');
    });
  }
})();
