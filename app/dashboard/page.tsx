"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ActiveOrderCard } from "./ActiveOrderCard";
import { QuickUploadCard } from "./QuickUploadCard";
import { RecentOrdersList } from "./RecentOrdersList";
import { useDashboardPoller } from "./DashboardPoller";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function getFormattedDate(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [initialOrders, setInitialOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/orders?limit=5")
        .then((r) => r.json())
        .then((data) => {
          setInitialOrders(data.orders || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status, router]);

  const { activeOrders, recentOrders } = useDashboardPoller(initialOrders);

  if (status === "loading" || loading) {
    return (
      <div className="max-w-[1120px] mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-gray-200 rounded" />
          <div className="h-4 w-48 bg-gray-100 rounded" />
          <div className="h-40 bg-gray-100 rounded-xl" />
        </div>
      </div>
    );
  }

  const userName = session?.user?.email?.split("@")[0] || "there";

  let statusSentence = "No active orders. Upload a file to get started.";
  if (activeOrders.length > 0) {
    const first = activeOrders[0];
    if (first.status === "printing") {
      statusSentence = `Your ${first.material.replace(/_/g, " ")} ${first.fileName} is printing.`;
    } else if (first.status === "queued") {
      statusSentence = `Your ${first.fileName} is queued for printing.`;
    } else {
      statusSentence = `Your ${first.fileName} is in quality check.`;
    }
  }

  return (
    <div className="max-w-[1120px] mx-auto px-4 py-8">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-gray-900">Today</h1>
        <p className="text-sm text-gray-500 mt-1">{getFormattedDate()}</p>
        <p className="text-sm text-gray-600 mt-1">{statusSentence}</p>
      </div>

      {/* Active order */}
      {activeOrders.length > 0 && (
        <div className="mb-8">
          <h2 className="font-serif text-lg font-semibold text-gray-900 mb-3">Active order</h2>
          {activeOrders.map((order) => (
            <ActiveOrderCard key={order.id} order={order} />
          ))}
        </div>
      )}

      {/* Quick upload */}
      <div className="mb-8">
        <h2 className="font-serif text-lg font-semibold text-gray-900 mb-3">Quick upload</h2>
        <QuickUploadCard />
      </div>

      {/* Recent orders */}
      <div>
        <h2 className="font-serif text-lg font-semibold text-gray-900 mb-3">Recent orders</h2>
        <RecentOrdersList orders={recentOrders} />
      </div>
    </div>
  );
}
