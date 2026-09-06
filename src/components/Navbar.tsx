"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useHeroReveal } from "@/lib/heroReveal";
import ContactModal from "./ContactModal";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#certifications", label: "Certifications" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const { revealed } = useHeroReveal();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="pointer-events-none fixed top-0 left-0 z-50 flex w-full items-center justify-between px-4 py-3 sm:px-6 sm:py-4"
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
          className="pointer-events-auto flex min-w-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-black/40 px-3 py-2 text-sm font-bold tracking-tighter text-white backdrop-blur-md transition-colors hover:text-cyan-300 sm:min-w-[11rem] sm:px-4 sm:text-lg"
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

        <div className="pointer-events-auto hidden items-center gap-6 rounded-full border border-white/10 bg-black/40 px-6 py-3 backdrop-blur-md lg:flex xl:gap-8 xl:px-8">
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

        {/* Desktop Contact button */}
        <button
          onClick={() => setContactModalOpen(true)}
          className="pointer-events-auto hidden rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20 lg:block"
        >
          Contact
        </button>

        {/* Mobile hamburger button */}
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((prev) => !prev)}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-md lg:hidden"
        >
          <div className="relative flex h-4 w-5 flex-col items-center justify-center">
            <span
              className={`absolute h-[1.5px] w-5 rounded-full bg-white transition-all duration-300 ${
                mobileOpen ? "rotate-45" : "-translate-y-1.5"
              }`}
            />
            <span
              className={`absolute h-[1.5px] w-5 rounded-full bg-white transition-all duration-300 ${
                mobileOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute h-[1.5px] w-5 rounded-full bg-white transition-all duration-300 ${
                mobileOpen ? "-rotate-45" : "translate-y-1.5"
              }`}
            />
          </div>
        </button>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={closeMobile}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="absolute right-0 top-0 flex h-full w-72 flex-col border-l border-white/10 bg-black/80 px-8 pt-24 backdrop-blur-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <nav className="flex flex-col gap-6">
                {LINKS.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={closeMobile}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="text-lg font-medium text-gray-300 transition-colors hover:text-cyan-300"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>

              <div className="mt-auto pb-12">
                <button
                  onClick={() => {
                    setContactModalOpen(true);
                    closeMobile();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-300 to-purple-300 px-6 py-3 text-sm font-semibold text-black transition-all hover:scale-105"
                >
                  Contact Me
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
    </>
  );
}
