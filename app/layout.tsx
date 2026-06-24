import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Archivo_Black } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { PostHogProvider } from "@/components/PostHogProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo-black",
});

export const metadata: Metadata = {
  title: "Goon — Coming Soon | Your Space. Your Vibe.",
  description:
    "A safe, affirming spa and salon built exclusively for gay men. Premium grooming in a space designed for you. Join the waitlist.",
  openGraph: {
    title: "Goon — Coming Soon",
    description:
      "A safe, affirming spa and salon built exclusively for gay men.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${archivoBlack.variable} scroll-smooth`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap"
        />
      </head>
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
