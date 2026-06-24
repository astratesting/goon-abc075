"use client";

import { getStatusLabel, getStatusColor } from "@/lib/orders/status";

interface StatusChipProps {
  status: string;
}

export function StatusChip({ status }: StatusChipProps) {
  const label = getStatusLabel(status);
  const color = getStatusColor(status);

  const colorClasses: Record<string, string> = {
    mint: "bg-mint-brand/20 text-emerald-700",
    sand: "bg-sand-brand/30 text-amber-700",
    sky: "bg-sky-brand/20 text-sky-700",
    gray: "bg-gray-100 text-gray-600",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClasses[color]}`}
    >
      {label}
    </span>
  );
}
