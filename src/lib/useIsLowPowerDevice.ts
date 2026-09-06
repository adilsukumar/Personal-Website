"use client";

import { useEffect, useState } from "react";

type PerformanceNavigator = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

let detectionStarted = false;
let detectedLowPower = false;
const subscribers = new Set<(value: boolean) => void>();

function publish(value: boolean) {
  detectedLowPower = value;
  document.documentElement.classList.toggle("low-power-effects", value);
  subscribers.forEach((subscriber) => subscriber(value));
}

/**
 * One shared, conservative device-quality probe for the whole site.
 *
 * Hardware hints catch machines that are clearly constrained. When those
 * hints look healthy, a short animation-frame sample catches software
 * rendering, remote desktops, and integrated GPUs that expose ordinary CPU
 * numbers but still cannot sustain the full visual tier. The result is shared
 * by every consumer, so the probe runs once rather than once per section.
 */
function startDetection() {
  if (detectionStarted || typeof window === "undefined") return;
  detectionStarted = true;

  const nav = navigator as PerformanceNavigator;
  const cores = nav.hardwareConcurrency || 8;
  const memory = nav.deviceMemory;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const slowUpdate = window.matchMedia("(update: slow)").matches;
  const hardwareLimited =
    cores <= 2 ||
    (memory !== undefined && memory <= 2) ||
    Boolean(nav.connection?.saveData) ||
    reducedMotion ||
    slowUpdate;

  publish(hardwareLimited);
  if (hardwareLimited) return;

  let frames = 0;
  let delayedFrames = 0;
  let startedAt = performance.now();
  let previousFrame = startedAt;

  const sample = (now: number) => {
    if (document.hidden) {
      frames = 0;
      delayedFrames = 0;
      startedAt = now;
      previousFrame = now;
      window.requestAnimationFrame(sample);
      return;
    }

    const delta = now - previousFrame;
    previousFrame = now;
    if (delta > 35) delayedFrames += 1;
    frames += 1;

    if (frames < 42) {
      window.requestAnimationFrame(sample);
      return;
    }

    const averageFrameTime = (now - startedAt) / frames;
    publish(averageFrameTime > 28 || delayedFrames >= 16);
  };

  window.requestAnimationFrame(sample);
}

export function useIsLowPowerDevice(): boolean {
  const [isLowPower, setIsLowPower] = useState(detectedLowPower);

  useEffect(() => {
    subscribers.add(setIsLowPower);
    startDetection();
    return () => {
      subscribers.delete(setIsLowPower);
    };
  }, []);

  return isLowPower;
}
