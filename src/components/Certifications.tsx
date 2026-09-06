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
import { Award, GraduationCap, Trophy } from "lucide-react";
import { useIsLowPowerDevice } from "@/lib/useIsLowPowerDevice";
import SectionEyebrow from "./SectionEyebrow";

type ArchiveCategory = "compete" | "learn" | "foundation";
type ArchiveItem = {
  title: string;
  issuer: string;
  date: string;
  distinction?: string;
  category: ArchiveCategory;
};

const STATS = [
  { value: "18", label: "Credentials" },
  { value: "3", label: "Podium finishes" },
  { value: "9.21", label: "CGPA" },
];

const ARCHIVE_ITEMS: ArchiveItem[] = [
  { title: "CyberShield Hackathon '25", issuer: "WiCyS VIT Bhopal Student Chapter", date: "2025", distinction: "1st Place", category: "compete" },
  { title: "SKITECH National Innothon 3.0", issuer: "Indore", date: "2026", distinction: "1st Runner-Up", category: "compete" },
  { title: "AP SASI National Hackathon 2K26", issuer: "SASI Institute of Technology & Engineering, Andhra Pradesh", date: "Feb 2026", distinction: "Top 6 Nationwide", category: "compete" },
  { title: "Samsung Solve for Tomorrow 2026", issuer: "Samsung", date: "2026", distinction: "Participant", category: "compete" },
  { title: "SEBI Investor Awareness Test", issuer: "NISM / SEBI", date: "Nov 2025", distinction: "49 / 50 — Pass", category: "learn" },
  { title: "Python Essentials", issuer: "Vityarthi, VIT Bhopal", date: "Nov 2025", distinction: "100% project score", category: "learn" },
  { title: "Digital Literacy", issuer: "Vityarthi, VIT Bhopal", date: "Feb 2026", category: "learn" },
  { title: "Quantum Computing Workshop", issuer: "VIT Bhopal × IBM, Keysight, IISER Bhopal, Q-CTRL", date: "Nov 2025", category: "learn" },
  { title: "ML in Real-World Applications", issuer: "VIT Bhopal × MP Council of Science & Technology", date: "Feb 2026", category: "learn" },
  { title: "Build Smarter, Scalable AI Agents", issuer: "UiPath × GeeksforGeeks", date: "2026", category: "learn" },
  { title: "Responsible AI: Reimagining AI for All", issuer: "VIT Bhopal ACM Student Chapter", date: "Sep 2025", category: "learn" },
  { title: "Entrepreneurship Mindset for Young Innovators", issuer: "Institution's Innovation Council", date: "Dec 2025", category: "learn" },
  { title: "National Financial Literacy Quiz 2026", issuer: "NISM / SEBI", date: "2026", category: "learn" },
  { title: "National Science Talent Search Examination", issuer: "NSTSE", date: "", distinction: "State Rank 2", category: "foundation" },
  { title: "All India Maths & Science Talent Examination", issuer: "", date: "", distinction: "AIR 933", category: "foundation" },
  { title: "International English Olympiad", issuer: "SOF", date: "", distinction: "AIR 44", category: "foundation" },
  { title: "National Cyber Olympiad", issuer: "SOF", date: "", distinction: "International Rank 238", category: "foundation" },
  { title: "DELF A2 (French)", issuer: "Alliance Française of Madras", date: "", category: "foundation" },
];

const CATEGORY_META = [
  { key: "compete" as const, label: "Compete", range: "01—04", color: "#67e8f9" },
  { key: "learn" as const, label: "Learn", range: "05—13", color: "#818cf8" },
  { key: "foundation" as const, label: "Foundation", range: "14—18", color: "#c084fc" },
];
// Keep the archive active through most of the section, then reserve the final
// stretch for a slow handoff into Projects. The taller wrapper below gives
// every credential multiple ordinary scroll gestures of dwell time.
const ARCHIVE_ACTIVE_END = 0.96;
const DUST = Array.from({ length: 28 }, (_, index) => ({
  left: `${(index * 37 + 9) % 100}%`,
  top: `${(index * 61 + 13) % 100}%`,
  size: index % 6 === 0 ? 2 : 1,
  delay: (index % 9) * 0.35,
}));

function getCategory(category: ArchiveCategory) {
  return CATEGORY_META.find((item) => item.key === category) ?? CATEGORY_META[0];
}

function isPodium(item: ArchiveItem) {
  return item.distinction?.toLowerCase().includes("1st") ?? false;
}

function ActivePrism({ item, index, limitMotion }: { item: ArchiveItem; index: number; limitMotion: boolean }) {
  const category = getCategory(item.category);
  const podium = isPodium(item);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.article
        key={`${item.title}-${index}`}
        aria-live="polite"
        initial={{ opacity: 0, x: limitMotion ? 20 : 58, rotateY: limitMotion ? -3 : -8, filter: limitMotion ? "none" : "blur(8px)" }}
        animate={{ opacity: 1, x: 0, rotateY: -3, filter: "blur(0px)" }}
        exit={{ opacity: 0, x: limitMotion ? 24 : 85, rotateY: limitMotion ? 0 : 5, filter: limitMotion ? "none" : "blur(7px)" }}
        transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-[7%] right-[1%] z-30 flex h-[86%] w-[68%] origin-right flex-col overflow-hidden rounded-[1.6rem] border bg-[#061116]/90 p-6 backdrop-blur-2xl lg:w-[59%] lg:p-8 xl:w-[55%]"
        style={{
          borderColor: `${category.color}8a`,
          boxShadow: `0 35px 90px rgba(0,0,0,.62), 0 0 38px ${category.color}1f, inset 0 1px 0 rgba(255,255,255,.1)`,
        }}
      >
        <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.055),transparent_35%,rgba(103,232,249,0.035)_72%,transparent)]" />
        <div aria-hidden="true" className="absolute top-3 left-3 h-10 w-10 border-t border-l" style={{ borderColor: category.color }} />
        <div aria-hidden="true" className="absolute right-3 bottom-3 h-10 w-10 border-r border-b" style={{ borderColor: category.color }} />
        <div aria-hidden="true" className="absolute inset-x-14 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />

        <div className="relative flex items-start justify-between gap-5">
          <div>
            <p className="font-mono text-[9px] tracking-[0.3em] uppercase lg:text-[10px]" style={{ color: category.color }}>
              Archive {String(index + 1).padStart(2, "0")} / {String(ARCHIVE_ITEMS.length).padStart(2, "0")}
            </p>
            <p className="mt-2 font-mono text-[9px] tracking-[0.22em] text-slate-500 uppercase lg:text-[10px]">{category.label} collection</p>
          </div>
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border bg-black/55" style={{ borderColor: `${category.color}75`, color: podium ? "#f6d675" : category.color }}>
            {item.category === "compete" ? <Trophy className="h-5 w-5" strokeWidth={1.5} /> : item.category === "learn" ? <Award className="h-5 w-5" strokeWidth={1.5} /> : <GraduationCap className="h-5 w-5" strokeWidth={1.5} />}
          </span>
        </div>

        <div className="relative my-auto py-4">
          <h3 className="max-w-xl text-2xl leading-tight font-semibold tracking-tight text-white lg:text-3xl xl:text-4xl">{item.title}</h3>
          {item.distinction && <p className={`mt-5 font-mono text-sm tracking-[0.16em] uppercase lg:text-base ${podium ? "text-amber-200" : "text-cyan-200"}`}>{item.distinction}</p>}
        </div>

        <div className="relative border-t border-white/10 pt-5">
          <p className="text-xs leading-5 text-slate-300 lg:text-sm">{item.issuer || "Academic distinction"}</p>
          <div className="mt-3 flex items-center justify-between font-mono text-[9px] tracking-[0.18em] uppercase lg:text-[10px]">
            <span className="text-slate-500">Verified credential</span>
            <span style={{ color: category.color }}>{item.date || "Earlier honor"}</span>
          </div>
        </div>

        {podium && (
          <motion.div aria-hidden="true" initial={{ scale: 1.4, opacity: 0, rotate: -14 }} animate={{ scale: 1, opacity: 0.85, rotate: -8 }} transition={{ delay: 0.28, duration: 0.72, ease: "easeOut" }} className="absolute right-6 bottom-16 flex h-16 w-16 items-center justify-center rounded-full border-2 border-amber-200/55 text-center font-mono text-[7px] tracking-[0.16em] text-amber-100 uppercase shadow-[0_0_24px_rgba(251,191,36,0.18)] lg:right-10 lg:h-20 lg:w-20 lg:text-[8px]">
            Podium<br />Award
          </motion.div>
        )}
      </motion.article>
    </AnimatePresence>
  );
}

function DesktopArchive() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = Boolean(useReducedMotion());
  const isLowPower = useIsLowPowerDevice();
  const limitMotion = reducedMotion || isLowPower;
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const sceneOpacity = useTransform(scrollYProgress, (value) => {
    if (reducedMotion) return 1;
    if (value > ARCHIVE_ACTIVE_END) return Math.max(0, (1 - value) / (1 - ARCHIVE_ACTIVE_END));
    return 1;
  });
  const sceneY = useTransform(scrollYProgress, (value) => {
    if (value > ARCHIVE_ACTIVE_END) return -34 * ((value - ARCHIVE_ACTIVE_END) / (1 - ARCHIVE_ACTIVE_END));
    return 0;
  });
  const progressScale = useTransform(scrollYProgress, (value) => Math.min(value / ARCHIVE_ACTIVE_END, 1));

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const archiveProgress = Math.min(0.9999, Math.max(0, value / ARCHIVE_ACTIVE_END));
    const nextIndex = Math.min(ARCHIVE_ITEMS.length - 1, Math.floor(archiveProgress * ARCHIVE_ITEMS.length));
    setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
  });

  const activeItem = ARCHIVE_ITEMS[activeIndex];
  const activeCategory = getCategory(activeItem.category);
  const stackIndexes = (isLowPower ? [3, 2, 1] : [4, 3, 2, 1]).map((offset) => (activeIndex + offset) % ARCHIVE_ITEMS.length);

  const selectItem = (index: number) => {
    setActiveIndex(index);
    const section = sectionRef.current;
    if (!section) return;
    const sectionTop = window.scrollY + section.getBoundingClientRect().top;
    const scrollDistance = Math.max(section.offsetHeight - window.innerHeight, 0);
    const targetProgress = ((index + 0.2) / ARCHIVE_ITEMS.length) * ARCHIVE_ACTIVE_END;
    window.scrollTo({ top: sectionTop + targetProgress * scrollDistance, behavior: reducedMotion ? "auto" : "smooth" });
  };

  return (
    <div ref={sectionRef} className="cinematic-desktop relative h-[1400vh]">
      <motion.div style={{ opacity: sceneOpacity, y: sceneY }} className="sticky top-0 mx-auto flex h-[100dvh] min-h-[700px] max-w-[90rem] flex-col overflow-hidden px-10 py-16 lg:px-16 lg:py-20 min-[2200px]:max-w-[150rem] min-[2200px]:px-24">
        <div className="flex shrink-0 items-start justify-between gap-8">
          <div className="max-w-xl">
            <SectionEyebrow number="02" label="Certifications" />
            <h2 id="certification-archive-title" className="text-3xl font-semibold tracking-tight text-white lg:text-5xl">Certifications <span className="font-light text-slate-300">&amp; achievements</span></h2>
            <p className="mt-2 text-xs text-slate-500 lg:mt-3 lg:text-sm">Proof, preserved in motion.</p>
          </div>
          <div className="grid grid-cols-3 divide-x divide-white/10 text-center">
            {STATS.map((stat, index) => (
              <div key={stat.label} className="px-4 lg:px-7">
                <p className={`text-2xl font-light lg:text-4xl ${index === 0 ? "text-cyan-300" : index === 1 ? "text-amber-200" : "text-violet-300"}`}>{stat.value}</p>
                <p className="mt-1 font-mono text-[8px] tracking-[0.16em] text-slate-500 uppercase lg:text-[9px]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 grid min-h-0 flex-1 grid-cols-[8rem_minmax(0,1fr)] gap-4 lg:grid-cols-[10rem_minmax(0,1fr)] lg:gap-8">
          <nav aria-label="Certification archive categories" className="flex flex-col justify-center">
            <div className="relative space-y-3 before:absolute before:top-5 before:bottom-5 before:left-[1.1rem] before:w-px before:bg-white/10">
              {CATEGORY_META.map((category) => {
                const firstIndex = ARCHIVE_ITEMS.findIndex((item) => item.category === category.key);
                const selected = activeItem.category === category.key;
                return (
                  <button key={category.key} type="button" onClick={() => selectItem(firstIndex)} className="group relative flex w-full items-center gap-3 rounded-xl py-3 text-left focus-visible:outline-none" aria-pressed={selected}>
                    <span className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-black transition-all ${selected ? "scale-110 shadow-[0_0_16px_rgba(103,232,249,0.28)]" : "border-white/15 text-slate-600"}`} style={selected ? { borderColor: category.color, color: category.color } : undefined}>
                      {category.key === "compete" ? <Trophy className="h-3.5 w-3.5" /> : category.key === "learn" ? <Award className="h-3.5 w-3.5" /> : <GraduationCap className="h-3.5 w-3.5" />}
                    </span>
                    <span>
                      <span className={`block text-[10px] font-medium tracking-[0.16em] uppercase transition-colors lg:text-xs ${selected ? "text-white" : "text-slate-600 group-hover:text-slate-300"}`}>{category.label}</span>
                      <span className="mt-1 block font-mono text-[8px] tracking-[0.12em] text-slate-700">{category.range}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="relative min-h-0 overflow-visible [perspective:1400px]">
            <div aria-hidden="true" className="absolute inset-x-[4%] bottom-[4%] h-px bg-gradient-to-r from-transparent via-cyan-300/45 to-violet-400/45" />
            <div aria-hidden="true" className="performance-glow absolute right-[3%] bottom-[4%] h-36 w-[62%] rounded-[50%] bg-cyan-400/[0.08] blur-3xl" />
            {stackIndexes.map((itemIndex, layerIndex) => {
              const item = ARCHIVE_ITEMS[itemIndex];
              const category = getCategory(item.category);
              const depth = 4 - layerIndex;
              return (
                <motion.button type="button" key={`stack-${itemIndex}`} aria-label={`Open ${item.title}`} onClick={() => selectItem(itemIndex)} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 0.22 + layerIndex * 0.1, x: 0 }} transition={{ duration: 0.7, delay: layerIndex * 0.055 }} className="absolute top-[15%] h-[72%] w-[48%] origin-bottom-left overflow-hidden rounded-[1.3rem] border bg-[#060b12]/82 p-4 text-left backdrop-blur-xl focus-visible:outline-none" style={{ left: `${3 + layerIndex * 7}%`, zIndex: 8 + layerIndex, borderColor: `${category.color}66`, transform: `translateZ(${-depth * 72}px) rotateY(-13deg) scale(${0.86 + layerIndex * 0.035})`, boxShadow: `0 0 24px ${category.color}18` }}>
                  <span className="font-mono text-[8px] tracking-[0.18em] uppercase" style={{ color: category.color }}>{category.label}</span>
                  <span className="mt-8 block max-w-[10rem] text-xs leading-5 font-medium text-slate-300 lg:text-sm">{item.title}</span>
                  <span className="absolute right-4 bottom-4 font-mono text-[8px] tracking-[0.12em] text-slate-600">{String(itemIndex + 1).padStart(2, "0")}</span>
                </motion.button>
              );
            })}
            <ActivePrism item={activeItem} index={activeIndex} limitMotion={limitMotion} />
          </div>
        </div>

        <div className="mt-4 shrink-0">
          <div className="flex items-center justify-between font-mono text-[8px] tracking-[0.22em] uppercase lg:text-[9px]">
            <span className="text-slate-600">Scroll to open the archive</span>
            <span style={{ color: activeCategory.color }}>{String(activeIndex + 1).padStart(2, "0")} / {String(ARCHIVE_ITEMS.length).padStart(2, "0")}</span>
          </div>
          <div className="relative mt-3 h-px bg-white/10">
            <motion.div className="absolute inset-y-0 right-0 left-0 origin-left bg-gradient-to-r from-cyan-300 via-indigo-400 to-violet-400 shadow-[0_0_8px_rgba(103,232,249,0.4)]" style={{ scaleX: reducedMotion ? 1 : progressScale }} />
            {ARCHIVE_ITEMS.map((item, index) => (
              <button type="button" key={`archive-dot-${item.title}`} onClick={() => selectItem(index)} aria-label={`Open credential ${index + 1}: ${item.title}`} className={`absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-black transition-all focus-visible:outline-none ${activeIndex === index ? "scale-150 border-cyan-200 shadow-[0_0_8px_rgba(103,232,249,0.8)]" : "border-white/25 hover:border-white/70"}`} style={{ left: `${((index + 0.5) / ARCHIVE_ITEMS.length) * 100}%` }} />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function MobileArchive() {
  return (
    <div className="cinematic-adaptive relative px-6 py-28">
      <SectionEyebrow number="02" label="Certifications" />
      <h2 className="text-3xl font-semibold tracking-tight text-white">Certifications &amp; achievements</h2>
      <p className="mt-3 text-sm text-slate-500">Proof, preserved in motion.</p>
      <div className="mt-8 grid grid-cols-3 divide-x divide-white/10 text-center">
        {STATS.map((stat, index) => (
          <div key={stat.label} className="px-2">
            <p className={`text-2xl ${index === 0 ? "text-cyan-300" : index === 1 ? "text-amber-200" : "text-violet-300"}`}>{stat.value}</p>
            <p className="mt-1 font-mono text-[7px] tracking-[0.12em] text-slate-500 uppercase">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 space-y-14">
        {CATEGORY_META.map((category) => {
          const items = ARCHIVE_ITEMS.filter((item) => item.category === category.key);
          return (
            <section key={category.key} aria-labelledby={`mobile-${category.key}`}>
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px flex-1" style={{ backgroundImage: `linear-gradient(to right, transparent, ${category.color}99)` }} />
                <h3 id={`mobile-${category.key}`} className="font-mono text-[10px] tracking-[0.25em] uppercase" style={{ color: category.color }}>{category.label}</h3>
              </div>
              <div className="space-y-3">
                {items.map((item, index) => (
                  <motion.article key={item.title} initial={{ opacity: 0, y: 18, rotateX: -5 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.4, delay: Math.min(index * 0.025, 0.15) }} className="relative overflow-hidden rounded-2xl border bg-[#061015]/80 p-5 backdrop-blur-xl" style={{ borderColor: `${category.color}4d`, boxShadow: "inset 0 1px 0 rgba(255,255,255,.06), 0 12px 35px rgba(0,0,0,.28)" }}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-mono text-[8px] tracking-[0.18em] text-slate-600 uppercase">Collection {category.range}</p>
                        <h4 className="mt-2 text-sm leading-5 font-semibold text-white">{item.title}</h4>
                        {item.issuer && <p className="mt-1.5 text-xs leading-5 text-slate-500">{item.issuer}</p>}
                      </div>
                      <span className="font-mono text-[8px] tracking-[0.12em]" style={{ color: category.color }}>{item.date}</span>
                    </div>
                    {item.distinction && <p className={`mt-4 border-t border-white/[0.07] pt-3 font-mono text-[9px] tracking-[0.14em] uppercase ${isPodium(item) ? "text-amber-200" : "text-cyan-200"}`}>{item.distinction}</p>}
                  </motion.article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default function Certifications() {
  const isLowPower = useIsLowPowerDevice();

  return (
    <section id="certifications" aria-labelledby="certification-archive-title" className="relative isolate overflow-clip bg-black text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(to_bottom,#000_0%,#05020b_10%,#01070b_48%,#03010a_84%,#000_100%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.18),transparent_66%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[30rem] bg-[radial-gradient(ellipse_at_bottom,rgba(34,211,238,0.1),transparent_68%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]" />
      {(isLowPower ? DUST.slice(0, 8) : DUST).map((particle, index) => (
        <motion.span key={`${particle.left}-${particle.top}`} aria-hidden="true" className="pointer-events-none absolute -z-10 rounded-full bg-cyan-100" style={{ left: particle.left, top: particle.top, width: particle.size, height: particle.size }} animate={isLowPower ? { opacity: 0.3 } : { opacity: [0.08, 0.55, 0.08] }} transition={{ duration: 3.5 + (index % 5), repeat: Infinity, delay: particle.delay }} />
      ))}
      <div aria-hidden="true" className="absolute inset-x-[8%] top-0 h-px bg-gradient-to-r from-transparent via-violet-300/70 to-transparent shadow-[0_0_16px_rgba(167,139,250,0.4)]" />
      <DesktopArchive />
      <MobileArchive />
    </section>
  );
}
