"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Order {
  id: string;
  orderNumber: string;
  fileName: string;
  material: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  estimatedDelivery: string | null;
}

const statusLabels: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  printing: "Printing",
  "quality-check": "Quality Check",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const statusColors: Record<string, string> = {
  pending: "bg-gray-100 text-gray-700",
  processing: "bg-purple-100 text-purple-700",
  printing: "bg-blue-100 text-blue-700",
  "quality-check": "bg-amber-100 text-amber-700",
  shipped: "bg-sky-100 text-sky-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const statusSteps = ["pending", "processing", "printing", "quality-check", "shipped", "delivered"];

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[status] ?? statusColors.pending}`}>
      {statusLabels[status] ?? status}
    </span>
  );
}

function OrderTimeline({ status }: { status: string }) {
  const currentIdx = statusSteps.indexOf(status);
  if (currentIdx < 0) return null;

  return (
    <div className="flex items-center gap-1 mt-3">
      {statusSteps.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className={`h-2 w-2 rounded-full ${i <= currentIdx ? "bg-sky-brand" : "bg-gray-200"}`} />
          {i < statusSteps.length - 1 && (
            <div className={`h-0.5 w-6 ${i < currentIdx ? "bg-sky-brand" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/orders")
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setOrders(data);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-brand border-t-transparent" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/dashboard" className="text-sm text-sky-600 hover:text-sky-700 mb-2 inline-block">
            &larr; Back to Dashboard
          </Link>
          <h1 className="font-serif text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-1 text-gray-500">Track and manage your 3D print orders</p>
        </div>
        <Link href="/upload" className="btn-primary text-sm px-5 py-2.5">
          New Order
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-brand border-t-transparent" />
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50">
            <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="font-serif text-lg font-semibold text-gray-900 mb-1">No orders yet</h3>
          <p className="text-gray-400 text-sm mb-4">Upload a 3D file to place your first order</p>
          <Link href="/upload" className="text-sky-600 hover:text-sky-700 text-sm font-medium">
            Get started &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-gray-100 bg-white p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium text-gray-900">{order.orderNumber}</h3>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-sm text-gray-500">{order.fileName}</p>
                </div>
                <p className="text-xl font-bold text-gray-900">${order.totalPrice.toFixed(2)}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-2">
                <div>
                  <p className="text-gray-400">Material</p>
                  <p className="font-medium text-gray-700">{order.material}</p>
                </div>
                <div>
                  <p className="text-gray-400">Quantity</p>
                  <p className="font-medium text-gray-700">{order.quantity}</p>
                </div>
                <div>
                  <p className="text-gray-400">Ordered</p>
                  <p className="font-medium text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-400">Est. Delivery</p>
                  <p className="font-medium text-gray-700">
                    {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : "—"}
                  </p>
                </div>
              </div>

              <OrderTimeline status={order.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
