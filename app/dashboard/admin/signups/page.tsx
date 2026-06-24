"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Users } from "lucide-react";

interface Signup {
  email: string;
  createdAt: string;
  lastSignInAt: string | null;
}

export default function AdminSignupsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [signups, setSignups] = useState<Signup[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (session?.user?.role !== "admin") {
      router.push("/dashboard");
      return;
    }
    setHasAccess(true);
    fetch("/api/admin")
      .then((r) => r.json())
      .then((data) => {
        setSignups(data.recentSignups || []);
        setTotal(data.totalUsers || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [session, router]);

  if (!hasAccess || loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-6 w-6 rounded-full border-2 border-sky-brand border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Signup analytics</h1>

      <Card className="mb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
            <Users className="h-7 w-7" />
          </div>
          <div>
            <p className="text-4xl font-bold text-gray-900">{total}</p>
            <p className="text-sm text-gray-500">Total signups</p>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-semibold text-gray-900 mb-4">Recent signups</h2>
        {signups.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No signups yet"
            body="New signups will appear here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-xs font-medium text-gray-500">Email</th>
                  <th className="text-left py-2 text-xs font-medium text-gray-500">Signed up</th>
                  <th className="text-left py-2 text-xs font-medium text-gray-500">Last sign in</th>
                </tr>
              </thead>
              <tbody>
                {signups.map((s, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0">
                    <td className="py-2.5 text-gray-900">{s.email}</td>
                    <td className="py-2.5 text-gray-500">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 text-gray-500">
                      {s.lastSignInAt ? new Date(s.lastSignInAt).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
