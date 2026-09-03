"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The normal arrow-pointer shape, just drawn bigger — not an abstract dot,
 * ring, or blob standing in for it. Positioned with no centering offset:
 * like a real cursor, it's the TIP of the arrow that sits exactly on the
 * pointer, not the icon's center, and tracked with zero lag/easing so it
 * reads as a genuinely enlarged cursor rather than something trailing it.
 *
 * Left off entirely on touch devices (no persistent pointer to track) and
 * under prefers-reduced-motion.
 */
export default function CustomCursor() {
  const [active, setActive] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!hasFinePointer || reducedMotion) return;

    const activate = () => setActive(true);
    activate();

    // Both an inline style AND a class-driven stylesheet rule (globals.css)
    // set `cursor: none` on <html> — belt and suspenders. The class alone
    // depends on that stylesheet rule actually winning the cascade against
    // any `cursor: pointer` a link/button sets on itself directly (which
    // wins over an ancestor by default regardless of the ancestor's
    // specificity, since a direct rule always beats an inherited one); an
    // `!important` universal-selector rule should already cover that, but
    // an inline style set with "important" priority is the strongest
    // override CSS has, and removes any doubt about why the real cursor
    // might still be showing through.
    //
    // Hiding is deferred until the custom cursor actually has a position
    // to show (i.e. the first pointermove) rather than applied immediately
    // on mount — doing it immediately left a real gap with NEITHER cursor
    // visible, since the custom one had no position yet.
    const onPointerMove = (e: PointerEvent) => {
      document.documentElement.classList.add("custom-cursor-active");
      document.documentElement.style.setProperty("cursor", "none", "important");
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.classList.remove("custom-cursor-active");
      document.documentElement.style.removeProperty("cursor");
    };
  }, []);

  if (!active) return null;

  return (
    <div
      ref={cursorRef}
      className="pointer-events-none fixed top-0 left-0 z-[100]"
      style={{ willChange: "transform" }}
    >
      <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"
          fill="white"
          stroke="black"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
