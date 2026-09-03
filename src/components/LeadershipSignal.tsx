"use client";

import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Activity, Radio, Users } from "lucide-react";
import { useIsLowPowerDevice } from "@/lib/useIsLowPowerDevice";

type LeadershipRole = {
  role: string;
  signalLabel: string;
  org: string;
  date: string;
  phase: "Lead" | "Build" | "Represent";
  amplitude: number;
  x: number;
};

const SIGNAL_ROLES: LeadershipRole[] = [
  {
    role: "President",
    signalLabel: "PRESIDENT",
    org: "The NeuroByte Society, VIT",
    date: "Dec 2025 – Present",
    phase: "Lead",
    amplitude: 148,
    x: 70,
  },
  {
    role: "Secretary",
    signalLabel: "SECRETARY",
    org: "WiCyS Student Chapter, VIT",
    date: "Dec 2025 – Present",
    phase: "Lead",
    amplitude: 128,
    x: 190,
  },
  {
    role: "Core Member, Technical Market Analyst Team",
    signalLabel: "TECH ANALYST",
    org: "The FinTech Club, VIT",
    date: "Dec 2025 – Present",
    phase: "Build",
    amplitude: 100,
    x: 310,
  },
  {
    role: "Core Member, Event Management",
    signalLabel: "EVENT CORE",
    org: "VITERA Club, VIT",
    date: "Dec 2025 – May 2026",
    phase: "Build",
    amplitude: 86,
    x: 430,
  },
  {
    role: "Core Member, Technical Team",
    signalLabel: "TECHNICAL CORE",
    org: "GSoC Innovators Club, VIT Bhopal",
    date: "Jun 2026 – Present",
    phase: "Build",
    amplitude: 92,
    x: 550,
  },
  {
    role: "Volunteer",
    signalLabel: "UBA VOLUNTEER",
    org: "Unnat Bharat Abhiyan, VIT Bhopal",
    date: "Academic Year 2025–26",
    phase: "Represent",
    amplitude: 78,
    x: 670,
  },
  {
    role: "Campus Ambassador",
    signalLabel: "AMBASSADOR",
    org: "Udghosh, IIT Kanpur",
    date: "Jul 2025 – Oct 2025",
    phase: "Represent",
    amplitude: 72,
    x: 790,
  },
  {
    role: "Delegate of Singapore",
    signalLabel: "DELEGATE",
    org: "DMUN Model League of Nations 2025",
    date: "Sep 2025 – Oct 2025",
    phase: "Represent",
    amplitude: 64,
    x: 900,
  },
  {
    role: "Student Partner",
    signalLabel: "STUDENT PARTNER",
    org: "Internshala",
    date: "Aug 2025 – Oct 2025",
    phase: "Represent",
    amplitude: 58,
    x: 1010,
  },
  {
    role: "Student Council Member",
    signalLabel: "COUNCIL",
    org: "Sunbeam CBSE & Matric Schools",
    date: "Nov 2023 – May 2025",
    phase: "Represent",
    amplitude: 66,
    x: 1130,
  },
];

const VIEWBOX_WIDTH = 1200;
const VIEWBOX_HEIGHT = 380;
const BASELINE = 238;

function createSignalPath(scale: number, phase: number, reflected = false) {
  const points: string[] = [];

  for (let x = 0; x <= VIEWBOX_WIDTH; x += 5) {
    const signal = SIGNAL_ROLES.reduce((sum, role, index) => {
      const width = index < 2 ? 27 : 24;
      const distance = (x - role.x) / width;
      return sum + role.amplitude * Math.exp(-(distance * distance) / 2);
    }, 0);
    const proximity = Math.min(signal / 85, 1);
    const texture = Math.sin(x * 0.12 + phase) * 3.2 * proximity + Math.sin(x * 0.035 + phase) * 1.4;
    const direction = reflected ? 0.46 : -1;
    const y = BASELINE + signal * scale * direction + texture * (reflected ? 0.35 : 1);
    points.push(`${x === 0 ? "M" : "L"} ${x} ${y.toFixed(2)}`);
  }

  return points.join(" ");
}

const SIGNAL_LAYERS = [
  { path: createSignalPath(1, 0), opacity: 0.95, width: 2.2 },
  { path: createSignalPath(0.87, 1.4), opacity: 0.58, width: 1.2 },
  { path: createSignalPath(0.72, 2.8), opacity: 0.38, width: 1 },
  { path: createSignalPath(0.56, 4.2), opacity: 0.24, width: 0.8 },
];

const REFLECTED_LAYERS = [
  { path: createSignalPath(1, 0, true), opacity: 0.25, width: 1.2 },
  { path: createSignalPath(0.72, 2.8, true), opacity: 0.14, width: 0.8 },
];

const SPECTRUM_BARS = Array.from({ length: 96 }, (_, index) => ({
  index,
  x: (index / 95) * VIEWBOX_WIDTH,
  height: 9 + ((index * 47) % 46),
  opacity: 0.08 + (index % 5) * 0.025,
}));

function SignalReadout({ role, index }: { role: LeadershipRole; index: number }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.article
        key={`${role.role}-${role.org}`}
        aria-live="polite"
        initial={{ opacity: 0, y: 10, filter: "blur(7px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -8, filter: "blur(5px)" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full overflow-hidden rounded-[1.35rem] border border-cyan-200/30 bg-[#041117]/85 p-4 shadow-[0_20px_70px_rgba(0,0,0,0.52),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl md:max-w-[23rem] lg:max-w-[28rem] lg:p-5"
      >
        <div aria-hidden="true" className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />
        <div aria-hidden="true" className="absolute -top-20 -right-16 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative flex gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-300/[0.06] text-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.14)]">
            <Activity className="h-6 w-6" strokeWidth={1.6} />
          </span>
          <div className="min-w-0">
            <p className="font-mono text-[10px] tracking-[0.22em] text-cyan-300 uppercase lg:text-[11px]">
              Signal {String(index + 1).padStart(2, "0")}
            </p>
            <h4 className="mt-1 truncate text-xl font-semibold tracking-[0.03em] text-white uppercase lg:text-2xl">
              {role.role}
            </h4>
            <p className="mt-1.5 truncate text-sm text-slate-300 lg:text-base">{role.org}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[9px] tracking-[0.13em] uppercase lg:text-[10px]">
              <span className="text-slate-500">{role.date}</span>
              <span className="flex items-center gap-1.5 text-cyan-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.8)]" />
                Active
              </span>
            </div>
          </div>
        </div>
      </motion.article>
    </AnimatePresence>
  );
}

function DesktopSignal() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = Boolean(useReducedMotion());
  const isLowPower = useIsLowPowerDevice();
  const limitAmbientMotion = reducedMotion || isLowPower;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const scanLeft = useTransform(scrollYProgress, [0, 1], ["7.5%", "94.2%"]);
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const handoffOpacity = useTransform(scrollYProgress, (value) =>
    value < 0.94 ? 1 : Math.max(0, (1 - value) / 0.06),
  );
  const handoffY = useTransform(scrollYProgress, (value) =>
    value < 0.94 ? 0 : -28 * ((value - 0.94) / 0.06),
  );

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const nextIndex = Math.min(SIGNAL_ROLES.length - 1, Math.floor(latest * SIGNAL_ROLES.length));
    setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
  });

  const activeRole = SIGNAL_ROLES[activeIndex];

  return (
    <div ref={sectionRef} className="relative hidden md:block" style={{ height: `${SIGNAL_ROLES.length * 200}vh` }}>
      <motion.div style={{ opacity: handoffOpacity, y: handoffY }} className="sticky top-0 flex h-screen min-h-[700px] flex-col justify-center overflow-hidden py-16 lg:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="performance-glow absolute top-[22%] left-[12%] h-64 w-64 rounded-full bg-cyan-400/[0.06] blur-[90px]" />
          <div className="performance-glow absolute right-[8%] bottom-[17%] h-72 w-72 rounded-full bg-violet-500/[0.08] blur-[105px]" />
        </div>

        <div className="flex shrink-0 items-start justify-between gap-6">
          <div>
            <p className="mb-3 font-mono text-[10px] tracking-[0.38em] text-cyan-200/65 uppercase lg:text-[11px]">Beyond the orbit</p>
            <h3 id="leadership-signal-title" className="text-3xl font-semibold tracking-tight text-white lg:text-5xl">
              Leadership <span className="font-light text-slate-300">&amp; activities</span>
            </h3>
            <p className="mt-2 text-sm text-slate-500 lg:mt-3 lg:text-base">Every role leaves a signal.</p>
          </div>
          <SignalReadout role={activeRole} index={activeIndex} />
        </div>

        <div className="relative mt-3 min-h-0 flex-1">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:42px_42px] [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]"
          />

          <svg
            aria-hidden="true"
            viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full overflow-visible"
          >
            <defs>
              <linearGradient id="signal-gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#67e8f9" />
                <stop offset="48%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
              <linearGradient id="signal-reflection" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.65" />
              </linearGradient>
              <filter id="signal-glow" x="-10%" y="-50%" width="120%" height="200%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <radialGradient id="active-signal-aura">
                <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#67e8f9" stopOpacity="0" />
              </radialGradient>
            </defs>

            {Array.from({ length: 15 }, (_, index) => (
              <line
                key={`grid-${index}`}
                x1={(index / 14) * VIEWBOX_WIDTH}
                x2={(index / 14) * VIEWBOX_WIDTH}
                y1="35"
                y2="335"
                stroke="#ffffff"
                strokeOpacity="0.045"
              />
            ))}

            {(isLowPower ? SPECTRUM_BARS.filter((bar) => bar.index % 3 === 0) : SPECTRUM_BARS).map((bar) => (
              <motion.line
                key={`spectrum-${bar.index}`}
                x1={bar.x}
                x2={bar.x}
                y1={BASELINE - bar.height}
                y2={BASELINE + bar.height}
                stroke={bar.index < 48 ? "#22d3ee" : "#a855f7"}
                strokeOpacity={bar.opacity}
                animate={
                  limitAmbientMotion
                    ? { y1: BASELINE - bar.height * 0.72, y2: BASELINE + bar.height * 0.72 }
                    : { y1: [BASELINE - bar.height * 0.55, BASELINE - bar.height, BASELINE - bar.height * 0.55], y2: [BASELINE + bar.height * 0.55, BASELINE + bar.height, BASELINE + bar.height * 0.55] }
                }
                transition={{ duration: 2.2 + (bar.index % 7) * 0.17, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}

            <line x1="0" x2={VIEWBOX_WIDTH} y1={BASELINE} y2={BASELINE} stroke="#ffffff" strokeOpacity="0.19" />

            <motion.circle
              cy={BASELINE}
              r="88"
              fill="url(#active-signal-aura)"
              animate={{ cx: activeRole.x }}
              transition={{ type: "spring", stiffness: 120, damping: 23 }}
            />

            {REFLECTED_LAYERS.map((layer, index) => (
              <path
                key={`reflection-${index}`}
                d={layer.path}
                fill="none"
                stroke="url(#signal-reflection)"
                strokeWidth={layer.width}
                strokeOpacity={layer.opacity}
              />
            ))}

            {SIGNAL_LAYERS.map((layer, index) => (
              <motion.path
                key={`signal-${index}`}
                d={layer.path}
                fill="none"
                stroke="url(#signal-gradient)"
                strokeWidth={layer.width}
                strokeOpacity={layer.opacity}
                strokeLinecap="round"
                filter={index === 0 ? "url(#signal-glow)" : undefined}
                initial={reducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.25, delay: index * 0.08, ease: "easeOut" }}
              />
            ))}

            <motion.line
              x1={activeRole.x}
              x2={activeRole.x}
              y1={BASELINE - activeRole.amplitude - 18}
              y2={BASELINE + 76}
              stroke="#67e8f9"
              strokeOpacity="0.32"
              strokeDasharray="2 6"
              animate={{ x1: activeRole.x, x2: activeRole.x, y1: BASELINE - activeRole.amplitude - 18 }}
              transition={{ type: "spring", stiffness: 120, damping: 23 }}
            />
          </svg>

          <motion.div
            aria-hidden="true"
            className="absolute top-[8%] bottom-[8%] z-10 w-px bg-cyan-100 shadow-[0_0_8px_2px_rgba(34,211,238,0.7),0_0_35px_8px_rgba(34,211,238,0.2)]"
            style={{ left: reducedMotion ? `${(activeRole.x / VIEWBOX_WIDTH) * 100}%` : scanLeft }}
          >
            <span className="absolute top-[58%] left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-cyan-100 bg-black shadow-[0_0_12px_rgba(103,232,249,0.9)]" />
          </motion.div>

          {SIGNAL_ROLES.map((role, index) => {
            const isActive = index === activeIndex;
            const top = ((BASELINE - role.amplitude) / VIEWBOX_HEIGHT) * 100;

            return (
              <button
                key={`${role.role}-${role.org}`}
                type="button"
                aria-label={`View signal ${index + 1}: ${role.role} at ${role.org}`}
                aria-pressed={isActive}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onClick={() => setActiveIndex(index)}
                className="group absolute z-20 -translate-x-1/2 -translate-y-full text-center focus-visible:outline-none"
                style={{ left: `${(role.x / VIEWBOX_WIDTH) * 100}%`, top: `${top}%` }}
              >
                <span className={`block font-mono text-[10px] tracking-[0.12em] uppercase transition-colors lg:text-[11px] ${isActive ? "text-cyan-200" : "text-slate-500 group-hover:text-slate-300"}`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={`mt-1 block max-w-28 text-[10px] font-medium leading-4 tracking-[0.07em] uppercase transition-colors lg:max-w-32 lg:text-[11px] ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`}>
                  {role.signalLabel}
                </span>
                <span className={`mx-auto mt-2 block h-2 w-2 rounded-full border transition-all ${isActive ? "scale-125 border-cyan-100 bg-cyan-300 shadow-[0_0_14px_3px_rgba(34,211,238,0.72)]" : "border-white/50 bg-black group-hover:border-cyan-300"}`} />
              </button>
            );
          })}
        </div>

        <div className="grid shrink-0 grid-cols-[2fr_2fr_4fr] gap-5 px-[5%]">
          {[
            { label: "Lead", color: "cyan" },
            { label: "Build", color: "blue" },
            { label: "Represent", color: "violet" },
          ].map((phase) => (
            <div key={phase.label} className="text-center">
              <p className={`mb-2 font-mono text-[11px] tracking-[0.3em] uppercase lg:text-xs ${phase.color === "cyan" ? "text-cyan-300" : phase.color === "blue" ? "text-blue-300" : "text-violet-300"}`}>
                {phase.label}
              </p>
              <div className={`h-px bg-gradient-to-r from-transparent ${phase.color === "cyan" ? "via-cyan-300/80" : phase.color === "blue" ? "via-blue-400/80" : "via-violet-400/80"} to-transparent`} />
            </div>
          ))}
        </div>

        <div className="mt-4 shrink-0">
          <div className="flex items-center justify-center gap-3 font-mono text-[10px] tracking-[0.3em] text-slate-400 uppercase lg:text-[11px]">
            <Radio className="h-3.5 w-3.5 text-cyan-300/70" strokeWidth={1.5} />
            Scroll to tune
          </div>
          <div className="relative mt-3 h-px bg-white/15">
            <motion.div className="absolute inset-y-0 left-0 origin-left bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 shadow-[0_0_8px_rgba(34,211,238,0.35)]" style={{ scaleX: reducedMotion ? 1 : progressScale, right: 0 }} />
            {SIGNAL_ROLES.map((role, index) => (
              <button
                type="button"
                key={`progress-${role.role}`}
                aria-label={`Select ${role.role}`}
                onClick={() => setActiveIndex(index)}
                className={`absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all focus-visible:outline-none ${activeIndex === index ? "scale-125 border-cyan-200 bg-black shadow-[0_0_9px_rgba(103,232,249,0.8)]" : "border-white/30 bg-black hover:border-white/70"}`}
                style={{ left: `${(role.x / VIEWBOX_WIDTH) * 100}%` }}
              />
            ))}
          </div>
          <div className="mx-auto mt-5 grid max-w-3xl grid-cols-3 divide-x divide-white/10 text-center">
            <div><span className="text-2xl text-cyan-300">{SIGNAL_ROLES.length}</span><span className="ml-2 font-mono text-[10px] tracking-[0.2em] text-slate-400 uppercase lg:text-[11px]">Roles</span></div>
            <div><span className="text-2xl text-blue-400">3</span><span className="ml-2 font-mono text-[10px] tracking-[0.2em] text-slate-400 uppercase lg:text-[11px]">Domains</span></div>
            <div><span className="font-mono text-sm tracking-[0.18em] text-violet-300 lg:text-base">2023 → Present</span></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function MobileSignal() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeRole = SIGNAL_ROLES[activeIndex];

  return (
    <div className="py-24 md:hidden">
      <p className="mb-3 font-mono text-[9px] tracking-[0.36em] text-cyan-200/65 uppercase">Beyond the orbit</p>
      <h3 className="text-3xl font-semibold tracking-tight text-white">Leadership &amp; activities</h3>
      <p className="mt-3 text-sm text-slate-500">Every role leaves a signal.</p>

      <div className="mt-8">
        <SignalReadout role={activeRole} index={activeIndex} />
      </div>

      <div className="relative mt-10 pl-10">
        <div aria-hidden="true" className="absolute top-2 bottom-2 left-3 w-px bg-gradient-to-b from-cyan-300 via-blue-400 to-violet-400 shadow-[0_0_12px_rgba(34,211,238,0.28)]" />
        {SIGNAL_ROLES.map((role, index) => {
          const isActive = activeIndex === index;
          return (
            <motion.button
              key={`${role.role}-${role.org}`}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveIndex(index)}
              initial={{ opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: index * 0.035 }}
              className={`relative mb-3 block w-full rounded-2xl border p-4 text-left transition-colors ${isActive ? "border-cyan-300/35 bg-cyan-300/[0.06]" : "border-white/[0.08] bg-white/[0.02]"}`}
            >
              <span className={`absolute top-1/2 -left-[2.15rem] h-3 w-3 -translate-y-1/2 rounded-full border bg-black ${isActive ? "border-cyan-200 shadow-[0_0_12px_3px_rgba(34,211,238,0.55)]" : "border-violet-300/50"}`} />
              <span className="flex items-center justify-between gap-3">
                <span className="font-mono text-[8px] tracking-[0.22em] text-slate-500 uppercase">{role.phase} / {String(index + 1).padStart(2, "0")}</span>
                <Users className={`h-3.5 w-3.5 ${isActive ? "text-cyan-300" : "text-violet-300/60"}`} strokeWidth={1.5} />
              </span>
              <span className={`mt-2 block text-sm font-semibold ${isActive ? "text-white" : "text-slate-300"}`}>{role.role}</span>
              <span className="mt-1 block text-xs text-slate-500">{role.org}</span>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-3 divide-x divide-white/10 text-center">
        <div><span className="block text-xl text-cyan-300">{SIGNAL_ROLES.length}</span><span className="font-mono text-[8px] tracking-[0.16em] text-slate-500 uppercase">Roles</span></div>
        <div><span className="block text-xl text-blue-400">3</span><span className="font-mono text-[8px] tracking-[0.16em] text-slate-500 uppercase">Domains</span></div>
        <div><span className="block font-mono text-[10px] text-violet-300">2023 →</span><span className="font-mono text-[8px] tracking-[0.12em] text-slate-500 uppercase">Present</span></div>
      </div>
    </div>
  );
}

export default function LeadershipSignal() {
  return (
    <section aria-labelledby="leadership-signal-title" className="relative">
      <DesktopSignal />
      <MobileSignal />
    </section>
  );
}
