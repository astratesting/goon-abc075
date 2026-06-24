"use client";

import Link from "next/link";
import { StatusChip } from "@/components/StatusChip";
import { OrbitEmptyState } from "@/components/Orbit";
import { Button } from "@/components/ui/Button";
import { File } from "lucide-react";

interface OrderRow {
  id: string;
  orderNumber: string;
  fileName: string;
  material: string;
  tech: string;
  status: string;
  totalPrice: number;
  createdAt: string;
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents);
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function RecentOrdersList({ orders }: { orders: OrderRow[] }) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <OrbitEmptyState className="mx-auto mb-4" />
        <p className="text-sm font-medium text-gray-900">No orders yet</p>
        <p className="text-xs text-gray-500 mt-1">Upload a file to get started.</p>
        <div className="mt-4">
          <Link href="/orders/new">
            <Button>Upload your first file</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/orders/${order.id}`}
          className="flex items-center gap-4 py-3 px-1 hover:bg-gray-50/50 rounded-lg transition-colors"
        >
          {/* Preview thumb */}
          <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
            <File size={14} className="text-gray-400" />
          </div>

          {/* Name */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{order.fileName}</p>
            <p className="text-[10px] text-gray-400">{order.orderNumber}</p>
          </div>

          {/* Material chip */}
          <span className="hidden sm:inline-flex text-[10px] font-medium text-sky-700 bg-sky-brand/10 rounded-full px-2 py-0.5">
            {order.tech.toUpperCase()} {order.material.split("_").pop()}
          </span>

          {/* Status */}
          <StatusChip status={order.status} />

          {/* Price */}
          <span className="text-sm font-medium text-gray-900 w-16 text-right">
            {formatPrice(order.totalPrice * 100)}
          </span>

          {/* Date */}
          <span className="text-xs text-gray-400 w-16 text-right">
            {formatDate(order.createdAt)}
          </span>
        </Link>
      ))}
    </div>
  );
}
