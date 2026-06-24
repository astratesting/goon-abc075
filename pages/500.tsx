import Link from "next/link";

export default function Custom500() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-softwhite">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">500</h1>
        <p className="text-lg text-gray-600 mb-8">An internal error occurred.</p>
        <Link href="/" className="text-sky-brand hover:underline">
          Go home
        </Link>
      </div>
    </div>
  );
}
