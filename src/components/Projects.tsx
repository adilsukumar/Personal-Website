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
  github?: string;
  status?: string;
  signal: string;
  accent: string;
};

const PROJECTS: Project[] = [
  {
    title: "Pawsitive Diagnostics",
    date: "Feb 2026 – Present",
    description:
      "Leading software, hardware and machine learning for a wearable animal-health prototype, connecting collar telemetry, individual baselines, activity recognition and context-aware alerts.",
    tags: ["Hardware", "AI", "IoT"],
    link: "https://pawsitive-diagnostics.vercel.app",
    github: "https://github.com/adilsukumar/Pawsitive-Diagnostics-V2",
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
      "Voice-first interview practice with role-specific Groq conversations, browser speech recognition, fallback transcription and generated feedback. Includes bounded recordings and microphone recovery.",
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
      "Co-created an offline-first React/TypeScript smart-home ecosystem with local Web-LLM voice commands, TensorFlow.js vision, BLE/Wi-Fi discovery and Capacitor mobile builds automated through GitHub Actions.",
    tags: ["IoT", "React", "TypeScript"],
    status: "Industry work",
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
    link: "https://lead-forge-pro-website.vercel.app",
    github: "https://github.com/adilsukumar/LeadForge-Pro",
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
      "A digital-safety hackathon prototype with support resources, incident-reporting and harassment-analysis workflows, built with React, TypeScript and an Express backend.",
    tags: ["React", "TypeScript", "AI"],
    github:
      "https://github.com/adilsukumar/CyberSHE-WiCyS-Hackathon",
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
    github: "https://github.com/adilsukumar/AMOM-A-Map-of-Memories",
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
    github: "https://github.com/adilsukumar/SplitSmart-Expense-Splitter",
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
    github: "https://github.com/adilsukumar/Spendture-Website",
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
    github: "https://github.com/adilsukumar/Finly-Personal-Finance",
    signal: "Local-first finance",
    accent: "#10b981",
  },
  {
    title: "DSA Journey",
    date: "Jun 2026 – Present",
    description:
      "An actively maintained collection of data-structures and algorithms practice across LeetCode, CodeChef, and competitive-programming problem sets.",
    tags: ["C++", "Algorithms", "Problem Solving"],
    github: "https://github.com/adilsukumar/DSA-Data-Structures-and-Algorithms",
    signal: "Problem-solving cadence",
    accent: "#fb7185",
  },
  {
    "title": "Whisper for Windows",
    "description": "A native Windows assistant combining a WPF interface and Python services with local speech, consented screen context, cancellation controls and a separate FastAPI account service.",
    "tags": [
      "C# / WPF",
      "Python",
      "FastAPI"
    ],
    "signal": "Desktop intelligence",
    "accent": "#67e8f9",
    "date": "2026",
    "github": "https://github.com/adilsukumar/Whisper-for-Windows"
  },
  {
    "title": "PoshanTrack Photo AI",
    "description": "A private Node.js/Express backend for meal-photo estimates with Indian-food context. Implements validated image uploads, bounded requests, Gemini/Groq routing and structured output checks.",
    "tags": [
      "Node.js",
      "Express",
      "Multimodal AI"
    ],
    "status": "Private backend",
    "signal": "Food with context",
    "accent": "#fb923c",
    "date": "2026"
  },
  {
    "title": "Portiva",
    "description": "A household delivery-robot development project with shared mission controllers, heading-aware A* planning, collision checks, an Android bench demo and Uno firmware. Physical motor outputs remain disabled pending commissioning.",
    "tags": [
      "Robotics",
      "Android",
      "Java / C++"
    ],
    "status": "Development prototype",
    "signal": "Follow. Carry. Deliver.",
    "accent": "#fbbf24",
    "date": "2026",
    "github": "https://github.com/adilsukumar/Portiva"
  },
  {
    "title": "SoftSpace & SoftFlex",
    "description": "Adjustable headphone concepts with glasses-aware cushions, Autodesk Fusion design history, STEP assemblies and Python/FEA comparisons. Documents material assumptions and physical tests still required.",
    "tags": [
      "Fusion / CAD",
      "FEA",
      "Python"
    ],
    "status": "Design study",
    "signal": "Comfort through engineering",
    "accent": "#c4b5fd",
    "date": "2026",
    "github": "https://github.com/adilsukumar/SoftSpace"
  },
  {
    "title": "SciGenius Research Tooling",
    "description": "PDF text extraction, spaCy entities and NetworkX graphs provide context for staged research drafts. Connects a FastAPI service, Vite interface, Rich CLI, SQLite checkpoints and Markdown export.",
    "tags": [
      "FastAPI",
      "NLP",
      "Knowledge Graphs"
    ],
    "signal": "Research workflows",
    "accent": "#818cf8",
    "date": "2026",
    "github": "https://github.com/adilsukumar/SciGenius-Research-Paper-Builder"
  },
  {
    "title": "Posture Monitor",
    "description": "Browser-side MediaPipe Pose feedback with valid-landmark checks, normalized geometry, upright calibration and session-only slouch/lean counters. A heuristic posture aid rather than a diagnostic tool.",
    "tags": [
      "MediaPipe",
      "JavaScript",
      "Computer Vision"
    ],
    "signal": "Find your baseline",
    "accent": "#2dd4bf",
    "date": "2026",
    "github": "https://github.com/adilsukumar/Posture-Detection"
  },
  {
    "title": "ATS Resume–Job Fit Analyzer",
    "description": "A local Python course project implementing TF-IDF and cosine similarity with NumPy, PDF/text extraction and ranked missing keywords. Includes mathematical tests; its score measures text overlap.",
    "tags": [
      "Python",
      "NumPy",
      "NLP"
    ],
    "signal": "Inspectable text comparison",
    "accent": "#60a5fa",
    "date": "2026",
    "github": "https://github.com/adilsukumar/ATS-Resume-Job-Fit-Analyzer"
  },
  {
    "title": "Atlas Voice Assistant",
    "date": "2023 · updated 2026",
    "description": "An educational Python assistant with explicit voice/text commands, allowlisted desktop actions and web lookups. Separates parsing from microphone access and supports dry-run execution and dependency-free tests.",
    "tags": [
      "Python",
      "Speech",
      "Automation"
    ],
    "signal": "Small commands. Clear actions.",
    "accent": "#38bdf8",
    "github": "https://github.com/adilsukumar/Atlas-Voice-Assistant"
  },
  {
    "title": "KAN ECG & Symbolic Fidelity",
    "description": "An ECG classification study using Kolmogorov–Arnold networks and feature-matched baselines across MIT-BIH, INCART and SVDB. Evaluates symbolic surrogates against fidelity, sensitivity and complexity gates.",
    "tags": [
      "Machine Learning",
      "ECG",
      "Symbolic Models"
    ],
    "status": "Research study",
    "signal": "Interpretable cardiac signals",
    "accent": "#f0abfc",
    "date": "2026",
    "github": "https://github.com/adilsukumar/KAN-ECG-Research-Paper"
  },
  {
    "title": "Zebrafish Formaldehyde Toxicity",
    "description": "Reproducible analysis of 96-hour mortality with Abbott correction and probit interpolation, sensitivity checks and JSON/SVG outputs. Includes six OECD QSAR Toolbox/literature reports and source hashes.",
    "tags": [
      "Python",
      "Toxicology",
      "OECD QSAR Toolbox"
    ],
    "status": "Computational analysis",
    "signal": "Evidence and endpoints",
    "accent": "#a78bfa",
    "date": "2026",
    "github": "https://github.com/adilsukumar/Zebrafish-Formaldehyde-Toxicity"
  },
  {
    "title": "Moomentum & Sensor Experiments",
    "description": "Animal-care interface prototypes alongside independently runnable motion, temperature, vital, lighting and skin experiments. Preserves training/export helpers, attributed reference data and module-specific validation limits.",
    "tags": [
      "React",
      "ESP32",
      "Sensor Analysis"
    ],
    "status": "Prototype collection",
    "signal": "One interface. Many experiments.",
    "accent": "#6ee7b7",
    "date": "2026",
    "github": "https://github.com/adilsukumar/Moomentum"
  },
  {
    "title": "CardSavvy",
    "description": "A 333-card comparison prototype across ten markets with explainable heuristic rankings, filters and a browser-local wallet. Includes normalized currency scoring and catalogue regression checks.",
    "tags": [
      "React",
      "TypeScript",
      "Zod"
    ],
    "link": "https://cardsavvy-adil-sukumar.vercel.app/",
    "signal": "Compare clearly",
    "accent": "#34d399",
    "date": "2026",
    "github": "https://github.com/adilsukumar/CardSavvy"
  },
  {
    "title": "A2Z Curriculum Tracker",
    "description": "An independent tracker for the credited A2Z curriculum: 402 bundled problems across 19 steps, with search, bookmarks, notes, review flags, daily plans and browser-local progress backups.",
    "tags": [
      "React",
      "Vite",
      "Local Storage"
    ],
    "link": "https://a2z-dsa-sheet.vercel.app/",
    "signal": "Roadmap into routine",
    "accent": "#fb7185",
    "date": "2026",
    "github": "https://github.com/adilsukumar/A2Z-DataSheet-Replica"
  },
  {
    "title": "NIFTY Paper Trading & Risk Analytics",
    "description": "A research and paper-trading system with walk-forward model comparisons, restart-safe state, an event journal, fee estimates, stale-data checks and drawdown controls. Does not place live broker orders.",
    "tags": [
      "Python",
      "XGBoost",
      "Risk Analytics"
    ],
    "status": "Private research project",
    "signal": "Evaluate before execution",
    "accent": "#fbbf24",
    "date": "2026"
  },
];

const ORBIT_POINTS = PROJECTS.map((_, index) => {
  const angle = -90 + (index / PROJECTS.length) * 360;
  const radians = (angle * Math.PI) / 180;

  return {
    left: `${50 + Math.cos(radians) * (index % 2 === 0 ? 43 : 30)}%`,
    top: `${50 + Math.sin(radians) * (index % 2 === 0 ? 43 : 30)}%`,
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
            {project.status ?? (project.link ? "Web application" : "Source project")}
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
              {project.github && <a href={project.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-slate-400 transition-colors hover:text-violet-200"><Code className="h-4 w-4" /> Source</a>}
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
    <div ref={sectionRef} className="cinematic-desktop relative" style={{ height: `${PROJECTS.length * 200}vh` }}>
      <motion.div style={{ opacity: sceneOpacity, y: sceneY }} className="sticky top-0 mx-auto flex h-[100dvh] min-h-[700px] max-w-[90rem] flex-col overflow-hidden px-10 py-14 lg:px-16 lg:py-16 min-[2200px]:max-w-[150rem] min-[2200px]:px-24">
        <div className="flex shrink-0 items-end justify-between gap-10">
          <div>
            <SectionEyebrow number="03" label="Projects" />
            <h2 id="project-constellation-title" className="text-4xl font-semibold tracking-[-0.045em] text-white lg:text-5xl">Key <span className="font-light text-cyan-200">projects</span></h2>
          </div>
          <div className="max-w-sm text-right">
            <p className="font-mono text-[9px] tracking-[0.25em] text-cyan-300/70 uppercase">Project constellation</p>
            <label htmlFor="project-picker" className="mt-2 block text-xs text-slate-400">Choose any project</label>
            <select id="project-picker" value={activeIndex} onChange={(event) => selectProject(Number(event.target.value))} className="mt-2 w-full max-w-xs rounded-lg border border-cyan-200/25 bg-[#061117] px-3 py-2 text-sm text-white focus-visible:outline-2 focus-visible:outline-cyan-200">
              {PROJECTS.map((item, index) => <option key={item.title} value={index}>{item.title}</option>)}
            </select>
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
                    <span className={`relative flex h-10 w-10 items-center justify-center rounded-full border bg-black font-mono text-[9px] transition-all duration-500 lg:h-10 lg:w-10 ${active ? "scale-110 text-white" : "border-white/15 text-slate-600 group-hover:border-white/40 group-hover:text-slate-300"}`} style={active ? { borderColor: item.accent, boxShadow: `inset 0 0 17px ${item.accent}2c` } : undefined}>{String(index + 1).padStart(2, "0")}</span>
                  </button>
                );
              })}

              <p className="absolute right-0 bottom-[3%] left-0 text-center font-mono text-[8px] tracking-[0.2em] text-slate-400 uppercase">{project.signal}</p>
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
    <div className="cinematic-adaptive relative px-6 py-28">
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
                {project.github && <a href={project.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-slate-400"><Code className="h-3.5 w-3.5" /> Source</a>}
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
