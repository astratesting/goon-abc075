"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { UserMenu } from "./UserMenu";

export function TopBar() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-sky-100/60 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative h-7 w-7">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-brand to-mint-brand opacity-80" />
            <div className="absolute inset-1.5 rounded-full bg-white" />
            <div className="absolute inset-3 rounded-full bg-gradient-to-br from-sky-brand to-mint-brand" />
          </div>
          <span className="font-serif text-lg font-bold tracking-tight text-gray-900 group-hover:text-sky-700 transition-colors">
            Goon
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="text-sm text-gray-600 hover:text-sky-700 transition-colors">
            Dashboard
          </Link>
          <Link href="/dashboard/orders/new" className="text-sm text-gray-600 hover:text-sky-700 transition-colors">
            New order
          </Link>
          <Link href="/dashboard/materials" className="text-sm text-gray-600 hover:text-sky-700 transition-colors">
            Materials
          </Link>
          {session?.user?.role === "admin" && (
            <Link href="/dashboard/admin/signups" className="text-sm text-sky-700 font-medium hover:text-sky-800 transition-colors">
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {session?.user && <UserMenu user={session.user} />}
        </div>
      </div>
    </header>
  );
}
