"use client";

import { motion, AnimatePresence } from "framer-motion";
import { GithubIcon, LinkedinIcon } from "./icons";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0a1017] p-8 shadow-[0_0_40px_rgba(34,211,238,0.15)]"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
            
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-slate-500 transition-colors hover:text-white"
              aria-label="Close modal"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <h3 className="mb-2 text-2xl font-bold tracking-tight text-white">Let&apos;s connect</h3>
            <p className="mb-8 text-sm text-slate-400">Feel free to reach out for collaborations, opportunities, or just to say hi.</p>

            <div className="flex flex-col gap-4">
              <a
                href="mailto:adilsukumar24@gmail.com"
                className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-cyan-400/50 hover:bg-white/10"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-300">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs font-medium tracking-wider text-slate-500 uppercase">Email</p>
                    <p className="text-sm font-semibold text-white">adilsukumar24@gmail.com</p>
                  </div>
                </div>
                <svg className="h-4 w-4 text-slate-600 transition-colors group-hover:text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>

              <a
                href="https://www.linkedin.com/in/adilsukumar"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-blue-400/50 hover:bg-white/10"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-400/10 text-blue-300">
                    <LinkedinIcon size={18} />
                  </span>
                  <div>
                    <p className="text-xs font-medium tracking-wider text-slate-500 uppercase">LinkedIn</p>
                    <p className="text-sm font-semibold text-white">adilsukumar</p>
                  </div>
                </div>
                <svg className="h-4 w-4 text-slate-600 transition-colors group-hover:text-blue-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>

              <a
                href="https://github.com/adilsukumar"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-purple-400/50 hover:bg-white/10"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-400/10 text-purple-300">
                    <GithubIcon size={18} />
                  </span>
                  <div>
                    <p className="text-xs font-medium tracking-wider text-slate-500 uppercase">GitHub</p>
                    <p className="text-sm font-semibold text-white">adilsukumar</p>
                  </div>
                </div>
                <svg className="h-4 w-4 text-slate-600 transition-colors group-hover:text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
