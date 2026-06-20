export function OrbitMotif({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Central glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-40 w-40 rounded-full bg-sky-brand/10 blur-3xl" />

      {/* Orbit ring 1 */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full border border-sky-brand/10"
        style={{ "--orbit-radius": "150px" } as React.CSSProperties}
      >
        <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-sky-brand/40 animate-orbit-slow" />
      </div>

      {/* Orbit ring 2 */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full border border-mint-brand/10">
        <div
          className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-mint-brand/50 animate-orbit-medium"
          style={{ "--orbit-radius": "250px" } as React.CSSProperties}
        />
      </div>

      {/* Orbit ring 3 */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full border border-sand-brand/10">
        <div
          className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-sand-brand/40 animate-orbit-fast"
          style={{ "--orbit-radius": "350px" } as React.CSSProperties}
        />
      </div>
    </div>
  );
}
