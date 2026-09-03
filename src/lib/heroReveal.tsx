"use client";

// Shared between Hero (which knows, from its own scroll progress, exactly
// when the "ADIL SUKUMAR" title has actually appeared) and Navbar (which
// needs to know that to stop spoiling the name early). They're siblings
// under the same page, not parent/child, so a tiny context is the simplest
// way to connect them without threading scroll state through props.

import { createContext, useContext, useState, type ReactNode } from "react";

interface HeroRevealValue {
  revealed: boolean;
  setRevealed: (revealed: boolean) => void;
}

const HeroRevealContext = createContext<HeroRevealValue | null>(null);

export function HeroRevealProvider({ children }: { children: ReactNode }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <HeroRevealContext.Provider value={{ revealed, setRevealed }}>
      {children}
    </HeroRevealContext.Provider>
  );
}

export function useHeroReveal(): HeroRevealValue {
  const ctx = useContext(HeroRevealContext);
  if (!ctx) {
    throw new Error("useHeroReveal must be used within a HeroRevealProvider");
  }
  return ctx;
}
