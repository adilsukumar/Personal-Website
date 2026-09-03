// World population estimate + the real-world rates behind the live ticker
// used by the PopulationJourney scroll story.
//
// The starting figure is anchored to a real UN World Population Prospects
// (2024 revision) estimate and projected forward with a real-world net growth
// rate, so the number is in the right ballpark for "today" without ever
// calling an API. From there a random-walk ticker (weighted by real global
// birth/death rates) takes over in the component — that's what gives the
// visible "increasing and decreasing" flicker, while still trending upward
// like the real thing does.

// UN WPP 2024 revision: ~8.119B at mid-2024, growing ~0.88%/yr at the time.
const ANCHOR_DATE = Date.UTC(2024, 6, 1); // 2024-07-01
const ANCHOR_POPULATION = 8_119_000_000;
const ANNUAL_GROWTH_RATE = 0.0088;

// Worldometer-style global rates: roughly 4.3 births/sec and 1.9 deaths/sec
// worldwide, net ~2.4/sec — consistent with ANNUAL_GROWTH_RATE above at ~8.2B
// people (2.4 * 31,557,600s/yr ≈ 76M/yr ≈ 0.9% of 8.2B).
export const BIRTHS_PER_SECOND = 4.3;
export const DEATHS_PER_SECOND = 1.9;

/** Deterministic when called with no argument (or ANCHOR_DATE), so the very
 *  first server + client render match exactly. Pass Date.now() from an
 *  effect (client-only) to get today's estimate. */
export function estimateWorldPopulation(atMs: number = ANCHOR_DATE): number {
  const yearsElapsed = (atMs - ANCHOR_DATE) / (1000 * 60 * 60 * 24 * 365.25);
  return Math.round(
    ANCHOR_POPULATION * Math.pow(1 + ANNUAL_GROWTH_RATE, yearsElapsed)
  );
}

export function formatWithCommas(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

export interface PopulationGroups {
  billions: number;
  millions: number;
  thousands: number;
  remainder: number;
}

export function splitIntoGroups(n: number): PopulationGroups {
  const value = Math.round(n);
  const billions = Math.floor(value / 1_000_000_000);
  const millions = Math.floor((value % 1_000_000_000) / 1_000_000);
  const thousands = Math.floor((value % 1_000_000) / 1_000);
  const remainder = value % 1_000;
  return { billions, millions, thousands, remainder };
}
