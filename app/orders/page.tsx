"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusChip } from "@/components/StatusChip";
import { OrbitEmptyState } from "@/components/Orbit";
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

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchOrders = useCallback(async (cursor?: string) => {
    const url = cursor ? `/api/orders?cursor=${cursor}&limit=20` : "/api/orders?limit=20";
    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (cursor) {
          setOrders((prev) => [...prev, ...(data.orders || [])]);
        } else {
          setOrders(data.orders || []);
        }
        setHasMore(data.hasMore);
        setNextCursor(data.nextCursor);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  function loadMore() {
    if (!nextCursor) return;
    setLoadingMore(true);
    fetchOrders(nextCursor);
  }

  if (loading) {
    return (
      <div className="max-w-[1120px] mx-auto px-4 py-8">
        <h1 className="font-serif text-2xl font-bold text-gray-900 mb-6">Order history</h1>
        <div className="animate-pulse space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-[1120px] mx-auto px-4 py-8">
        <h1 className="font-serif text-2xl font-bold text-gray-900 mb-6">Order history</h1>
        <Card className="p-8">
          <div className="text-center">
            <OrbitEmptyState className="mx-auto mb-4" />
            <p className="text-sm font-medium text-gray-900">No orders yet</p>
            <p className="text-xs text-gray-500 mt-1">Upload a file to get started.</p>
            <div className="mt-4">
              <Link href="/orders/new">
                <Button>Upload your first file</Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-[1120px] mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-gray-900">Order history</h1>
        <Link href="/orders/new" className="text-sm font-medium text-sky-brand hover:underline">
          New order &rarr;
        </Link>
      </div>

      <Card className="overflow-hidden">
        {/* Table header - desktop */}
        <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-3 border-b border-gray-100 text-xs font-medium text-gray-400 uppercase tracking-wider">
          <div className="col-span-1"></div>
          <div className="col-span-3">File</div>
          <div className="col-span-2">Tech</div>
          <div className="col-span-2">Material</div>
          <div className="col-span-1">Status</div>
          <div className="col-span-1 text-right">Price</div>
          <div className="col-span-2 text-right">Date</div>
        </div>

        {/* Rows */}
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
      </Card>

      {hasMore && (
        <div className="text-center mt-4">
          <Button variant="ghost" onClick={loadMore} loading={loadingMore}>
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}
