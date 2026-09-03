"use client";

import { useEffect, useRef, useState } from "react";
import GlitterWrap from "./GlitterWrap";
import { useIsLowPowerDevice } from "@/lib/useIsLowPowerDevice";

/**
 * A calm, continuous starfield behind the whole Experience→Contact
 * stretch — one shared canvas (not one per section), so the "we're in
 * space" thread from Hero/PopulationJourney/PortraitReveal doesn't just
 * stop dead the moment those end.
 *
 * Fixed to the viewport, NOT sized to the wrapper it lives in. That
 * wrapper spans four sections' combined height (several thousand px) —
 * an earlier version sized the canvas to match, which meant redrawing a
 * canvas many times taller than anything ever visible at once (the actual
 * bottleneck behind reported lag) while also spreading the same particle
 * count across all that extra area, diluting it to the point of barely
 * registering. A fixed, viewport-sized canvas costs a fraction as much to
 * redraw and reads as clearly present rather than diluted.
 *
 * Still only mounted while some part of that wrapper is near the
 * viewport — tracked via a separate invisible sentinel div that DOES span
 * the wrapper's full height, purely for IntersectionObserver's benefit,
 * with no rendering cost of its own.
 */
export default function AmbientStarfield() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const isLowPower = useIsLowPowerDevice();

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "300px 0px 300px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        ref={sentinelRef}
        aria-hidden="true"
        className="absolute inset-0 -z-10"
      />
      {visible && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10"
        >
          <GlitterWrap
            particleCount={isLowPower ? 48 : 220}
            color1="#ffffff"
            color2="#22d3ee"
            color3="#a78bfa"
            speed={1.2}
            density={100}
            starSize={9}
            focalDepth={13}
            turbulence={0.6}
            brightness={68}
            glitterIntensity={3}
            trailAmount={100}
            maxFps={isLowPower ? 20 : 60}
            pixelRatioCap={isLowPower ? 1 : 2}
          />
        </div>
      )}
    </>
  );
}
