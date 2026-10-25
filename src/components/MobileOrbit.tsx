"use client";

import { useId, useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, RadioTower } from "lucide-react";

type OrbitItem = { title: string; accent?: string };

/** The desktop orbit retold for touch: seven large targets and a complete picker. */
export default function MobileOrbit({ items, activeIndex, onSelect, label }: {
  items: OrbitItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
  label: string;
}) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "80px" });
  const reducedMotion = useReducedMotion();
  const running = inView && !reducedMotion;
  const start = Math.floor(activeIndex / 7) * 7;
  const visibleItems = items.slice(start, start + 7);
  const accent = items[activeIndex].accent ?? "#67e8f9";
  const itemLabel = label.replace(/^Choose /i, "").toLowerCase();
  const angle = -90 + ((activeIndex - start) / visibleItems.length) * 360;

  return (
    <div ref={ref} data-mobile-scene="orbit" className="mt-7">
      <label htmlFor={id} className="mb-2 block text-xs font-medium text-slate-300">{label}</label>
      <select id={id} value={activeIndex} onChange={(event) => onSelect(Number(event.target.value))} className="min-h-12 w-full min-w-0 rounded-xl border border-cyan-200/30 bg-[#061117] px-3 text-sm text-white focus-visible:outline-2 focus-visible:outline-cyan-200">
        {items.map((item, index) => <option key={item.title} value={index}>{item.title}</option>)}
      </select>
      <div className="relative mx-auto my-5 aspect-square w-full max-w-[22rem]">
        <motion.div data-orbit-rotor aria-hidden="true" className="absolute inset-[9%] rounded-full border border-dashed border-cyan-200/40" animate={{ rotate: running ? 360 : 0 }} transition={{ duration: running ? 36 : 0, ease: "linear", repeat: running ? Infinity : 0 }} />
        <motion.div aria-hidden="true" className="absolute inset-[24%] rounded-full border border-violet-300/30" animate={{ rotate: running ? -360 : 0 }} transition={{ duration: running ? 28 : 0, ease: "linear", repeat: running ? Infinity : 0 }} />
        <motion.div aria-hidden="true" className="absolute top-1/2 left-1/2 h-px w-[40%] origin-left" animate={{ rotate: angle }} transition={{ duration: reducedMotion ? 0 : 0.45 }} style={{ background: `linear-gradient(90deg,${accent},transparent)` }} />
        <div className="absolute inset-[34%] flex flex-col items-center justify-center rounded-full border border-white/15 bg-[#061117] text-center">
          <RadioTower className="h-5 w-5" style={{ color: accent }} />
          <span className="mt-1 font-mono text-xl text-white">{String(activeIndex + 1).padStart(2, "0")}</span>
          <span className="text-[10px] text-slate-400">of {items.length}</span>
        </div>
        {visibleItems.map((item, index) => {
          const itemIndex = start + index;
          const radians = (-90 + (index / visibleItems.length) * 360) * Math.PI / 180;
          const selected = itemIndex === activeIndex;
          return <button key={item.title} type="button" aria-label={`Select ${item.title}`} aria-pressed={selected} onClick={() => onSelect(itemIndex)} className="absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-[#03090d] font-mono text-xs text-slate-300 transition-colors focus-visible:outline-2 focus-visible:outline-cyan-100" style={{ left: `${(50 + Math.cos(radians) * 40).toFixed(4)}%`, top: `${(50 + Math.sin(radians) * 40).toFixed(4)}%`, borderColor: selected ? accent : "#ffffff30", color: selected ? accent : undefined, boxShadow: selected ? `0 0 20px ${accent}50` : undefined }}>{String(itemIndex + 1).padStart(2, "0")}</button>;
        })}
      </div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <button type="button" aria-label={`Previous ${itemLabel}`} onClick={() => onSelect((activeIndex - 1 + items.length) % items.length)} className="flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-4 text-sm text-slate-200 focus-visible:outline-2 focus-visible:outline-cyan-200"><ArrowLeft className="h-4 w-4" /> Previous</button>
        <span className="text-xs text-slate-400">Tap to explore</span>
        <button type="button" aria-label={`Next ${itemLabel}`} onClick={() => onSelect((activeIndex + 1) % items.length)} className="flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-4 text-sm text-slate-200 focus-visible:outline-2 focus-visible:outline-cyan-200">Next <ArrowRight className="h-4 w-4" /></button>
      </div>
    </div>
  );
}
