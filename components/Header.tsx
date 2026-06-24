"use client";

import Link from "next/link";
import { Orbit } from "./Orbit";

export function Header() {
  return (
    <header className="sticky top-0 z-50 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4">
      <Link href="/dashboard" className="flex items-center gap-2">
        <Orbit size={24} className="text-sky-brand" />
        <span className="font-serif text-lg font-bold text-gray-900">Goon</span>
      </Link>
    </header>
  );
}
