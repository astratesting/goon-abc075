interface OrbitProps {
  size?: number;
  className?: string;
}

export function Orbit({ size = 16, className = "" }: OrbitProps) {
  const ringR = size / 2 - 1;
  const dotR = size * 0.125;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={ringR}
        stroke="currentColor"
        strokeWidth={1.5}
        fill="none"
      />
      <circle
        cx={size / 2 + ringR * 0.5}
        cy={size / 2 - ringR * 0.866}
        r={dotR}
        fill="currentColor"
      />
    </svg>
  );
}

export function OrbitSpinner({ size = 20, className = "" }: OrbitProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={`animate-spin ${className}`}
      aria-hidden="true"
    >
      <circle
        cx="10"
        cy="10"
        r="8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="40 10"
        strokeLinecap="round"
        fill="none"
        opacity="0.3"
      />
      <circle cx="10" cy="2.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function OrbitEmptyState({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <Orbit size={64} className="text-gray-200 animate-[spin_8s_linear_infinite]" />
      <Orbit size={48} className="absolute top-4 left-4 text-gray-300 animate-[spin_6s_linear_infinite_reverse]" />
    </div>
  );
}
