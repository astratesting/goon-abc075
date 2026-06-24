"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusChip } from "@/components/StatusChip";
import { OrderTimeline } from "@/components/Timeline";
import { getStatusLabel } from "@/lib/orders/status";
import { ArrowLeft, File, Download } from "lucide-react";

interface OrderDetail {
  id: string;
  orderNumber: string;
  fileName: string;
  material: string;
  tech: string;
  color: string;
  quantity: number;
  shippingZip: string;
  aiRepair: boolean;
  repaired: boolean;
  repairedIssues: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params?.id) return;
    fetch(`/api/orders/${params.id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => {
        if (data.error) {
          router.push("/orders");
        } else {
          setOrder(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        router.push("/orders");
      });
  }, [params?.id, router]);

  if (loading) {
    return (
      <div className="max-w-[1120px] mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded" />
          <div className="h-24 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!order) return null;

  const createdDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="max-w-[1120px] mx-auto px-4 py-8">
      {/* Header */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to dashboard
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <h1 className="font-serif text-2xl font-bold text-gray-900">
          Order #{order.orderNumber}
        </h1>
        <StatusChip status={order.status} />
      </div>
      <p className="text-sm text-gray-500 mb-6">{createdDate}</p>

      {/* Timeline card */}
      <Card className="p-6 mb-6">
        <OrderTimeline currentStatus={order.status} size="lg" />
        <p className="text-xs text-gray-400 mt-4">
          Status: <span className="font-medium text-gray-600">{getStatusLabel(order.status)}</span>
        </p>
      </Card>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: File info */}
        <Card className="p-6">
          <div className="w-full aspect-square max-w-[320px] rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center mx-auto mb-4">
            <span className="text-sm text-gray-400 font-medium">Preview</span>
          </div>
          <p className="text-sm font-medium text-gray-900 text-center">{order.fileName}</p>
          {order.aiRepair && (
            <p className="text-xs text-emerald-600 text-center mt-1">
              {order.repaired ? "AI repair completed" : "AI repair requested"}
            </p>
          )}
          <div className="mt-4 text-center">
            <Button variant="secondary" size="sm">
              <Download size={14} className="mr-1" />
              Download repaired file
            </Button>
          </div>
        </Card>

        {/* Right: Order summary */}
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Order summary</h3>
          <dl className="space-y-3">
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Technology</dt>
              <dd className="text-sm font-medium text-gray-900">{order.tech.toUpperCase()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Material</dt>
              <dd className="text-sm font-medium text-gray-900">{order.material.replace(/_/g, " ")}</dd>
            </div>
            <div className="flex justify-between items-center">
              <dt className="text-sm text-gray-500">Color</dt>
              <dd className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded-full border border-gray-200"
                  style={{ backgroundColor: order.color }}
                />
                <span className="text-sm font-medium text-gray-900">{order.color}</span>
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Quantity</dt>
              <dd className="text-sm font-medium text-gray-900">{order.quantity}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Shipping ZIP</dt>
              <dd className="text-sm font-medium text-gray-900">{order.shippingZip}</dd>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between">
              <dt className="text-sm text-gray-500">Total</dt>
              <dd className="text-sm font-bold text-gray-900">${order.totalPrice.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-gray-500">Status</dt>
              <dd><StatusChip status={order.status} /></dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  );
}
