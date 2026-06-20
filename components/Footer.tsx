import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-sky-100/60 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-7 w-7">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-brand to-mint-brand opacity-80" />
                <div className="absolute inset-1.5 rounded-full bg-white" />
                <div className="absolute inset-3 rounded-full bg-gradient-to-br from-sky-brand to-mint-brand" />
              </div>
              <span className="font-serif text-lg font-bold text-gray-900">
                Goon
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-500 leading-relaxed">
              On-demand 3D printing for inventors and makers. Upload, repair,
              print, ship — same day.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Product</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="#features"
                  className="text-sm text-gray-500 hover:text-sky-700"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-sm text-gray-500 hover:text-sky-700"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-sm text-gray-500 hover:text-sky-700"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Company</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <span className="text-sm text-gray-400">About</span>
              </li>
              <li>
                <span className="text-sm text-gray-400">Blog</span>
              </li>
              <li>
                <span className="text-sm text-gray-400">Careers</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Legal</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <span className="text-sm text-gray-400">Privacy</span>
              </li>
              <li>
                <span className="text-sm text-gray-400">Terms</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-100 pt-6 text-center">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} Goon. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
