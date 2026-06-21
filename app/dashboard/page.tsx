"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, StatusBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatMaterialName } from "@/lib/materials";
import { formatCurrency } from "@/lib/quote";
import { track } from "@/lib/analytics";
import { Box, Upload, Layers, ChevronRight, Users } from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  fileName: string;
  material: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

interface Signup {
  email: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [signups, setSignups] = useState<Signup[]>([]);
  const [totalSignups, setTotalSignups] = useState(0);
  const [loading, setLoading] = useState(true);
  const [onboarded, setOnboarded] = useState<boolean | null>(null);

  const firstName = session?.user?.name?.split(" ")[0] || session?.user?.email?.split("@")[0] || "there";
  const isAdmin = session?.user?.role === "admin";
  const memberSince = session?.user?.id ? new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "";

  useEffect(() => {
    async function load() {
      // Check onboarding
      const profileRes = await fetch("/api/profile");
      if (profileRes.ok) {
        const profile = await profileRes.json();
        if (!profile.onboarded) {
          router.push("/onboarding");
          return;
        }
        setOnboarded(true);
      }

      // Load orders
      const ordersRes = await fetch("/api/orders");
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(data);
      }

      // Load admin data
      if (isAdmin) {
        const adminRes = await fetch("/api/admin");
        if (adminRes.ok) {
          const data = await adminRes.json();
          setSignups(data.recentSignups || []);
          setTotalSignups(data.totalUsers || 0);
        }
      }

      setLoading(false);
    }
    load();
  }, [isAdmin, router]);

  if (loading || onboarded === null) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 rounded-full border-2 border-sky-brand border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {firstName}.</h1>
        <p className="mt-1 font-serif italic text-gray-500">Ready to print?</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Orders card */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Your orders</h2>
              <Link href="/dashboard/orders/new">
                <Button size="sm">New order</Button>
              </Link>
            </div>

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

          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-4">
            <Link href="/dashboard/orders/new">
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                    <Upload className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Upload a file</p>
                    <p className="text-xs text-gray-500">Get a quote in seconds</p>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/dashboard/materials">
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint-brand/20 text-emerald-600">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Browse materials</p>
                    <p className="text-xs text-gray-500">FDM, SLA, SLS options</p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Account card */}
          <Card>
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Account</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Email</span>
                <span className="text-gray-900 truncate max-w-[180px]">{session?.user?.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Member since</span>
                <span className="text-gray-900">{memberSince}</span>
              </div>
            </div>
            <Link href="/dashboard/account" className="mt-4 inline-block text-sm text-sky-700 hover:underline">
              Edit profile
            </Link>
          </Card>

          {/* Admin analytics */}
          {isAdmin && (
            <Card>
              <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Admin: Signup analytics
              </h2>
              <div className="mb-4">
                <p className="text-3xl font-bold text-gray-900">{totalSignups}</p>
                <p className="text-xs text-gray-500">Total signups</p>
              </div>
              {signups.length > 0 && (
                <div className="space-y-2">
                  {signups.slice(0, 5).map((s, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="text-gray-600 truncate max-w-[140px]">{s.email}</span>
                      <span className="text-gray-400">{new Date(s.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
              <Link href="/dashboard/admin/signups" className="mt-3 inline-block text-xs text-sky-700 hover:underline">
                View all
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
