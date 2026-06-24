"use client";

interface Step {
  label: string;
}

interface StepperProps {
  steps: Step[];
  current: number;
}

export function Stepper({ steps, current }: StepperProps) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, i) => {
        const isActive = i === current;
        const isComplete = i < current;
        return (
          <div key={step.label} className="flex items-center gap-2">
            {i > 0 && (
              <div className={`h-px w-8 sm:w-12 ${isComplete ? "bg-sky-brand" : "bg-gray-200"}`} />
            )}
            <div className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  isComplete
                    ? "bg-sky-brand text-white"
                    : isActive
                    ? "bg-sky-brand text-white ring-4 ring-sky-brand/20"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {isComplete ? (
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`text-xs font-medium hidden sm:inline ${
                  isActive ? "text-gray-900" : isComplete ? "text-sky-700" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
