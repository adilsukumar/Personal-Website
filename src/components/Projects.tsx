"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight, Code, Layers, RadioTower } from "lucide-react";
import { useIsLowPowerDevice } from "@/lib/useIsLowPowerDevice";
import SectionEyebrow from "./SectionEyebrow";

type Project = {
  title: string;
  date: string;
  description: string;
  tags: string[];
  link?: string;
  github: string;
  signal: string;
  accent: string;
};

const PROJECTS: Project[] = [
  {
    title: "Pawsitive Diagnostics",
    date: "Mar 2026",
    description:
      "AI-powered dog health monitoring across bark, skin, air, motion, location, and vital signals — combining an ESP32 collar with real-time tracking and diagnostic workflows.",
    tags: ["Hardware", "AI", "IoT"],
    link: "https://pawsitive-diagnostics.vercel.app",
    github: "https://github.com/adilsukumar/Pawsitive_Diagnostics",
    signal: "Connected health",
    accent: "#a78bfa",
  },
  {
    title: "Smart Helmet Vision",
    date: "Aug 2026",
    description:
      "A privacy-conscious traffic-vision system that checks helmet use, triple riding, and red-light stop-line violations with browser-side YOLO models and a tested Python rule engine.",
    tags: ["Computer Vision", "YOLO", "Python"],
    link: "https://smart-helmet-vision.vercel.app/",
    github: "https://github.com/adilsukumar/Smart-Helmet-Vision",
    signal: "Road-safety vision",
    accent: "#f59e0b",
  },
  {
    title: "Lead Radar",
    date: "Jul 2026",
    description:
      "A $0 daily startup-lead site with scoring, outreach templates, leaderboards, and a tracker.",
    tags: ["Growth", "Full Stack", "Product"],
    link: "https://lead-radar-hazel.vercel.app/",
    github: "https://github.com/adilsukumar/Lead-Radar",
    signal: "Acquisition intelligence",
    accent: "#67e8f9",
  },
  {
    title: "AI Mock Interviewer",
    date: "Jul 2026",
    description:
      "A mock AI interviewer that tests knowledge and confidence against the company, role, and position a candidate is applying for.",
    tags: ["AI", "TypeScript", "EdTech"],
    link: "https://ai-mock-interviewer-official.vercel.app",
    github: "https://github.com/adilsukumar/AI-Mock-Interviewer",
    signal: "Adaptive assessment",
    accent: "#60a5fa",
  },
  {
    title: "ELLY Smart Home",
    date: "Jun 2026",
    description:
      "A connected home-automation interface for ElectraWireless, bringing device control, energy intelligence, and the ELLY IoT ecosystem into one responsive experience.",
    tags: ["IoT", "React", "TypeScript"],
    link: "https://electrawireless-home-automation.vercel.app",
    github: "https://github.com/adilsukumar/ElectraWireless-IoT-and-Embedded-Systems",
    signal: "Ambient automation",
    accent: "#8b5cf6",
  },
  {
    title: "SkillNests",
    date: "Jun 2026",
    description:
      "A holistic, non-competitive educational platform where students learn, build, and grow together through community-driven learning experiences.",
    tags: ["EdTech", "TypeScript", "Community"],
    link: "https://www.skillnests.in",
    github: "https://github.com/adilsukumar/SkillNests",
    signal: "Collaborative learning",
    accent: "#34d399",
  },
  {
    title: "LeadForge Pro",
    date: "Jul 2026",
    description:
      "A geo-arbitrage lead-generation platform for discovering businesses without websites and turning location-based research into qualified agency prospects.",
    tags: ["Lead Generation", "Maps", "Full Stack"],
    link: "https://lead-forge-pro-peach.vercel.app",
    github: "https://github.com/adilsukumar/LeadForge-Pro_Website",
    signal: "Market discovery",
    accent: "#38bdf8",
  },
  {
    title: "SCLC Somatic Variant Analysis",
    date: "Feb 2026",
    description:
      "A bioinformatics pipeline for somatic variant analysis of CD56+ circulating tumor cells in small cell lung cancer, using GATK Mutect2 and SnpEff on AWS.",
    tags: ["Bioinformatics", "AWS", "Genomics"],
    link: "https://sequensolutions.com/articles/somatic-variant-analysis-cd56-ctcs-sclc-err6473446/",
    github: "https://github.com/adilsukumar/SCLC-Somatic-Variant-Analysis",
    signal: "Precision genomics",
    accent: "#c084fc",
  },
  {
    title: "CyberSHE",
    date: "Sep 2025",
    description:
      "A women-centric digital safety platform with AI harassment detection, privacy audits, evidence logging, and end-to-end encryption.",
    tags: ["React", "TypeScript", "AI"],
    github:
      "https://github.com/adilsukumar/CyberSHE_WiCyS_Hackathon_.Saras-Hack-Squad",
    signal: "Digital safety",
    accent: "#f0abfc",
  },
  {
    title: "AMOM — A Map Of Memories",
    date: "Jan 2026",
    description:
      "An interactive global memory map where people pin personal stories and reflections to real places — a collective diary of human experience.",
    tags: ["Full Stack", "Maps", "Social"],
    link: "https://amom-a-map-of-memories.vercel.app/",
    github: "https://github.com/adilsukumar/AMOM-A_Map_Of_Memories",
    signal: "Collective memory",
    accent: "#2dd4bf",
  },
  {
    title: "SplitSmart",
    date: "Apr 2026",
    description:
      "A lightweight, real-time expense-splitting app with no sign-up required. Create a group, share its link, and start tracking together.",
    tags: ["Fintech", "Real-time"],
    link: "https://splitsmart-finance.vercel.app/",
    github: "https://github.com/adilsukumar/SplitSmart-Smart_Expense_Splitter",
    signal: "Shared finance",
    accent: "#22d3ee",
  },
  {
    title: "Spendture",
    date: "Aug 2025 – Present",
    description:
      "A financial management platform for tracking, managing, and optimizing spending through intelligent insights and real-time analytics.",
    tags: ["Fintech", "Product"],
    link: "https://www.spendture.com",
    github: "https://github.com/adilsukumar/Spendture_Website",
    signal: "Financial clarity",
    accent: "#818cf8",
  },
  {
    title: "Finly",
    date: "Mar 2026",
    description:
      "A lightweight personal-finance tracker for college life with separate personal and shared accounts, local-first storage, analytics, and protected shared access.",
    tags: ["Fintech", "Privacy", "TypeScript"],
    link: "https://finly-personal-finance.vercel.app",
    github: "https://github.com/adilsukumar/Finly_Personal_Finance",
    signal: "Local-first finance",
    accent: "#10b981",
  },
  {
    title: "DSA Journey",
    date: "Jun 2026 – Present",
    description:
      "An actively maintained collection of data-structures and algorithms practice across LeetCode, CodeChef, and competitive-programming problem sets.",
    tags: ["C++", "Algorithms", "Problem Solving"],
    github: "https://github.com/adilsukumar/DSA_Data-Structures-and-Algorithms",
    signal: "Problem-solving cadence",
    accent: "#fb7185",
  },
];

const ORBIT_POINTS = PROJECTS.map((_, index) => {
  const angle = -90 + (index / PROJECTS.length) * 360;
  const radians = (angle * Math.PI) / 180;

  return {
    left: `${50 + Math.cos(radians) * 42}%`,
    top: `${50 + Math.sin(radians) * 42}%`,
    angle,
  };
});

const PROJECT_ACTIVE_END = 0.94;

function ProjectDossier({ project, index, limitMotion }: { project: Project; index: number; limitMotion: boolean }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.article
        key={project.title}
        aria-live="polite"
        initial={{ opacity: 0, x: limitMotion ? 18 : 44, filter: limitMotion ? "none" : "blur(9px)" }}
        animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, x: limitMotion ? -12 : -28, filter: limitMotion ? "none" : "blur(7px)" }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#050a10]/85 p-7 backdrop-blur-2xl lg:p-10"
        style={{
          boxShadow: `0 30px 100px rgba(0,0,0,.58), 0 0 55px ${project.accent}14, inset 0 1px 0 rgba(255,255,255,.08)`,
        }}
      >
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${project.accent}, transparent)` }} />
        <div aria-hidden="true" className="performance-glow absolute -top-32 -right-24 h-72 w-72 rounded-full blur-[90px]" style={{ backgroundColor: `${project.accent}18` }} />
        <div aria-hidden="true" className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.7)_1px,transparent_1px)] [background-size:32px_32px]" />

        <div className="relative flex items-start justify-between gap-6">
          <div>
            <p className="font-mono text-[9px] tracking-[0.3em] text-slate-500 uppercase">Mission file</p>
            <p className="mt-2 font-mono text-xs tracking-[0.22em] uppercase" style={{ color: project.accent }}>
              {String(index + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.18em] text-emerald-300 uppercase">
            <motion.span className="h-1.5 w-1.5 rounded-full bg-emerald-300" animate={limitMotion ? { opacity: 1, boxShadow: "0 0 8px rgba(110,231,183,.55)" } : { opacity: [0.35, 1, 0.35], boxShadow: ["0 0 0 rgba(110,231,183,0)", "0 0 13px rgba(110,231,183,.9)", "0 0 0 rgba(110,231,183,0)"] }} transition={{ duration: 2.2, repeat: Infinity }} />
            Deployed
          </div>
        </div>

        <div className="relative my-auto py-5">
          <p className="mb-4 font-mono text-[10px] tracking-[0.22em] text-slate-500 uppercase">{project.signal}</p>
          <h3 className="max-w-2xl text-3xl leading-[1.02] font-semibold tracking-[-0.04em] text-white lg:text-5xl">{project.title}</h3>
          <p className="mt-6 max-w-2xl text-sm leading-7 font-light text-slate-300 lg:text-base">{project.description}</p>
        </div>

        <div className="relative border-t border-white/10 pt-5">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 font-mono text-[9px] tracking-[0.13em] text-slate-300 uppercase">{tag}</span>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between gap-5">
            <p className="font-mono text-[10px] tracking-[0.2em] text-slate-500 uppercase">{project.date}</p>
            <div className="flex items-center gap-5 text-xs font-medium">
              {project.link && <a href={project.link} target="_blank" rel="noreferrer" className="group flex items-center gap-2 text-slate-300 transition-colors hover:text-cyan-200">Launch <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a>}
              <a href={project.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-400 transition-colors hover:text-violet-200"><Code className="h-4 w-4" /> Source</a>
            </div>
          </div>
        </div>
      </motion.article>
    </AnimatePresence>
  );
}

function DesktopProjects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const reducedMotion = Boolean(useReducedMotion());
  const isLowPower = useIsLowPowerDevice();
  const limitMotion = reducedMotion || isLowPower;

  useEffect(() => {
    const updateProgress = () => {
      const section = sectionRef.current;
      if (!section) return;

      const sectionTop = window.scrollY + section.getBoundingClientRect().top;
      const scrollDistance = Math.max(section.offsetHeight - window.innerHeight, 1);
      const nextProgress = Math.min(1, Math.max(0, (window.scrollY - sectionTop) / scrollDistance));
      const projectProgress = Math.min(0.9999, nextProgress / PROJECT_ACTIVE_END);
      const nextIndex = Math.min(PROJECTS.length - 1, Math.floor(projectProgress * PROJECTS.length));

      setScrollProgress(nextProgress);
      setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  const exitProgress = Math.max(0, (scrollProgress - PROJECT_ACTIVE_END) / (1 - PROJECT_ACTIVE_END));
  const sceneOpacity = reducedMotion ? 1 : 1 - exitProgress;
  const sceneY = reducedMotion ? 0 : -38 * exitProgress;
  const progressScale = reducedMotion ? 1 : Math.min(scrollProgress / PROJECT_ACTIVE_END, 1);

  const selectProject = (index: number) => {
    setActiveIndex(index);
    const section = sectionRef.current;
    if (!section) return;
    const sectionTop = window.scrollY + section.getBoundingClientRect().top;
    const scrollDistance = Math.max(section.offsetHeight - window.innerHeight, 0);
    const targetProgress = ((index + 0.3) / PROJECTS.length) * PROJECT_ACTIVE_END;
    window.scrollTo({ top: sectionTop + targetProgress * scrollDistance, behavior: reducedMotion ? "auto" : "smooth" });
  };

  const project = PROJECTS[activeIndex];
  const point = ORBIT_POINTS[activeIndex];

  return (
    <div ref={sectionRef} className="relative hidden md:block" style={{ height: `${PROJECTS.length * 200}vh` }}>
      <motion.div style={{ opacity: sceneOpacity, y: sceneY }} className="sticky top-0 mx-auto flex h-screen min-h-[700px] max-w-[90rem] flex-col overflow-hidden px-10 py-14 lg:px-16 lg:py-16">
        <div className="flex shrink-0 items-end justify-between gap-10">
          <div>
            <SectionEyebrow number="03" label="Projects" />
            <h2 id="project-constellation-title" className="text-4xl font-semibold tracking-[-0.045em] text-white lg:text-5xl">Key <span className="font-light text-cyan-200">projects</span></h2>
          </div>
          <div className="max-w-sm text-right">
            <p className="font-mono text-[9px] tracking-[0.25em] text-cyan-300/70 uppercase">Project constellation</p>
            <p className="mt-2 text-xs leading-5 text-slate-500">{PROJECTS.length} builds. One evolving orbit across AI, hardware, biology, and product.</p>
          </div>
        </div>

        <div className="mt-7 grid min-h-0 flex-1 grid-cols-[minmax(19rem,.78fr)_minmax(0,1.22fr)] gap-8 lg:gap-14">
          <div className="relative flex min-h-0 items-center justify-center">
            <div className="relative aspect-square w-full max-w-[30rem]">
              <motion.div aria-hidden="true" className="absolute inset-[8%] rounded-full border border-cyan-300/15" animate={limitMotion ? { rotate: 0 } : { rotate: 360 }} transition={{ duration: 48, repeat: Infinity, ease: "linear" }} />
              <motion.div aria-hidden="true" className="absolute inset-[20%] rounded-full border border-dashed border-violet-300/15" animate={limitMotion ? { rotate: 0 } : { rotate: -360 }} transition={{ duration: 38, repeat: Infinity, ease: "linear" }} />
              <div aria-hidden="true" className="absolute inset-[34%] rounded-full border border-white/10 bg-black/70 shadow-[0_0_50px_rgba(34,211,238,.08)] backdrop-blur-xl" />
              <div aria-hidden="true" className="absolute top-1/2 left-1/2 h-px w-[42%] origin-left" style={{ transform: `rotate(${point.angle}deg)`, background: `linear-gradient(90deg, ${project.accent}90, ${project.accent}10)` }} />

              <div className="absolute top-1/2 left-1/2 z-10 flex h-[25%] w-[25%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full text-center">
                <RadioTower className="h-5 w-5 text-cyan-200" strokeWidth={1.4} />
                <p className="mt-2 font-mono text-lg font-light text-white">{String(activeIndex + 1).padStart(2, "0")}</p>
                <p className="font-mono text-[7px] tracking-[0.2em] text-slate-600 uppercase">Signal locked</p>
              </div>

              {PROJECTS.map((item, index) => {
                const active = index === activeIndex;
                const orbitPoint = ORBIT_POINTS[index];
                return (
                  <button type="button" key={item.title} onClick={() => selectProject(index)} aria-label={`Open project ${index + 1}: ${item.title}`} aria-pressed={active} className="group absolute z-20 -translate-x-1/2 -translate-y-1/2 focus-visible:outline-none" style={{ left: orbitPoint.left, top: orbitPoint.top }}>
                    {active && <motion.span layoutId="project-orbit-halo" className="absolute inset-[-10px] rounded-full border" style={{ borderColor: `${item.accent}80`, boxShadow: `0 0 24px ${item.accent}65` }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} />}
                    <span className={`relative flex h-10 w-10 items-center justify-center rounded-full border bg-black font-mono text-[9px] transition-all duration-500 lg:h-12 lg:w-12 ${active ? "scale-110 text-white" : "border-white/15 text-slate-600 group-hover:border-white/40 group-hover:text-slate-300"}`} style={active ? { borderColor: item.accent, boxShadow: `inset 0 0 17px ${item.accent}2c` } : undefined}>{String(index + 1).padStart(2, "0")}</span>
                  </button>
                );
              })}

              <AnimatePresence mode="wait">
                <motion.p key={project.title} initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -7 }} className="absolute right-0 bottom-[3%] left-0 text-center font-mono text-[8px] tracking-[0.2em] text-slate-600 uppercase">{project.signal}</motion.p>
              </AnimatePresence>
            </div>
          </div>

          <div className="min-h-0 py-2"><ProjectDossier project={project} index={activeIndex} limitMotion={limitMotion} /></div>
        </div>

        <div className="mt-6 shrink-0">
          <div className="flex items-center justify-between font-mono text-[8px] tracking-[0.22em] uppercase lg:text-[9px]">
            <span className="text-slate-600">Scroll to tune the constellation</span>
            <span style={{ color: project.accent }}>{String(activeIndex + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}</span>
          </div>
          <div className="relative mt-3 h-px bg-white/10">
            <motion.div className="absolute inset-0 origin-left bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 shadow-[0_0_9px_rgba(103,232,249,.5)]" style={{ scaleX: reducedMotion ? 1 : progressScale }} />
            {PROJECTS.map((item, index) => <button key={`project-progress-${item.title}`} type="button" onClick={() => selectProject(index)} aria-label={`Jump to ${item.title}`} className={`absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-black transition-all ${activeIndex === index ? "scale-150 border-cyan-100 shadow-[0_0_9px_rgba(103,232,249,.8)]" : "border-white/25 hover:border-white/70"}`} style={{ left: `${((index + 0.5) / PROJECTS.length) * 100}%` }} />)}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function MobileProjects() {
  return (
    <div className="relative px-6 py-28 md:hidden">
      <SectionEyebrow number="03" label="Projects" />
      <div className="flex items-center gap-3">
        <Layers className="h-7 w-7 text-violet-300" strokeWidth={1.5} />
        <h2 className="text-3xl font-semibold tracking-tight text-white">Key <span className="font-light text-cyan-200">projects</span></h2>
      </div>
      <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">{PROJECTS.length} builds across AI, hardware, biology, and product.</p>

      <div className="relative mt-12 space-y-5 before:absolute before:top-4 before:bottom-4 before:left-5 before:w-px before:bg-gradient-to-b before:from-cyan-300/50 before:via-violet-400/30 before:to-transparent">
        {PROJECTS.map((project, index) => (
          <motion.article key={project.title} initial={{ y: 28 }} whileInView={{ y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className="relative pl-12">
            <span className="absolute top-5 left-2.5 z-10 flex h-5 w-5 items-center justify-center rounded-full border bg-black font-mono text-[7px]" style={{ color: project.accent, borderColor: `${project.accent}90`, boxShadow: `0 0 13px ${project.accent}35` }}>{index + 1}</span>
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#050a10]/85 p-5 backdrop-blur-xl">
              <div className="absolute inset-x-8 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${project.accent}, transparent)` }} />
              <div className="flex items-start justify-between gap-4">
                <div><p className="font-mono text-[8px] tracking-[0.18em] uppercase" style={{ color: project.accent }}>{project.signal}</p><h3 className="mt-2 text-xl leading-tight font-semibold text-white">{project.title}</h3></div>
                <span className="shrink-0 font-mono text-[8px] tracking-[0.12em] text-slate-600 uppercase">{project.date}</span>
              </div>
              <p className="mt-4 text-sm leading-6 font-light text-slate-400">{project.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">{project.tags.map((tag) => <span key={tag} className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[8px] tracking-[0.1em] text-slate-400 uppercase">{tag}</span>)}</div>
              <div className="mt-5 flex gap-5 border-t border-white/[0.07] pt-4 text-xs">
                {project.link && <a href={project.link} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-cyan-200">Launch <ArrowUpRight className="h-3.5 w-3.5" /></a>}
                <a href={project.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-slate-400"><Code className="h-3.5 w-3.5" /> Source</a>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" aria-labelledby="project-constellation-title" className="relative isolate overflow-clip bg-black text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(to_bottom,#000_0%,#01090d_18%,#02030c_58%,#05020a_86%,#000_100%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(ellipse_at_top,rgba(34,211,238,0.15),transparent_68%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[32rem] bg-[radial-gradient(ellipse_at_bottom,rgba(139,92,246,0.12),transparent_68%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-35 [background-image:radial-gradient(circle_at_center,rgba(103,232,249,.22)_0,rgba(103,232,249,.22)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_88%,transparent)]" />
      <div aria-hidden="true" className="absolute inset-x-[8%] top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/65 to-transparent shadow-[0_0_18px_rgba(103,232,249,.45)]" />
      <DesktopProjects />
      <MobileProjects />
    </section>
  );
}
