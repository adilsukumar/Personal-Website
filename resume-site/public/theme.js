(() => {
  const links = [...document.querySelectorAll('.tile-link')];
  const image = document.getElementById('preview-image');
  const viewer = document.querySelector('.viewer');
  const stage = document.querySelector('.document-stage');
  if (!image || !viewer || !stage) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const lowPower = reduced || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || (navigator.deviceMemory && navigator.deviceMemory <= 4) || navigator.connection?.saveData;
  if (lowPower) document.documentElement.classList.add('calm');
  let request = 0;
  let selected = links[0];
  const show = async (link) => {
    if (link === selected) return;
    selected = link;
    const ticket = ++request;
    links.forEach((item) => item.closest('.tile').classList.toggle('is-active', item === link));
    const next = new Image();
    next.src = link.dataset.preview;
    try { await next.decode(); } catch { return; }
    if (ticket !== request) return;
    image.src = next.src;
    image.alt = `First page of Adil Sukumar’s ${link.dataset.title} resume`;
    document.getElementById('preview-title').textContent = link.dataset.title;
    document.getElementById('preview-detail').textContent = `${link.dataset.pages} · ${link.dataset.detail}`;
    viewer.style.setProperty('--focus', link.dataset.accent);
    ['preview-link', 'preview-open'].forEach((id) => {
      const anchor = document.getElementById(id);
      anchor.href = link.href;
      anchor.setAttribute('aria-label', `Open ${link.dataset.title} resume PDF`);
    });
  };
  links.forEach((link) => {
    link.addEventListener('pointerenter', () => show(link));
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
      stage.style.setProperty('--tilt-x', `${((event.clientX - rect.left) / rect.width - .5) * 12}deg`);
      stage.style.setProperty('--tilt-y', `${((event.clientY - rect.top) / rect.height - .5) * -8}deg`);
    }, { passive: true });
    stage.addEventListener('pointerleave', () => {
      stage.style.setProperty('--tilt-x', '0deg');
      stage.style.setProperty('--tilt-y', '0deg');
    });
  }
})();
