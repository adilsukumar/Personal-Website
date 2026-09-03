/** Small numbered label used above each section heading past the hero/story
 *  — matches the mono-font, uppercase, wide-tracking style already used for
 *  the stat-card labels ("FOCUS", "BASED IN", ...) earlier on the page. */
export default function SectionEyebrow({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-3 font-mono text-xs tracking-[0.3em] text-cyan-300/70 uppercase">
      <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_2px_rgba(34,211,238,0.6)]" />
      {number} — {label}
    </div>
  );
}
