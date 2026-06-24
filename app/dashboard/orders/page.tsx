"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatMaterialName } from "@/lib/materials";
import { formatCurrency } from "@/lib/quote";
import { Box, ChevronRight } from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  fileName: string;
  material: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 rounded-full border-2 border-sky-brand border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <Link href="/dashboard/orders/new">
          <Button>New order</Button>
        </Link>
      </div>

      <Card>
        {orders.length === 0 ? (
          <EmptyState
            icon={Box}
            title="No orders yet"
            body="Upload a file to get your first quote."
            cta={
              <Link href="/dashboard/orders/new">
                <Button>Start an order</Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/dashboard/orders/${order.id}`}
                className="flex items-center justify-between rounded-xl border border-gray-100 p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                    <Box className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500 truncate">{order.fileName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="hidden sm:inline text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {formatMaterialName(order.material)}
                  </span>
                  <StatusBadge status={order.status} />
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(order.totalPrice)}
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
