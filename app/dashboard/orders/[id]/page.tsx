"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { formatMaterialName } from "@/lib/materials";
import { formatCurrency } from "@/lib/quote";
import { ArrowLeft, File, Package, Clock, DollarSign } from "lucide-react";

interface OrderDetail {
  id: string;
  orderNumber: string;
  fileName: string;
  material: string;
  fileMeta: string | null;
  quoteCents: number;
  leadDaysMin: number;
  leadDaysMax: number;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetch(`/api/orders/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          router.push("/dashboard/orders");
        } else {
          setOrder(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        router.push("/dashboard/orders");
      });
  }, [params.id, router]);

  async function updateStatus(newStatus: string) {
    if (!order) return;
    setUpdating(true);
    const res = await fetch(`/api/orders/${order.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      const updated = await res.json();
      setOrder(updated);
    }
    setUpdating(false);
  }

  if (loading || !order) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 rounded-full border-2 border-sky-brand border-t-transparent animate-spin" />
      </div>
    );
  }

  const fileMeta = order.fileMeta ? JSON.parse(order.fileMeta) : null;
  const quote = order.quoteCents / 100;

  return (
    <div className="mx-auto max-w-3xl px-6 py-8 lg:px-8">
      <Link
        href="/dashboard/orders"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        All orders
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order {order.orderNumber}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Placed {new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
              <File className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">File</p>
              <p className="text-sm font-medium text-gray-900">{order.fileName}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-mint-brand/20 text-emerald-600">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Material</p>
              <p className="text-sm font-medium text-gray-900">{formatMaterialName(order.material)}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sand-brand/30 text-amber-600">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Quote</p>
              <p className="text-sm font-medium text-gray-900">{formatCurrency(quote)}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Lead time</p>
              <p className="text-sm font-medium text-gray-900">~{order.leadDaysMin}-{order.leadDaysMax} days</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Status update (dev-mode) */}
      <Card className="mb-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Update status</h2>
        <p className="text-xs text-gray-500 mb-4">
          Dev-mode: manually advance order status. Real status will come from fulfillment later.
        </p>
        <div className="flex flex-wrap gap-2">
          {["in_review", "printing", "shipped", "delivered"].map((s) => {
            const labels: Record<string, string> = {
              in_review: "Mark as in review",
              printing: "Mark as printing",
              shipped: "Mark as shipped",
              delivered: "Mark as delivered",
            };
            if (s === order.status) return null;
            // Only allow forward transitions
            const order = ["submitted", "in_review", "printing", "shipped", "delivered"];
            // We just show all for simplicity
            return (
              <Button
                key={s}
                variant="secondary"
                size="sm"
                disabled={updating}
                onClick={() => updateStatus(s)}
              >
                {labels[s]}
              </Button>
            );
          })}
          {order.status === "submitted" && (
            <Button
              variant="ghost"
              disabled={updating}
              onClick={() => updateStatus("cancelled")}
              className="text-red-600 hover:text-red-700"
            >
              Cancel order
            </Button>
          )}
        </div>
      </Card>

      <p className="text-sm text-gray-500">
        Email notifications: coming soon. We&apos;ll email you when your order status changes.
      </p>
    </div>
  );
}
