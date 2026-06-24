export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <span className="text-2xl font-black tracking-tight">GOON</span>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-500">
              A safe, affirming spa and salon built exclusively for gay men. Premium grooming in a space designed for you.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Navigate</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#about" className="text-sm text-gray-500 hover:text-gray-900">
                  About
                </a>
              </li>
              <li>
                <a href="#services" className="text-sm text-gray-500 hover:text-gray-900">
                  Services
                </a>
              </li>
              <li>
                <a href="#waitlist" className="text-sm text-gray-500 hover:text-gray-900">
                  Waitlist
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900">Coming Soon</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <span className="text-sm text-gray-400">Booking</span>
              </li>
              <li>
                <span className="text-sm text-gray-400">Gift Cards</span>
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
            &copy; {new Date().getFullYear()} GOON. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
