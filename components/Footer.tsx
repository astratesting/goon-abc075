import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-sky-100/60 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative h-7 w-7">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-brand to-mint-brand opacity-80" />
                <div className="absolute inset-2 rounded-full bg-white" />
                <div className="absolute inset-3 rounded-full bg-gradient-to-br from-sky-brand to-mint-brand" />
              </div>
              <span className="font-serif text-lg font-bold text-gray-900">
                Goon
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-500 leading-relaxed max-w-xs">
              On-demand 3D printing for inventors and makers. Upload, repair,
              print, ship — same day.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Product</h4>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="#features" className="text-sm text-gray-500 hover:text-sky-700 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-sm text-gray-500 hover:text-sky-700 transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#faq" className="text-sm text-gray-500 hover:text-sky-700 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Company</h4>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="https://github.com/nicobailon/goon" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-sky-700 transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://discord.gg/8Vrk8T73" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-sky-700 transition-colors">
                  Discord
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Support</h4>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="https://github.com/nicobailon/goon/issues" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-sky-700 transition-colors">
                  Report an issue
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Goon. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-sm text-gray-400">
            Built with
            <svg className="h-3.5 w-3.5 text-red-400 fill-red-400 mx-0.5" viewBox="0 0 24 24">
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
            for inventors
          </div>
        </div>
      </div>
    </footer>
  );
}
