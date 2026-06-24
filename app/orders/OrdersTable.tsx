"use client";

import Link from "next/link";
import { StatusChip } from "@/components/StatusChip";
import { File } from "lucide-react";

interface OrderRow {
  id: string;
  orderNumber: string;
  fileName: string;
  tech: string;
  material: string;
  status: string;
  totalPrice: number;
  createdAt: string;
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents);
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function OrdersTable({ orders }: { orders: OrderRow[] }) {
  return (
    <div className="divide-y divide-gray-100">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/orders/${order.id}`}
          className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 items-center px-4 py-3 hover:bg-gray-50/50 transition-colors"
        >
          <div className="col-span-1 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
              <File size={14} className="text-gray-400" />
            </div>
          </div>
          <div className="col-span-3">
            <p className="text-sm font-medium text-gray-900 truncate">{order.fileName}</p>
            <p className="text-[10px] text-gray-400 md:hidden">{order.orderNumber}</p>
          </div>
          <div className="col-span-2 hidden md:block text-sm text-gray-600">{order.tech.toUpperCase()}</div>
          <div className="col-span-2 hidden md:block text-sm text-gray-600">{order.material.replace(/_/g, " ")}</div>
          <div className="col-span-1"><StatusChip status={order.status} /></div>
          <div className="col-span-1 text-right text-sm font-medium text-gray-900">{formatPrice(order.totalPrice * 100)}</div>
          <div className="col-span-2 text-right text-xs text-gray-400">{formatDate(order.createdAt)}</div>
        </Link>
      ))}
    </div>
  );
}
