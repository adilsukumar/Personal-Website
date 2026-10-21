// Same pointer-tracked card spotlight as the main portfolio; no animation loop.
if (window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`);
      card.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`);
    }, { passive: true });
  });
}
