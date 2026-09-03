"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

interface DroneHandle {
  stop: () => void;
}

/** Three detuned oscillators through a lowpass filter, each with its own slow
 *  LFO breathing its gain, instead of an audio file — avoids needing to
 *  source/license/host any actual audio asset for a low, wordless space-hum
 *  that just needs to sit quietly under the page. */
function startDrone(ctx: AudioContext): DroneHandle {
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);
  master.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 1.5);

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 900;
  filter.connect(master);

  const voices = [
    { freq: 55, type: "sine" as OscillatorType, gain: 0.6, lfoRate: 0.05 },
    { freq: 82.5, type: "sine" as OscillatorType, gain: 0.4, lfoRate: 0.08 },
    { freq: 110.2, type: "triangle" as OscillatorType, gain: 0.25, lfoRate: 0.11 },
  ];

  const stoppable: OscillatorNode[] = [];
  for (const voice of voices) {
    const osc = ctx.createOscillator();
    osc.type = voice.type;
    osc.frequency.value = voice.freq;

    const gain = ctx.createGain();
    gain.gain.value = voice.gain;
    osc.connect(gain);
    gain.connect(filter);
    osc.start();
    stoppable.push(osc);

    // Slow tremolo: an inaudible LFO oscillator modulating the voice's own
    // gain, so the drone breathes instead of droning flat.
    const lfo = ctx.createOscillator();
    lfo.frequency.value = voice.lfoRate;
    const lfoDepth = ctx.createGain();
    lfoDepth.gain.value = voice.gain * 0.3;
    lfo.connect(lfoDepth);
    lfoDepth.connect(gain.gain);
    lfo.start();
    stoppable.push(lfo);
  }

  return {
    stop() {
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now + 0.6);
      setTimeout(() => {
        for (const osc of stoppable) {
          try {
            osc.stop();
          } catch {
            // already stopped — fine.
          }
        }
      }, 700);
    },
  };
}

export default function AmbientSound() {
  const [enabled, setEnabled] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const droneRef = useRef<DroneHandle | null>(null);

  useEffect(() => {
    return () => {
      droneRef.current?.stop();
      ctxRef.current?.close();
    };
  }, []);

  const toggle = () => {
    if (enabled) {
      droneRef.current?.stop();
      droneRef.current = null;
      setEnabled(false);
      return;
    }
    // Created lazily, on the click itself — browsers only allow starting
    // audio in direct response to a user gesture, which this is.
    const ctx = ctxRef.current ?? new AudioContext();
    ctxRef.current = ctx;
    if (ctx.state === "suspended") ctx.resume();
    droneRef.current = startDrone(ctx);
    setEnabled(true);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={enabled ? "Mute ambient sound" : "Play ambient sound"}
      aria-pressed={enabled}
      title={enabled ? "Mute ambient sound" : "Play ambient sound"}
      className="pointer-events-auto fixed bottom-6 left-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/40 text-gray-300 backdrop-blur-md transition-colors hover:border-cyan-400/50 hover:text-cyan-300"
    >
      {enabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
    </button>
  );
}
