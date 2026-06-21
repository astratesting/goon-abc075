import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Goon — On-Demand 3D Printing for Inventors",
  description:
    "Upload your CAD file, get AI-repaired, printed, and shipped same-day. No long lead times, no high MOQs.",
  openGraph: {
    title: "Goon — On-Demand 3D Printing for Inventors",
    description:
      "Upload your CAD file, get AI-repaired, printed, and shipped same-day.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
