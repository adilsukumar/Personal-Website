"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import GlitterWrap from "./GlitterWrap";
import { useHeroReveal } from "@/lib/heroReveal";
import { useIsLowPowerDevice } from "@/lib/useIsLowPowerDevice";

// Tall enough that the reveal is a function of scroll POSITION, not of a
// fixed timer. The old version used whileInView + a delay ladder — fine if
// you arrive and sit still, but a fast scroll would carry you straight past
// the section before those delays ever finished, so "ADIL SUKUMAR" either
// never fully appeared or was mid-fade by the time it left the viewport.
// Driving every beat off scrollYProgress instead means there's no way to
// out-scroll it: wherever you are in the 220vh below, that's exactly what
// stage the reveal is in.
const WRAPPER_VH = 220;

export default function Hero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { setRevealed } = useHeroReveal();
  const isLowPower = useIsLowPowerDevice();
  const isNearViewport = useInView(wrapperRef, { margin: "100% 0px 100% 0px" });

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // Tells the navbar when the title has actually landed, with a little
  // hysteresis so scrolling back up past the reveal un-spoils it again
  // instead of flickering right at the boundary.
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v > 0.22) setRevealed(true);
    else if (v < 0.16) setRevealed(false);
  });

  // Callback form, not the [input]/[output] keyframe-array form: Framer
  // Motion silently promotes the array form to a native WAAPI animation
  // driven by a browser ViewTimeline when it can, which — verified in
  // testing — diverges from scrollYProgress here (it rides back down to 0
  // near the end of this 220vh wrapper instead of holding at 1, apparently
  // because the styled elements sit inside a `position: sticky` child rather
  // than being the scroll-tracked element itself). A mapping function can't
  // be expressed as static CSS keyframes, so it forces the plain JS-driven
  // path, which matches scrollYProgress exactly.
  const rise = (v: number, from: number, to: number) =>
    Math.min(1, Math.max(0, (v - from) / (to - from)));

  const eyebrowOpacity = useTransform(scrollYProgress, (v) => rise(v, 0, 0.12));
  const eyebrowY = useTransform(scrollYProgress, (v) => 12 * (1 - rise(v, 0, 0.12)));

  const titleOpacity = useTransform(scrollYProgress, (v) => rise(v, 0.08, 0.26));
  const titleY = useTransform(scrollYProgress, (v) => 24 * (1 - rise(v, 0.08, 0.26)));

  const taglineOpacity = useTransform(scrollYProgress, (v) => rise(v, 0.22, 0.4));
  const taglineY = useTransform(scrollYProgress, (v) => 20 * (1 - rise(v, 0.22, 0.4)));

  const cueOpacity = useTransform(scrollYProgress, (v) =>
    Math.min(rise(v, 0.32, 0.44), 1 - rise(v, 0.88, 1))
  );

  return (
    <section
      ref={wrapperRef}
      className="relative bg-black"
      style={{ height: `${WRAPPER_VH}vh` }}
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        <div className="absolute inset-0">
          {isNearViewport && (
            <GlitterWrap
              particleCount={isLowPower ? 84 : 420}
              color1="#ffffff"
              color2="#22d3ee"
              color3="#a78bfa"
              speed={4}
              density={100}
              starSize={16}
              focalDepth={13}
              turbulence={1}
              brightness={100}
              glitterIntensity={4}
              trailAmount={92}
              reverse={false}
              maxFps={isLowPower ? 24 : 60}
              pixelRatioCap={isLowPower ? 1 : 2}
            />
          )}
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_35%,_rgba(0,0,0,0.75)_100%)]" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <motion.p
            style={{ opacity: eyebrowOpacity, y: eyebrowY }}
            className="mb-4 font-mono text-xs tracking-[0.4em] text-cyan-300/80 uppercase"
          >
            That one person
          </motion.p>
          <motion.h1
            style={{ opacity: titleOpacity, y: titleY }}
            className="text-5xl font-bold tracking-tight text-white sm:text-7xl md:text-8xl"
          >
            ADIL SUKUMAR
          </motion.h1>
          <motion.p
            style={{ opacity: taglineOpacity, y: taglineY }}
            className="mt-6 max-w-xl text-base text-gray-300 sm:text-lg"
          >
            Builder at the intersection of hardware, AI, and biology —
            trying to make a dent.
          </motion.p>

          <motion.div
            style={{ opacity: cueOpacity }}
            className="absolute bottom-10 flex flex-col items-center gap-2 text-gray-400"
          >
            <span className="font-mono text-[11px] tracking-[0.3em] uppercase">
              Scroll
            </span>
            <motion.svg
              animate={isLowPower ? { y: 0 } : { y: [0, 8, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </motion.svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
