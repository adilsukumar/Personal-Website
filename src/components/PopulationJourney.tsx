"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import Globe from "./Globe";
import Vortex from "./Vortex";
import {
  BIRTHS_PER_SECOND,
  DEATHS_PER_SECOND,
  estimateWorldPopulation,
  formatWithCommas,
  splitIntoGroups,
} from "@/lib/population";
import { useIsLowPowerDevice } from "@/lib/useIsLowPowerDevice";

// New Delhi — where I'm from.
const INDIA = { lat: 28.6139, lng: 77.209 };

// Marker config doesn't scale with device tier — one marker sphere is
// negligible cost regardless — so it stays a plain module constant, unlike
// the dot density below.
const MARKER_CONFIG = { markers: [INDIA], color: "#22d3ee", size: 38 };

const STAGE_COUNT = 8;
const STAGE_VH = 95;

/** Deterministic on first paint (server + client match), corrected to a real
 *  "now" estimate right after mount, then random-walked forever after —
 *  weighted by real global birth/death rates — so the number visibly ticks
 *  up and down like real births and deaths would, while still trending
 *  upward like the real thing does. */
function useLivePopulation(updateInterval: number) {
  const [storyPop, setStoryPop] = useState(() => estimateWorldPopulation());
  const [livePop, setLivePop] = useState(() => estimateWorldPopulation());

  useEffect(() => {
    const birthProbability =
      BIRTHS_PER_SECOND / (BIRTHS_PER_SECOND + DEATHS_PER_SECOND);

    // The clock is the "external system" here: on mount, sync once to a real
    // now-estimate (the lazy useState above only had a build-deterministic
    // anchor value, kept that way so server and client render the same
    // markup on first paint), then keep subscribing to it via the interval.
    const syncToNow = () => {
      const now = estimateWorldPopulation(Date.now());
      setStoryPop(now);
      setLivePop(now);
    };
    syncToNow();

    const id = setInterval(() => {
      setLivePop((prev) => prev + (Math.random() < birthProbability ? 1 : -1));
    }, updateInterval);
    return () => clearInterval(id);
  }, [updateInterval]);

  return { storyPop, livePop };
}

export default function PopulationJourney() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isLowPower = useIsLowPowerDevice();
  const isNearViewport = useInView(wrapperRef, { margin: "100% 0px 100% 0px" });
  const { storyPop, livePop } = useLivePopulation(isLowPower ? 1000 : 300);
  const groups = useMemo(() => splitIntoGroups(storyPop), [storyPop]);

  // Memoized (not a plain module constant like MARKER_CONFIG) because this
  // one DOES need to change — once, right after mount, if isLowPower flips
  // true — and Globe rebuilds its whole WebGL scene whenever this object's
  // reference changes, so it needs a stable identity in between rather than
  // a fresh object every render.
  const dotsConfig = useMemo(
    () => ({ color: "#8fb4ff", size: 4, density: isLowPower ? 3 : 7, allDots: false }),
    [isLowPower]
  );

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });
  const stage = useTransform(scrollYProgress, [0, 1], [0, STAGE_COUNT]);

  // Globe and Vortex are each a full WebGL context of their own, and in
  // testing this environment couldn't keep two alive at once — creating the
  // second while the first was still up reliably threw "Cannot read
  // properties of null (reading 'precision')" out of THREE's
  // WebGLCapabilities and took the whole canvas stack down with it
  // (confirmed: retiming *when* that happened didn't help, only ever having
  // one mounted does). So the two are mutually exclusive below — Globe
  // unmounts (running its real cleanup: cancelAnimationFrame, disconnect the
  // resize observer, renderer.dispose(), remove the canvas) in the same
  // commit that mounts Vortex, and React guarantees that ordering by running
  // all effect cleanups for a commit before any new effect setups. That also
  // means the globe can't stay zoomed on India through the collapse — the
  // dedicated CSS glow + name reveal at the very end carries that beat
  // instead, independent of any globe/marker projection math.
  const [showVortex, setShowVortex] = useState(false);
  useMotionValueEvent(stage, "change", (v) => {
    if (v > 4.8) setShowVortex(true);
    else if (v < 4.6) setShowVortex(false);
  });

  const globeOpacity = useTransform(stage, [4.2, 4.8], [1, 0]);
  const vortexOpacity = useTransform(
    stage,
    [4.6, 5.3, 7.0, 7.6],
    [0, 0.6, 0.55, 0]
  );
  const finalOpacity = useTransform(stage, [7.05, 7.45], [0, 1]);

  const opacity0 = useTransform(stage, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const opacity1 = useTransform(stage, [1, 1.15, 1.85, 2], [0, 1, 1, 0]);
  const opacity2 = useTransform(stage, [2, 2.15, 2.85, 3], [0, 1, 1, 0]);
  const opacity3 = useTransform(stage, [3, 3.15, 3.85, 4], [0, 1, 1, 0]);
  const opacity4 = useTransform(stage, [4, 4.15, 4.85, 5], [0, 1, 1, 0]);
  const opacity5 = useTransform(stage, [5, 5.15, 5.85, 6], [0, 1, 1, 0]);
  const opacity6 = useTransform(stage, [6, 6.15, 6.85, 7], [0, 1, 1, 0]);

  const y0 = useTransform(stage, [0, 0.15, 0.85, 1], [16, 0, 0, -16]);
  const y1 = useTransform(stage, [1, 1.15, 1.85, 2], [16, 0, 0, -16]);
  const y2 = useTransform(stage, [2, 2.15, 2.85, 3], [16, 0, 0, -16]);
  const y3 = useTransform(stage, [3, 3.15, 3.85, 4], [16, 0, 0, -16]);
  const y4 = useTransform(stage, [4, 4.15, 4.85, 5], [16, 0, 0, -16]);
  const y5 = useTransform(stage, [5, 5.15, 5.85, 6], [16, 0, 0, -16]);
  const y6 = useTransform(stage, [6, 6.15, 6.85, 7], [16, 0, 0, -16]);

  return (
    <section
      id="story"
      ref={wrapperRef}
      className="relative bg-black"
      style={{ height: `${STAGE_COUNT * STAGE_VH}vh` }}
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">
        {/* Globe — unmounted (not just faded) once the vortex takes over; see
            the note above showVortex for why the two never coexist. */}
        {isNearViewport && !showVortex && (
          <motion.div className="absolute inset-0 z-0" style={{ opacity: globeOpacity }}>
            <Globe
              speed={1.6}
              smoothing={7}
              direction="left"
              initialLatitude={12}
              initialLongitude={55}
              scale={7.5}
              dots={dotsConfig}
              oceanColor="#03040a"
              outlineColor="#3b4a6b"
              showOutline
              graticuleColor="#1c2338"
              showGrid
              outlineWidth={1}
              detail={isLowPower ? 3 : 5}
              maxFps={isLowPower ? 24 : 60}
              pixelRatioCap={isLowPower ? 1 : 2}
              stopOnHover={false}
              markerConfig={MARKER_CONFIG}
            />
          </motion.div>
        )}

        {/* Tornado transition, gathering as the story approaches "one person" */}
        {isNearViewport && showVortex && (
          <motion.div
            className="pointer-events-none absolute inset-0 z-10 mix-blend-screen"
            style={{ opacity: vortexOpacity }}
          >
            <Vortex
              background="transparent"
              topRadius={340}
              waistRadius={40}
              waistPosition={50}
              bottomRadius={1100}
              twist={4}
              zoom={80}
              speed={7}
              direction="right"
              lineOptions={{ count: isLowPower ? 36 : 180, color: "#67e8f9", glow: isLowPower ? 3 : 6 }}
              dots
              dotOptions={{ count: isLowPower ? 420 : 2800, size: 14, color: "#a78bfa", glow: isLowPower ? 3 : 6, flicker: 8 }}
              comets
              cometOptions={{ count: isLowPower ? 1 : 6, speed: 7, color: "#f472b6", glow: isLowPower ? 2 : 5, tail: isLowPower ? 10 : 16, delay: 6, collide: isLowPower ? 0 : 4 }}
              maxFps={isLowPower ? 24 : 60}
            />
          </motion.div>
        )}

        {/* Narrative text */}
        <div className="pointer-events-none absolute inset-0 z-20">
          <motion.div
            style={{ opacity: opacity0, y: y0 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center"
          >
            <p className="font-mono text-xs tracking-[0.35em] text-cyan-300/80 uppercase sm:text-sm">
              World population
            </p>
            <p className="max-w-2xl text-2xl text-gray-200 sm:text-3xl">
              Right now, on Earth, there are approximately
            </p>
          </motion.div>

          <motion.div
            style={{ opacity: opacity1, y: y1 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center"
          >
            <p className="text-5xl font-bold text-white sm:text-7xl">
              {groups.billions} billion
            </p>
          </motion.div>

          <motion.div
            style={{ opacity: opacity2, y: y2 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center"
          >
            <p className="text-4xl font-bold text-white sm:text-6xl">
              {groups.billions} billion
            </p>
            <p className="text-4xl font-bold text-cyan-300 sm:text-6xl">
              {groups.millions} million
            </p>
          </motion.div>

          <motion.div
            style={{ opacity: opacity3, y: y3 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center"
          >
            <p className="text-3xl font-bold text-white sm:text-5xl">
              {groups.billions} billion
            </p>
            <p className="text-3xl font-bold text-cyan-300 sm:text-5xl">
              {groups.millions} million
            </p>
            <p className="text-3xl font-bold text-purple-300 sm:text-5xl">
              {groups.thousands} thousand
            </p>
          </motion.div>

          <motion.div
            style={{ opacity: opacity4, y: y4 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center"
          >
            <p className="font-mono text-3xl font-bold tabular-nums text-white sm:text-5xl">
              {formatWithCommas(livePop)}
            </p>
            <p className="text-lg text-gray-300">people, alive, right now.</p>
          </motion.div>

          <motion.div
            style={{ opacity: opacity5, y: y5 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center"
          >
            <p className="font-mono text-3xl font-bold tabular-nums text-white sm:text-5xl">
              {formatWithCommas(livePop)}
            </p>
            <p className="max-w-md text-base text-gray-400">
              …and counting. Roughly one birth every quarter second, one
              death every half second.
            </p>
          </motion.div>

          <motion.div
            style={{ opacity: opacity6, y: y6 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center"
          >
            <p className="max-w-xl text-3xl text-gray-200 sm:text-4xl">
              Out of every single one of them…
            </p>
          </motion.div>
        </div>

        {/* Final beat — the tease, not the reveal. Deliberately withholds the
            name: Hero (the very next section) delivers that as the payoff,
            picking up directly from "one person" with "That one person" /
            "ADIL SUKUMAR". */}
        <motion.div
          style={{ opacity: finalOpacity }}
          className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center gap-5 bg-black/50 px-6 text-center"
        >
          <div className="relative h-4 w-4">
            <div className="absolute inset-0 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_70px_22px_rgba(34,211,238,0.75)]" />
          </div>
          <p className="text-xl text-gray-300 sm:text-2xl">there is exactly</p>
          <p className="text-4xl font-bold text-white sm:text-6xl">one person.</p>
        </motion.div>
      </div>
    </section>
  );
}
