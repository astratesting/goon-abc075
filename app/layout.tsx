import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { PostHogProvider } from "@/components/PostHogProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Goon — On-Demand 3D Printing for Inventors",
  description:
    "Upload your CAD file, get an instant quote, and have your 3D print shipped — no minimum orders, no sales calls.",
  openGraph: {
    title: "Goon — On-Demand 3D Printing for Inventors",
    description:
      "Upload your CAD file, get an instant quote, and have your 3D print shipped — no minimum orders, no sales calls.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body
        className="min-h-screen bg-softwhite text-gray-900 antialiased"
        style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}
      >
        <AuthProvider>
          <PostHogProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </PostHogProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
