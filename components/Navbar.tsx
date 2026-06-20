"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-sky-100/60 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative h-8 w-8">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-brand to-mint-brand opacity-80" />
            <div className="absolute inset-1.5 rounded-full bg-white" />
            <div className="absolute inset-3 rounded-full bg-gradient-to-br from-sky-brand to-mint-brand" />
          </div>
          <span className="font-serif text-xl font-bold tracking-tight text-gray-900 group-hover:text-sky-700 transition-colors">
            Goon
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm text-gray-600 hover:text-sky-700 transition-colors"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-sm text-gray-600 hover:text-sky-700 transition-colors"
          >
            Pricing
          </a>
          <a
            href="#faq"
            className="text-sm text-gray-600 hover:text-sky-700 transition-colors"
          >
            FAQ
          </a>
          <a
            href="#waitlist"
            className="text-sm text-gray-600 hover:text-sky-700 transition-colors"
          >
            Waitlist
          </a>
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 hover:text-sky-700 transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm text-gray-500 hover:text-red-600 transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-sky-700 transition-colors"
              >
                Sign in
              </Link>
              <Link href="/login" className="btn-primary !px-6 !py-2 !text-xs">
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-sky-100/60 bg-white/95 backdrop-blur-lg px-6 py-4 space-y-3">
          <a
            href="#features"
            className="block text-sm text-gray-600"
            onClick={() => setMenuOpen(false)}
          >
            Features
          </a>
          <a
            href="#pricing"
            className="block text-sm text-gray-600"
            onClick={() => setMenuOpen(false)}
          >
            Pricing
          </a>
          <a
            href="#faq"
            className="block text-sm text-gray-600"
            onClick={() => setMenuOpen(false)}
          >
            FAQ
          </a>
          <a
            href="#waitlist"
            className="block text-sm text-gray-600"
            onClick={() => setMenuOpen(false)}
          >
            Waitlist
          </a>
          {session ? (
            <>
              <Link
                href="/dashboard"
                className="block text-sm text-gray-600"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="block text-sm text-red-500"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block text-sm text-gray-600"
                onClick={() => setMenuOpen(false)}
              >
                Sign in
              </Link>
              <Link href="/login" className="btn-primary !text-xs mt-2">
                Get started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
