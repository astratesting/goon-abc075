"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
    setMobileOpen(false);
  }

  const navLinks = (
    <>
      <a href="#features" className="text-sm text-gray-500 hover:text-gray-900 transition-colors" onClick={() => setMobileOpen(false)}>
        Features
      </a>
      <a href="#pricing" className="text-sm text-gray-500 hover:text-gray-900 transition-colors" onClick={() => setMobileOpen(false)}>
        Pricing
      </a>
      <a href="#faq" className="text-sm text-gray-500 hover:text-gray-900 transition-colors" onClick={() => setMobileOpen(false)}>
        FAQ
      </a>
    </>
  );

  const authLinks = session ? (
    <>
      <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900 transition-colors" onClick={() => setMobileOpen(false)}>
        Dashboard
      </Link>
      <Link href="/dashboard/orders/new" className="text-sm text-gray-500 hover:text-gray-900 transition-colors" onClick={() => setMobileOpen(false)}>
        New Order
      </Link>
      <button onClick={handleSignOut} className="text-sm text-gray-500 hover:text-gray-900 transition-colors text-left">
        Sign out
      </button>
    </>
  ) : (
    <>
      <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors" onClick={() => setMobileOpen(false)}>
        Sign in
      </Link>
      <Link href="/signup" className="btn-primary text-sm px-5 py-2" onClick={() => setMobileOpen(false)}>
        Get started
      </Link>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-sky-100/60 bg-white/80 backdrop-blur-lg">
      <div className="section-container">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative h-8 w-8">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-brand to-mint-brand opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-2 rounded-full bg-white" />
              <div className="absolute inset-3.5 rounded-full bg-gradient-to-br from-sky-brand to-mint-brand" />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-gray-900 group-hover:text-sky-700 transition-colors">
              Goon
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks}
            <div className="h-5 w-px bg-gray-200" />
            {authLinks}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 -mr-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-3">
            {navLinks}
            <div className="h-px bg-gray-100" />
            {authLinks}
          </div>
        )}
      </div>
    </nav>
  );
}
