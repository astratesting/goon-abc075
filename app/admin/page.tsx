"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface AdminOrder {
  id: string;
  orderNumber: string;
  fileName: string;
  material: string;
  quantity: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  user: { id: string; name: string | null; email: string | null };
}

interface AdminUser {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: string;
  _count: { orders: number };
}

interface AdminStats {
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  pendingOrders: number;
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

const VALID_STATUSES = ["pending", "processing", "printing", "quality-check", "shipped", "delivered", "cancelled"];

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "users">("orders");
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/admin")
        .then((r) => {
          if (!r.ok) {
            setError("Admin access required");
            setLoading(false);
            return null;
          }
          return r.json();
        })
        .then((data) => {
          if (data) {
            setOrders(data.orders);
            setUsers(data.users);
            setStats(data.stats);
          }
        })
        .catch(() => setError("Failed to load admin data"))
        .finally(() => setLoading(false));
    }
  }, [status]);

  async function updateOrderStatus(orderId: string, newStatus: string) {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch {
      // ignore
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-brand border-t-transparent" />
      </div>
    );
  }

  if (!session) return null;

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
          <h1 className="font-serif text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-500 mb-4">{error}</p>
          <Link href="/dashboard" className="text-sky-600 hover:text-sky-700 font-medium">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <div className="mb-8">
        <Link href="/dashboard" className="text-sm text-sky-600 hover:text-sky-700 mb-2 inline-block">
          &larr; Back to Dashboard
        </Link>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-gray-500">Manage orders and users</p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
            <p className="text-sm text-gray-500">Total Orders</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            <p className="text-sm text-gray-500">Total Users</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
            <p className="text-sm text-gray-500">Revenue</p>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-5">
            <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
            <p className="text-sm text-gray-500">Pending</p>
          </div>
        </div>
      )}

      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "orders" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "users" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Users
        </button>
      </div>

      {activeTab === "orders" ? (
        <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Order</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Customer</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">File</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Material</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Qty</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-right px-6 py-3 font-medium text-gray-500">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">No orders yet</td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-medium text-gray-900">{order.orderNumber}</td>
                      <td className="px-6 py-4 text-gray-600">
                        <div>{order.user.name ?? "—"}</div>
                        <div className="text-xs text-gray-400">{order.user.email}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{order.fileName}</td>
                      <td className="px-6 py-4 text-gray-600">{order.material}</td>
                      <td className="px-6 py-4 text-gray-600">{order.quantity}</td>
                      <td className="px-6 py-4">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="rounded-lg border border-gray-200 px-2 py-1 text-xs focus:border-sky-brand outline-none"
                        >
                          {VALID_STATUSES.map((s) => (
                            <option key={s} value={s}>{statusLabels[s]}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900">${order.totalPrice.toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Name</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Email</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Role</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Orders</th>
                  <th className="text-left px-6 py-3 font-medium text-gray-500">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400">No users yet</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-medium text-gray-900">{user.name ?? "—"}</td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{user._count.orders}</td>
                      <td className="px-6 py-4 text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
