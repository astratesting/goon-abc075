"use client";

import { getStageList, type OrderStage } from "@/lib/orders/progress";
import { getStatusLabel } from "@/lib/orders/status";
import { Orbit } from "./Orbit";

interface TimelineProps {
  currentStatus: string;
  size?: "sm" | "lg";
}

export function OrderTimeline({ currentStatus, size = "sm" }: TimelineProps) {
  const stages = getStageList();
  const currentIdx = stages.indexOf(currentStatus as OrderStage);

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {stages.map((stage, i) => {
        const isCompleted = currentIdx >= i && currentStatus !== "cancelled";
        const isCurrent = currentIdx === i && currentStatus !== "cancelled";
        const isFuture = i > currentIdx || currentStatus === "cancelled";

        const circleSize = size === "lg" ? "h-6 w-6" : "h-4 w-4";
        const labelSize = size === "lg" ? "text-xs" : "text-[10px]";

        return (
          <div key={stage} className="flex items-center gap-1 sm:gap-2">
            {i > 0 && (
              <div
                className={`h-px w-4 sm:w-8 transition-colors duration-250 ${
                  isCompleted ? "bg-mint-brand" : isFuture ? "bg-gray-200" : "bg-sky-brand"
                }`}
              />
            )}
            <div className="flex flex-col items-center gap-0.5">
              <div
                className={`${circleSize} rounded-full flex items-center justify-center transition-all duration-250 ${
                  isCurrent
                    ? "bg-sky-brand text-white ring-2 ring-sky-brand/20"
                    : isCompleted
                    ? "bg-mint-brand text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {isCurrent ? (
                  <Orbit size={size === "lg" ? 14 : 10} className="text-white" />
                ) : isCompleted ? (
                  <svg className={size === "lg" ? "h-3 w-3" : "h-2.5 w-2.5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : null}
              </div>
              {size === "lg" && (
                <span
                  className={`${labelSize} font-medium ${
                    isCurrent ? "text-sky-brand" : isCompleted ? "text-emerald-600" : "text-gray-400"
                  }`}
                >
                  {getStatusLabel(stage)}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
