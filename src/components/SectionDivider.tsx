"use client";

interface SectionDividerProps {
  from: string;
  to: string;
}

export default function SectionDivider({ from, to }: SectionDividerProps) {
  return (
    <div className="flex w-full items-center justify-center py-24">
      <div className="h-24 w-px bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent" />
    </div>
  );
}
