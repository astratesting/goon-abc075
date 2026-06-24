"use client";

import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { OrderTimeline } from "@/components/Timeline";
import { StatusChip } from "@/components/StatusChip";
import { getStatusLabel } from "@/lib/orders/status";

interface ActiveOrder {
  id: string;
  orderNumber: string;
  fileName: string;
  tech: string;
  material: string;
  color: string;
  status: string;
  totalPrice: number;
  estimatedDelivery: string | null;
  createdAt: string;
}

export function ActiveOrderCard({ order }: { order: ActiveOrder }) {
  const estDate = order.estimatedDelivery
    ? new Date(order.estimatedDelivery).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "TBD";

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        {/* Preview placeholder */}
        <div className="w-20 h-20 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] text-gray-400 font-medium">Preview</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-gray-900 truncate">{order.fileName}</h3>
            <StatusChip status={order.status} />
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {order.tech.toUpperCase()} {order.material.replace(/_/g, " ")} &middot; Qty 1
          </p>

          {/* Inline timeline */}
          <div className="mt-3">
            <OrderTimeline currentStatus={order.status} size="sm" />
          </div>
        </div>

        {/* Right side */}
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-gray-400">Est. ready</p>
          <p className="text-sm font-medium text-gray-900">{estDate}</p>
          <Link
            href={`/orders/${order.id}`}
            className="mt-2 inline-flex items-center text-xs font-medium text-sky-brand hover:underline"
          >
            View details &rarr;
          </Link>
        </div>
      </div>
    </Card>
  );
}
