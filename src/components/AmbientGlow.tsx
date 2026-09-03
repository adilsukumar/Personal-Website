/**
 * Two large, slow-drifting blurred blobs behind a section's content — pure
 * CSS (see the ambient-drift keyframes in globals.css), with the shared
 * low-power tier holding the blobs still and reducing their blur radius.
 * Purely decorative: aria-hidden, pointer-events disabled, and absolutely
 * positioned so it never affects layout.
 */
export default function AmbientGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div className="performance-glow animate-ambient-drift-a absolute -top-24 -left-24 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="performance-glow animate-ambient-drift-b absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
    </div>
  );
}
