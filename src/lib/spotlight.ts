import type { MouseEvent } from "react";

/**
 * Pairs with the `.spotlight-card` CSS class — writes the pointer position
 * (relative to the hovered element) into CSS custom properties the
 * radial-gradient glow reads. No ref or per-card state needed: `currentTarget`
 * is the DOM node the listener is actually attached to.
 */
export function handleSpotlightMove(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
  el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
}
