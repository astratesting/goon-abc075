"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { track } from "@/lib/analytics";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (signInResult?.error) {
        setError("Account created but sign-in failed. Please sign in manually.");
        setLoading(false);
      } else {
        track("signup_completed", { email });
        router.push("/onboarding");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-[420px]">
        <div className="mb-8">
          <div className="mb-6 relative h-10 w-10">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-brand to-mint-brand opacity-80" />
            <div className="absolute inset-2 rounded-full bg-white" />
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-sky-brand to-mint-brand" />
          </div>
          <h1 className="text-[28px] font-bold text-gray-900">Create your Goon account</h1>
          <p className="mt-1 text-gray-500 font-serif italic">Print your first part today.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Full name" type="text" placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} required />
          <Field label="Email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Field label="Password" type="password" placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" loading={loading} className="w-full py-3">Create account</Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-sky-700 font-medium hover:underline">Log in</Link>
        </p>
        <p className="mt-8 text-center text-xs text-gray-400">By continuing you agree to our Terms and Privacy.</p>
      </div>
    </div>
  );
}
