"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useIsLowPowerDevice } from "@/lib/useIsLowPowerDevice";

// 69-frame turntable (900x506 WebP, ~840KB total) scrubbed against scroll
// position — same "no independent clock" principle as Hero and
// PopulationJourney: which frame is on screen is a pure function of scroll
// progress, not a timer, so it can't be scrolled past mid-turn.
const FRAME_COUNT = 69;

// Fraction of this section's scroll spent turning through the sequence;
// the rest holds on the final (facing-forward) frame while the bio and
// stat cards reveal alongside it, so the "turning to face you" beat lands
// right as the details about that person appear.
const SEQUENCE_END = 0.5;
// 260vh originally — the turn covered so little actual scroll distance
// (130vh across 69 frames) that it read as noticeably faster/choppier than
// Hero (220vh) or PopulationJourney (760vh across its stages). Stretched
// out rather than adding more source frames (there are only 69 real photos
// to work with); combined with the crossfade in drawFrame below, this
// reads as a slow, deliberate turn instead of a quick flip.
const WRAPPER_VH = 420;

// Internal canvas resolution relative to its displayed CSS size. This is a
// soft, translucent background image, not something anyone examines up
// close — once it became a full-viewport-sized canvas (previously a small
// ~450px box) and started crossfading two full images per redraw instead
// of drawing one, that combination of "many more pixels" x "twice the
// draw calls" got expensive enough to visibly stagger page scrolling.
// Rendering well under 1:1 and letting CSS upscale the result cuts that
// cost by roughly RENDER_SCALE² with no visible quality loss for content
// this soft-focus already.
const RENDER_SCALE = 0.6;
const LOW_POWER_RENDER_SCALE = 0.35;

function framePath(i: number) {
  return `/portrait-sequence/frame-${String(i).padStart(3, "0")}.webp`;
}

/** Preloads every frame up front — at ~12KB average this is well under a
 *  second on any real connection, so there's no case for the complexity of
 *  progressive/lazy loading here. */
function usePortraitFrames() {
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new window.Image();
      img.src = framePath(i);
      img.onload = () => {
        loadedCount += 1;
        if (loadedCount === FRAME_COUNT && !cancelled) setReady(true);
      };
      images.push(img);
    }
    imagesRef.current = images;

    return () => {
      cancelled = true;
    };
  }, []);

  return { imagesRef, ready };
}

/** Draws `img` into the full canvas like CSS `object-fit: cover` — scaled
 *  to fill, cropped rather than stretched, centered. The frames are a fixed
 *  900x506 photo aspect; the section behind them is now a full-bleed
 *  background of whatever the viewport's aspect happens to be, so a plain
 *  drawImage(img, 0, 0, w, h) would visibly stretch/squash the portrait. */
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number
) {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const boxRatio = w / h;
  let sx = 0;
  let sy = 0;
  let sw = img.naturalWidth;
  let sh = img.naturalHeight;

  if (imgRatio > boxRatio) {
    sw = sh * boxRatio;
    sx = (img.naturalWidth - sw) / 2;
  } else {
    sh = sw / boxRatio;
    sy = (img.naturalHeight - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
}

export default function PortraitReveal() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawnPositionRef = useRef(-1);
  const { imagesRef, ready } = usePortraitFrames();
  const isLowPower = useIsLowPowerDevice();
  const renderScale = isLowPower ? LOW_POWER_RENDER_SCALE : RENDER_SCALE;

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // A continuous position between frames (e.g. 12.4), not a rounded index —
  // feeds the crossfade in drawFrame below.
  const currentFramePosition = () => {
    const t = Math.min(1, Math.max(0, scrollYProgress.get() / SEQUENCE_END));
    return t * (FRAME_COUNT - 1);
  };

  // Blends the two frames position sits between, rather than snapping to
  // the nearest one — 69 real photos stretched over a much longer scroll
  // distance would otherwise hold each discrete frame for a long, visibly
  // steppy stretch. Crossfading turns that into what reads as continuous
  // motion using the same 69 source images, no extra frames needed.
  const drawFrame = (position: number) => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    if (Math.abs(drawnPositionRef.current - position) < 0.01) return;

    const lower = Math.max(0, Math.min(FRAME_COUNT - 1, Math.floor(position)));
    const upper = Math.min(FRAME_COUNT - 1, lower + 1);
    const frac = position - lower;

    const imgA = imagesRef.current[lower];
    if (!imgA || !imgA.complete) return;

    // Backing store is already rendered at RENDER_SCALE, not the container's
    // full CSS size — no device-pixel-ratio transform is applied to this
    // context, so canvas.width/height (the actual pixel buffer) doubles as
    // the destination size here; the browser handles stretching that
    // smaller bitmap back up to the container's full displayed size via
    // plain CSS (width/height: 100%).
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const imgB = imagesRef.current[upper];
    if (upper === lower || frac < 0.001 || !imgB || !imgB.complete) {
      drawCover(ctx, imgA, w, h);
    } else {
      ctx.globalAlpha = 1;
      drawCover(ctx, imgA, w, h);
      ctx.globalAlpha = frac;
      drawCover(ctx, imgB, w, h);
      ctx.globalAlpha = 1;
    }
    drawnPositionRef.current = position;
  };

  // Sizes the canvas backing store to RENDER_SCALE of the container's
  // actual rendered box (see the RENDER_SCALE comment above for why this
  // is deliberately under-resolution rather than device-pixel-ratio sharp
  // like Globe/GlitterWrap size theirs).
  useEffect(() => {
    const container = canvasContainerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const resize = () => {
      const w = container.clientWidth || 1;
      const h = container.clientHeight || 1;
      canvas.width = Math.max(1, Math.round(w * renderScale));
      canvas.height = Math.max(1, Math.round(h * renderScale));
      ctxRef.current = canvas.getContext("2d");
      // A resized backing store needs its frame redrawn regardless of
      // scroll activity — read the current scroll position directly
      // rather than waiting for the next scroll event, which might not
      // come for a while if the user resized without scrolling.
      drawnPositionRef.current = -1;
      drawFrame(currentFramePosition());
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renderScale]);

  useEffect(() => {
    if (ready) drawFrame(currentFramePosition());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  // The scroll "change" event can fire more often than the display can
  // actually paint, especially during a fast scroll burst — drawing twice
  // per update (the crossfade) synchronously on every single one of those
  // events is what was staggering the page's own scroll. Recording the
  // target here is cheap; the rAF loop below does the real (now much
  // cheaper, thanks to RENDER_SCALE) drawing work at most once per frame.
  const targetPositionRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const scheduleDraw = () => {
    if (rafIdRef.current !== null) return;
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      drawFrame(targetPositionRef.current);
    });
  };

  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!ready) return;
    const t = Math.min(1, Math.max(0, v / SEQUENCE_END));
    targetPositionRef.current = t * (FRAME_COUNT - 1);
    scheduleDraw();
  });

  // Callback form, not the [input]/[output] keyframe-array form — the
  // array form gets silently promoted to a native WAAPI/ViewTimeline
  // animation by Framer Motion when it can, which (as found and fixed in
  // Hero.tsx) diverges from scrollYProgress for elements sitting inside a
  // `position: sticky` child like this one, fading back toward 0 near the
  // end instead of holding at 1. A mapping function forces the plain
  // JS-driven path instead, which matches scrollYProgress exactly.
  const rise = (v: number, from: number, to: number) =>
    Math.min(1, Math.max(0, (v - from) / (to - from)));

  const bioOpacity = useTransform(
    scrollYProgress,
    (v) => rise(v, 0.34, 0.54) * (1 - rise(v, 0.82, 0.95)),
  );
  const bioY = useTransform(
    scrollYProgress,
    (v) => 24 * (1 - rise(v, 0.34, 0.54)) - 24 * rise(v, 0.82, 0.95),
  );
  // The cards finish their exit before the sticky container releases. That
  // prevents their lower edges from being visibly sliced by the next section.
  const statsOpacity = useTransform(
    scrollYProgress,
    (v) => rise(v, 0.48, 0.7) * (1 - rise(v, 0.76, 0.9)),
  );
  const statsY = useTransform(
    scrollYProgress,
    (v) => 24 * (1 - rise(v, 0.48, 0.7)) - 30 * rise(v, 0.76, 0.9),
  );
  const transitionVeilOpacity = useTransform(scrollYProgress, (v) => rise(v, 0.8, 0.98));

  return (
    <section
      id="about"
      ref={wrapperRef}
      className="relative border-t border-white/5 bg-black"
      style={{ height: `${WRAPPER_VH}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Full-bleed portrait background — translucent but still clearly
            visible, plus a light darkening wash so text stays legible. The
            first pass at this (opacity-35 canvas stacked under an 85%-black
            gradient and a 70%-black vignette) combined into something the
            eye basically couldn't see at all — this is deliberately much
            lighter-touch. */}
        <div ref={canvasContainerRef} className="absolute inset-0">
          <canvas
            ref={canvasRef}
            className="block h-full w-full opacity-60"
          />
          {!ready && (
            <div className="absolute inset-0 flex items-center justify-center font-mono text-xs tracking-widest text-gray-600 uppercase">
              loading…
            </div>
          )}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-black/35" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.5)_100%)]" />
        <motion.div
          aria-hidden="true"
          style={{ opacity: transitionVeilOpacity }}
          className="pointer-events-none absolute inset-0 z-[5] bg-[linear-gradient(to_bottom,rgba(0,0,0,0.72),#000_72%)]"
        />

        {/* Foreground content, top-anchored rather than vertically centered.
            The previous version used flex `items-center`, which centers
            within the full h-screen box — whenever this column's natural
            content height ran close to the viewport height, that centering
            math pushed the heading's top edge above the fold, and the
            section's own overflow-hidden clipped it there. Anchoring from
            the top with fixed clearance for the fixed navbar means the
            heading always starts in the same safe place regardless of
            exactly how tall the content block ends up being.

            No overflow-y-auto here (an earlier version had it as a safety
            net for very short viewports) — that created a second, nested
            scrollbar alongside the page's own, which read as broken rather
            than helpful. If content ever runs taller than the viewport on
            a short screen, letting it be is better than a double
            scrollbar. */}
        <div className="relative z-10 h-full w-full px-6 pt-28 pb-12 md:px-24">
          <div className="mx-auto w-full max-w-2xl text-white">
            <motion.h2
              style={{ opacity: bioOpacity, y: bioY }}
              className="mb-6 text-4xl font-bold tracking-tight md:text-6xl"
            >
              Building the <span className="text-cyan-300">hardware</span> &{" "}
              <span className="text-purple-300">AI</span> of tomorrow.
            </motion.h2>
            <motion.div
              style={{ opacity: bioOpacity }}
              className="mb-8 h-1 w-20 rounded-full bg-gradient-to-r from-cyan-300 to-purple-300"
            />
            <motion.p
              style={{ opacity: bioOpacity, y: bioY }}
              className="mb-6 text-lg leading-relaxed font-light text-gray-300 sm:text-xl"
            >
              I&apos;m a student at Vellore Institute of Technology, pursuing
              a B.Tech in AI &amp; Bioinformatics. My focus is bridging the
              physical and digital worlds — embedded systems,
              microcontrollers, and biometric sensors that interface with
              machine learning pipelines.
            </motion.p>
            <motion.p
              style={{ opacity: bioOpacity, y: bioY }}
              className="mb-10 text-base leading-relaxed font-light text-gray-400 sm:text-lg"
            >
              From founding Pawsitive Diagnostics to leading The NeuroByte
              Society, I build scalable, edge-computed hardware-software
              ecosystems aimed at real-world problems.
            </motion.p>
            <motion.div
              style={{ opacity: statsOpacity, y: statsY }}
              className="mb-10 flex flex-wrap gap-4"
            >
              <a
                href="https://www.linkedin.com/in/adilsukumar"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium backdrop-blur-md transition-all hover:border-cyan-400/50 hover:bg-white/10"
              >
                LinkedIn
              </a>
              <a
                href="https://www.github.com/adilsukumar"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium backdrop-blur-md transition-all hover:border-purple-400/50 hover:bg-white/10"
              >
                GitHub
              </a>
            </motion.div>

            <motion.div
              style={{ opacity: statsOpacity, y: statsY }}
              className="grid grid-cols-2 gap-4 sm:max-w-md"
            >
              {[
                { label: "Focus", value: "AI × Bioinformatics" },
                { label: "Based in", value: "India" },
                { label: "Building", value: "Pawsitive Diagnostics" },
                { label: "Leading", value: "The NeuroByte Society" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl"
                >
                  <p className="mb-2 font-mono text-xs tracking-widest text-cyan-300/80 uppercase">
                    {item.label}
                  </p>
                  <p className="text-lg font-semibold text-white">
                    {item.value}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
