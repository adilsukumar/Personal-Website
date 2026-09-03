"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useHeroReveal } from "@/lib/heroReveal";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#certifications", label: "Certifications" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const { revealed } = useHeroReveal();

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      className="pointer-events-none fixed top-0 left-0 z-50 flex w-full items-center justify-between px-6 py-4"
    >
      {/* Full-width scrim so page content scrolling underneath never collides
          with the logo (which, unlike the nav-links pill and Contact button,
          has no background of its own to sit on). */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-black/80 via-black/30 to-transparent" />

      {/* Withholds the name until Hero's own scroll-linked reveal actually
          shows it — the nav shouldn't spoil the "one person" build-up by
          announcing who it is from the very first frame. min-width keeps the
          pill from visibly resizing when the content crossfades — measured
          "ADIL SUKUMAR" at this size/tracking renders ~160px, so 11rem
          (176px) leaves headroom across fonts/renderers. */}
      <a
        href="#top"
        aria-label="Adil Sukumar — back to top"
        className="pointer-events-auto flex min-w-[11rem] items-center justify-center overflow-hidden rounded-full border border-white/10 bg-black/40 px-4 py-2 text-lg font-bold tracking-tighter text-white backdrop-blur-md transition-colors hover:text-cyan-300"
      >
        <AnimatePresence mode="wait" initial={false}>
          {revealed ? (
            <motion.span
              key="name"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
              aria-hidden="true"
            >
              ADIL SUKUMAR
            </motion.span>
          ) : (
            <motion.span
              key="placeholder"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
              className="flex h-[1lh] items-center"
              aria-hidden="true"
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300 shadow-[0_0_10px_3px_rgba(34,211,238,0.7)]" />
            </motion.span>
          )}
        </AnimatePresence>
      </a>

      <div className="pointer-events-auto hidden items-center gap-8 rounded-full border border-white/10 bg-black/40 px-8 py-3 backdrop-blur-md md:flex">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="text-sm font-medium text-gray-300 transition-colors hover:text-cyan-300"
          >
            {link.label}
          </a>
        ))}
      </div>

      <a
        href="mailto:adilsukumar24@gmail.com"
        className="pointer-events-auto rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20"
      >
        Contact
      </a>
    </motion.nav>
  );
}
