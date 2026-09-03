import { GithubIcon, LinkedinIcon } from "./icons";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-white/10 bg-black px-6 py-12 text-gray-500 md:px-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <a
          href="#top"
          className="text-sm font-semibold tracking-tight text-gray-300 transition-colors hover:text-cyan-300"
        >
          ADIL SUKUMAR
        </a>

        <p className="text-center text-sm">
          &copy; {year} Adil Sukumar. Built with Next.js, three.js, and
          framer-motion.
        </p>

        <div className="flex items-center gap-4">
          <a
            href="https://www.linkedin.com/in/adilsukumar"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="text-gray-500 transition-colors hover:text-cyan-300"
          >
            <LinkedinIcon size={18} />
          </a>
          <a
            href="https://www.github.com/adilsukumar"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="text-gray-500 transition-colors hover:text-purple-300"
          >
            <GithubIcon size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
