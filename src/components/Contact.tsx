"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import AmbientGlow from "./AmbientGlow";
import { GithubIcon, LinkedinIcon } from "./icons";
import SectionEyebrow from "./SectionEyebrow";

export default function Contact() {
  return (
    <section id="contact" className="relative border-t border-white/5 px-6 py-32 text-white md:px-24">
      <AmbientGlow />
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 flex justify-center"
        >
          <SectionEyebrow number="04" label="Contact" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 text-4xl font-bold tracking-tight md:text-5xl"
        >
          Let&apos;s build something.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-12 text-lg font-light text-gray-400"
        >
          Open to software and embedded-systems internships, AI and
          bioinformatics research, and product collaborations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="mailto:adilsukumar24@gmail.com"
            className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-cyan-300 to-purple-300 px-6 py-3 text-sm font-semibold text-black shadow-[0_0_0_rgba(103,232,249,0)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(103,232,249,0.4)]"
          >
            <Mail size={18} /> adilsukumar24@gmail.com
          </a>
          <a
            href="https://www.linkedin.com/in/adilsukumar"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium backdrop-blur-md transition-all hover:border-cyan-400/50 hover:bg-white/10"
          >
            <LinkedinIcon size={18} /> LinkedIn
          </a>
          <a
            href="https://www.github.com/adilsukumar"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium backdrop-blur-md transition-all hover:border-purple-400/50 hover:bg-white/10"
          >
            <GithubIcon size={18} /> GitHub
          </a>
        </motion.div>
      </div>
    </section>
  );
}
