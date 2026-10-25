"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  Cpu,
  Dna,
  ShieldCheck,
} from "lucide-react";
import SectionEyebrow from "./SectionEyebrow";
import { useIsLowPowerDevice } from "@/lib/useIsLowPowerDevice";
import LeadershipSignal from "./LeadershipSignal";
import MobileOrbit from "./MobileOrbit";

type JourneyMilestone = {
  role: string;
  shortRole: string;
  company: string;
  date: string;
  marker: string;
  desc: string;
  icon: LucideIcon;
  x: number;
  y: number;
  ongoing?: boolean;
};

// Professional roles by start date; school leadership lives in the separate
// leadership section. Overlapping roles share the same growth band.
const JOURNEY: JourneyMilestone[] = [
  {
    role: "Founder & Product Developer",
    shortRole: "Founder & Product",
    company: "Spendture",
    date: "Aug 2025 – Present",
    marker: "AUG 2025",
    desc: "Develop a personal-finance product focused on budget tracking and everyday spending decisions; translate user needs into product requirements, interface workflows and implementation priorities.",
    icon: BriefcaseBusiness,
    x: 350,
    y: 330,
    ongoing: true,
  },
  {
    role: "AI & Bioinformatics Intern",
    shortRole: "AI & Bioinformatics",
    company: "Sequensolutions",
    date: "Dec 2025 – Mar 2026",
    marker: "DEC 2025",
    desc: "Ran a cloud bioinformatics pipeline on AWS (EC2, S3) replicating GATK Best Practices somatic variant calling on real CD56+ circulating tumor cell sequencing data from a published SCLC study.",
    icon: Dna,
    x: 430,
    y: 415,
  },
  {
    role: "Founder & CEO",
    shortRole: "Founder & CEO",
    company: "Pawsitive Diagnostics Pvt. Ltd.",
    date: "Feb 2026 – Present",
    marker: "FEB 2026",
    desc: "Lead software, hardware and machine learning for a wearable animal-health prototype, integrating motion, acoustic, environmental and surface-temperature sensing with individual baselines, activity recognition and context-aware alerts.",
    icon: BriefcaseBusiness,
    x: 175,
    y: 350,
    ongoing: true,
  },
  {
    role: "Product Experience & Operations Intern",
    shortRole: "Product QA",
    company: "TrustLayer Labs",
    date: "May 2026 – Jun 2026",
    marker: "MAY 2026",
    desc: "Contributed to the development and testing of web experiences for a cybersecurity awareness platform, including interface refinement, bug validation, and supporting documentation.",
    icon: ShieldCheck,
    x: 470,
    y: 165,
  },
  {
    role: "IoT & Embedded Systems Lead Intern",
    shortRole: "IoT Systems",
    company: "ElectraWireless LLC",
    date: "May 2026 – Aug 2026",
    marker: "MAY 2026",
    desc: "Co-created ELLY’s offline-first React/TypeScript ecosystem: local Web-LLM voice commands, TensorFlow.js/MobileNet appliance scanning and facial recognition, BLE/Wi-Fi discovery, MQTT and energy telemetry. Automated Capacitor iOS/Android builds with GitHub Actions.",
    icon: Cpu,
    x: 700,
    y: 90,
  },
  { role: "Student Researcher (Part-time)", shortRole: "Student Research", company: "VIT Bhopal University", date: "Jul 2026 – Present", marker: "JUL 2026", desc: "Perform sample preparation, Gram staining, microscopy and foundational tissue-culture procedures under faculty mentorship; document results and maintain aseptic conditions.", icon: Dna, x: 520, y: 52, ongoing: true },
  { role: "Data Science Job Simulation", shortRole: "Data Science Simulation", company: "British Airways", date: "Oct 2026 – Present", marker: "OCT 2026", desc: "An ongoing self-paced job simulation exploring customer-booking data, preprocessing, feature engineering and predictive analytics for airline business decisions.", icon: BriefcaseBusiness, x: 285, y: 53, ongoing: true },
];

const SPIRAL_PATH =
  "M 350 330 C 430 280 475 360 430 415 C 360 505 205 460 175 350 C 135 205 315 120 470 165 C 625 210 700 355 620 485 C 530 630 270 610 120 475 C 5 370 60 170 230 90 C 390 15 590 40 700 90 C 650 40 580 40 520 52 C 445 30 355 30 285 53";

// Measured fractions of the SVG path at each milestone coordinate. The last
// jump is intentionally large because the spiral completes its outer sweep
// before arriving at the present-day node.
const JOURNEY_PATH_STOPS = [0, 0.06, 0.16, 0.29, 0.9, 0.95, 1];
const JOURNEY_HOLD_PORTION = 0.68;

const STARS = Array.from({ length: 24 }, (_, index) => ({
  x: (index * 137 + 41) % 760,
  y: (index * 83 + 29) % 620,
  radius: index % 5 === 0 ? 1.4 : 0.75,
  delay: (index % 8) * 0.35,
}));

function OrbitNode({
  milestone,
  index,
  activeIndex,
  reducedMotion,
  onSelect,
}: {
  milestone: JourneyMilestone;
  index: number;
  activeIndex: number;
  reducedMotion: boolean;
  onSelect: (index: number) => void;
}) {
  const Icon = milestone.icon;
  const isActive = index === activeIndex;
  const isPassed = index < activeIndex;
  const xPercent = (milestone.x / 760) * 100;
  const yPercent = (milestone.y / 620) * 100;
  const labelOnLeft = milestone.x > 570 || milestone.x < 260;

  return (
    <motion.button
      type="button"
      aria-label={`${milestone.role}, ${milestone.date}`}
      aria-pressed={isActive}
      onClick={() => onSelect(index)}
      className="group absolute z-30 -translate-x-1/2 -translate-y-1/2 overflow-visible focus-visible:outline-none"
      style={{ left: `${xPercent}%`, top: `${yPercent}%` }}
      animate={{ scale: isActive ? 1.08 : 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      <span
        className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 bg-[#02070a] ring-2 ring-black backdrop-blur-xl transition-all duration-500 ${
          isActive
            ? "h-16 w-16 border-cyan-100 text-cyan-100 shadow-[0_0_20px_5px_rgba(34,211,238,0.48),inset_0_0_18px_rgba(34,211,238,0.2)]"
            : isPassed
              ? "border-violet-200/90 bg-violet-400/[0.06] text-violet-100 shadow-[0_0_16px_2px_rgba(139,92,246,0.36),inset_0_0_12px_rgba(139,92,246,0.14)]"
              : "border-cyan-100/70 bg-cyan-300/[0.04] text-cyan-100 shadow-[0_0_16px_2px_rgba(34,211,238,0.24),inset_0_0_12px_rgba(34,211,238,0.1)]"
        }`}
      >
        <span
          aria-hidden="true"
          className={`absolute inset-[-6px] rounded-full border ${isActive ? "border-cyan-200/55" : isPassed ? "border-violet-200/40" : "border-cyan-200/35"}`}
        />
        {milestone.ongoing && (
          <motion.span
            aria-hidden="true"
            className="absolute inset-[-7px] rounded-full border border-cyan-300/35"
            animate={reducedMotion ? { scale: 1, opacity: 0.5 } : { scale: [1, 1.16, 1], opacity: [0.7, 0, 0.7] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <Icon className={isActive ? "h-7 w-7" : "h-6 w-6"} strokeWidth={1.8} />
      </span>

      {index !== 0 && (
        <span
          className={`pointer-events-none absolute top-1/2 hidden -translate-y-1/2 whitespace-nowrap xl:block ${
            labelOnLeft ? "right-[calc(100%+0.9rem)] text-right" : "left-[calc(100%+0.9rem)] text-left"
          }`}
        >
          <span className={`block text-sm font-medium ${isActive ? "text-white" : "text-slate-300"}`}>
            {milestone.shortRole}
          </span>
          <span className={`mt-1 block font-mono text-[10px] tracking-[0.18em] ${isActive ? "text-cyan-300" : "text-slate-500"}`}>
            {milestone.marker}
          </span>
        </span>
      )}
    </motion.button>
  );
}

function DetailCard({ milestone, index, limitMotion }: { milestone: JourneyMilestone; index: number; limitMotion: boolean }) {
  const Icon = milestone.icon;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.article
        key={milestone.role}
        initial={{ opacity: 0, x: limitMotion ? 12 : 24, filter: limitMotion ? "none" : "blur(8px)" }}
        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, x: limitMotion ? -8 : -16, filter: limitMotion ? "none" : "blur(6px)" }}
        transition={{ duration: 0.38, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[1.5rem] border border-cyan-200/30 bg-[#061117]/80 p-4 shadow-[0_28px_90px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl lg:rounded-[1.75rem] lg:p-6 xl:p-7"
      >
        <div aria-hidden="true" className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />
        <div aria-hidden="true" className="absolute -top-28 -right-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative">
          <div className="mb-4 flex items-center justify-between gap-2 border-b border-white/10 pb-4 lg:mb-5 lg:gap-3 lg:pb-5 xl:mb-7 xl:gap-4 xl:pb-6">
            <div className="flex items-center gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan-300/50 bg-cyan-300/5 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.18)] lg:h-12 lg:w-12 xl:h-14 xl:w-14">
                <Icon className="h-6 w-6" strokeWidth={1.6} />
              </span>
              <div>
                <p className="font-mono text-[10px] tracking-[0.28em] text-cyan-300/70 uppercase">
                  Milestone {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-1 text-base font-semibold tracking-tight text-cyan-200 lg:text-lg xl:text-xl">
                  {milestone.role}
                </h3>
              </div>
            </div>
            {milestone.ongoing && (
              <span className="hidden items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/5 px-3 py-1.5 font-mono text-[9px] tracking-[0.18em] text-cyan-200 uppercase lg:flex">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" />
                Ongoing
              </span>
            )}
          </div>

          <p className="text-sm font-medium text-white lg:text-base xl:text-lg">{milestone.company}</p>
          <p className="mt-2 font-mono text-[10px] tracking-[0.16em] text-cyan-300 uppercase lg:mt-3 lg:text-xs">
            {milestone.date}
          </p>
          <div className="my-3 h-px bg-gradient-to-r from-white/15 to-transparent lg:my-4 xl:my-6" />
          <p className="text-sm leading-6 font-light text-slate-300 lg:text-xs lg:leading-6 xl:text-sm xl:leading-7">{milestone.desc}</p>

          <div className="mt-5 hidden items-center justify-between font-mono text-[9px] tracking-[0.2em] text-slate-500 uppercase lg:flex xl:mt-7">
            <span>Leadership → Engineering → Research</span>
            <span>{String(index + 1).padStart(2, "0")}/{String(JOURNEY.length).padStart(2, "0")}</span>
          </div>
        </div>
      </motion.article>
    </AnimatePresence>
  );
}

function MobileExperience() {
  const [index, setIndex] = useState(JOURNEY.length - 1);
  const reducedMotion = Boolean(useReducedMotion());
  return <div className="cinematic-adaptive pb-24">
    <SectionEyebrow number="01" label="Experience" />
    <h2 className="text-3xl font-semibold tracking-tight text-white">Professional <span className="text-cyan-200">journey</span></h2>
    <p className="mt-3 text-sm leading-6 text-slate-400">From engineering and research to the work in progress today.</p>
    <MobileOrbit label="Choose experience" items={JOURNEY.map(item => ({ title: `${item.company} — ${item.role}` }))} activeIndex={index} onSelect={setIndex} />
    <DetailCard key={JOURNEY[index].role} milestone={JOURNEY[index]} index={index} limitMotion={reducedMotion} />
  </div>;
}

export default function Experience() {
  const journeyRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const reducedMotion = Boolean(prefersReducedMotion);
  const isLowPower = useIsLowPowerDevice();
  const limitAmbientMotion = reducedMotion || isLowPower;
  const active = JOURNEY[activeIndex];
  const journeyProgress = useMotionValue(0);
  const smoothProgress = useSpring(journeyProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.45,
  });
  const ringRotation = useTransform(smoothProgress, [0, 1], [0, 22]);

  useEffect(() => {
    const journey = journeyRef.current;
    if (!journey) return;

    let animationFrame = 0;
    const updateProgress = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const scrollDistance = Math.max(journey.offsetHeight - window.innerHeight, 1);
        const sectionProgress = Math.min(1, Math.max(0, -journey.getBoundingClientRect().top / scrollDistance));
        const stageProgress = sectionProgress * JOURNEY.length;
        const nextIndex = Math.min(JOURNEY.length - 1, Math.max(0, Math.floor(stageProgress)));
        const localProgress = Math.min(1, Math.max(0, stageProgress - nextIndex));
        const travelProgress = Math.min(
          1,
          Math.max(0, (localProgress - JOURNEY_HOLD_PORTION) / (1 - JOURNEY_HOLD_PORTION)),
        );
        const easedTravel = travelProgress * travelProgress * (3 - 2 * travelProgress);
        const pathStart = JOURNEY_PATH_STOPS[nextIndex];
        const pathEnd = JOURNEY_PATH_STOPS[Math.min(nextIndex + 1, JOURNEY.length - 1)];
        const visualProgress = pathStart + (pathEnd - pathStart) * easedTravel;
        journeyProgress.set(visualProgress);
        setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
      });
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [journeyProgress]);

  const connectorPath = `M ${active.x} ${active.y} C ${Math.min(active.x + 100, 725)} ${active.y}, 710 310, 760 310`;

  const selectMilestone = (index: number) => {
    setActiveIndex(index);
    const journey = journeyRef.current;
    if (!journey) return;

    const journeyTop = window.scrollY + journey.getBoundingClientRect().top;
    const scrollDistance = Math.max(journey.offsetHeight - window.innerHeight, 0);
    window.scrollTo({
      top: journeyTop + ((index + 0.5) / JOURNEY.length) * scrollDistance,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <section id="experience" className="relative isolate border-t border-white/5 text-white [clip-path:inset(0)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 bg-black" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          className="performance-glow absolute -top-40 -left-56 h-[42rem] w-[42rem] rounded-full bg-cyan-500/[0.13] blur-[130px]"
          animate={limitAmbientMotion ? { x: 0, y: 0, scale: 1 } : { x: [0, 70, 0], y: [0, 35, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="performance-glow absolute top-[35%] -right-52 h-[38rem] w-[38rem] rounded-full bg-violet-600/[0.12] blur-[130px]"
          animate={limitAmbientMotion ? { x: 0, y: 0, scale: 1 } : { x: [0, -55, 0], y: [0, -45, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.14)_55%,rgba(0,0,0,0.72)_100%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 pt-24 md:px-12 lg:px-16 min-[2200px]:max-w-[150rem] min-[2200px]:px-24">
        <MobileExperience />

        <div ref={journeyRef} className="cinematic-desktop relative h-[1000vh]">
          <div className="sticky top-0 flex h-[100dvh] min-h-[700px] flex-col justify-center pt-20 pb-8">
            <div className="shrink-0">
              <SectionEyebrow number="01" label="Experience" />
              <div className="flex items-end justify-between gap-8">
                <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
                  Professional <span className="text-cyan-300">journey</span>
                </h2>
                <p className="hidden max-w-sm text-right text-xs leading-5 text-slate-500 lg:block">
                  A chronological growth orbit. Scroll to move from the beginning to the work still in motion today.
                </p>
              </div>
            </div>

            <div className="relative mt-6 grid min-h-0 flex-1 grid-cols-[minmax(0,1.35fr)_minmax(280px,0.9fr)] items-center gap-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)] lg:gap-8 xl:gap-12">
              <div className="relative aspect-[760/620] w-full max-h-[66vh]">
                <svg aria-hidden="true" viewBox="0 0 760 620" className="absolute inset-0 h-full w-full overflow-visible">
                  <defs>
                    <linearGradient id="journey-gradient" x1="0" y1="1" x2="1" y2="0">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="58%" stopColor="#67e8f9" />
                      <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                    <filter id="journey-glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <radialGradient id="journey-hub" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#0e2934" />
                      <stop offset="100%" stopColor="#020508" />
                    </radialGradient>
                  </defs>

                  {(isLowPower ? STARS.slice(0, 10) : STARS).map((star, index) => (
                    <motion.circle
                      key={`${star.x}-${star.y}`}
                      cx={star.x}
                      cy={star.y}
                      r={star.radius}
                      fill={index % 4 === 0 ? "#67e8f9" : "#ffffff"}
                      animate={limitAmbientMotion ? { opacity: 0.32 } : { opacity: [0.12, 0.62, 0.12] }}
                      transition={{ duration: 3.4 + (index % 4), repeat: Infinity, delay: star.delay }}
                    />
                  ))}

                  <motion.g style={{ rotate: ringRotation, transformOrigin: "350px 330px" }} opacity="0.55">
                    <circle cx="350" cy="330" r="110" fill="none" stroke="#67e8f9" strokeOpacity="0.12" strokeDasharray="2 11" />
                    <circle cx="350" cy="330" r="180" fill="none" stroke="#a78bfa" strokeOpacity="0.13" strokeDasharray="1 14" />
                    <circle cx="350" cy="330" r="258" fill="none" stroke="#67e8f9" strokeOpacity="0.09" strokeDasharray="5 19" />
                  </motion.g>

                  <path d={SPIRAL_PATH} fill="none" stroke="#ffffff" strokeOpacity="0.09" strokeWidth="2" />
                  <motion.path
                    d={SPIRAL_PATH}
                    fill="none"
                    stroke="url(#journey-gradient)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    filter="url(#journey-glow)"
                    style={{ pathLength: reducedMotion ? 1 : journeyProgress }}
                  />

                  <AnimatePresence mode="wait">
                    <motion.path
                      key={activeIndex}
                      d={connectorPath}
                      fill="none"
                      stroke="#67e8f9"
                      strokeOpacity="0.7"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: reducedMotion ? 0 : 0.45, ease: "easeOut" }}
                    />
                  </AnimatePresence>

                  <circle cx="350" cy="330" r="68" fill="url(#journey-hub)" stroke="#67e8f9" strokeOpacity="0.28" />
                  <circle cx="350" cy="330" r="78" fill="none" stroke="#a78bfa" strokeOpacity="0.18" strokeDasharray="2 8" />
                  <text x="350" y="278" textAnchor="middle" fill="#cbd5e1" fontSize="9" letterSpacing="2.5">THE BEGINNING</text>
                  <text x="350" y="392" textAnchor="middle" fill="#a78bfa" fontSize="10" letterSpacing="2">AUG 2025</text>
                </svg>

                {JOURNEY.map((milestone, index) => (
                  <OrbitNode
                    key={milestone.role}
                    milestone={milestone}
                    index={index}
                    activeIndex={activeIndex}
                    reducedMotion={limitAmbientMotion}
                    onSelect={selectMilestone}
                  />
                ))}
              </div>

              <div className="relative pr-10">
                <DetailCard milestone={active} index={activeIndex} limitMotion={limitAmbientMotion} />

                <div aria-label="Journey progress" className="absolute top-1/2 right-0 h-72 w-5 -translate-y-1/2">
                  <div className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-white/15" />
                  <motion.div
                    className="absolute top-0 left-1/2 h-full w-px origin-top -translate-x-1/2 bg-gradient-to-b from-violet-400 to-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                    style={{ scaleY: reducedMotion ? 1 : smoothProgress }}
                  />
                  {["2025", "FEB 2026", "AUG 2026", "NOW"].map((label, index) => (
                    <div key={label} className="absolute left-1/2 -translate-x-1/2" style={{ top: `${(index / 3) * 100}%` }}>
                      <span className="block h-2.5 w-2.5 -translate-y-1/2 rounded-full border border-white/50 bg-black" />
                      <span className="absolute top-1/2 left-4 -translate-y-1/2 font-mono text-[9px] tracking-[0.14em] text-slate-500">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center justify-end gap-3 pr-16 font-mono text-[9px] tracking-[0.24em] text-cyan-300/70 uppercase">
              <span>Scroll to advance</span>
              <motion.span
                aria-hidden="true"
                animate={limitAmbientMotion ? { y: 0 } : { y: [0, 6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="text-lg"
              >
                ↓
              </motion.span>
            </div>
          </div>
        </div>

        <LeadershipSignal />
      </div>
    </section>
  );
}
