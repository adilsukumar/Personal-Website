"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function AmbientSound() {
  const [enabled, setEnabled] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // We add a tiny delay to mark it as ready so the iframe has time to load
    const timer = setTimeout(() => setIsReady(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const toggle = () => {
    if (!isReady) return;

    const iframe = iframeRef.current?.contentWindow;
    if (!iframe) return;

    if (enabled) {
      iframe.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      setEnabled(false);
    } else {
      iframe.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      setEnabled(true);
    }
  };

  return (
    <>
      <iframe
        ref={iframeRef}
        title="BGM"
        width="1"
        height="1"
        src="https://www.youtube.com/embed/fzNMd3Tu1Zw?enablejsapi=1&autoplay=0&loop=1&playlist=fzNMd3Tu1Zw"
        frameBorder="0"
        allow="autoplay"
        className="absolute -top-[9999px] -left-[9999px] opacity-0"
      />
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
    </>
  );
}
