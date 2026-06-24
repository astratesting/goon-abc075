"use client";

import { useState } from "react";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-softwhite/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="/" className="text-2xl font-black tracking-tight">
          GOON
        </a>

        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
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

        <div className="hidden items-center gap-8 md:flex">
          <a href="#about" className="text-sm font-medium text-gray-600 hover:text-black">
            About
          </a>
          <a href="#services" className="text-sm font-medium text-gray-600 hover:text-black">
            Services
          </a>
          <a href="#waitlist" className="text-sm font-medium text-gray-600 hover:text-black">
            Waitlist
          </a>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-gray-200 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <a href="#about" className="text-sm font-medium text-gray-600 hover:text-black">
              About
            </a>
            <a href="#services" className="text-sm font-medium text-gray-600 hover:text-black">
              Services
            </a>
            <a href="#waitlist" className="text-sm font-medium text-gray-600 hover:text-black">
              Waitlist
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
