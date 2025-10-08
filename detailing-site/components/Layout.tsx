import Link from "next/link";
import type { ReactNode } from "react";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="bg-paper text-ink">
      <header className="border-b border-muted/20 bg-white/70 py-4 backdrop-blur">
        <div className="container-narrow flex items-center justify-between gap-6">
          <Link href="/" className="text-xl font-bold text-brand">
            Detailing Site
          </Link>
          <nav>
            <ul className="flex items-center gap-4 text-sm font-semibold text-muted">
              <li>
                <Link href="/services" className="transition hover:text-brand">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="transition hover:text-brand">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-brand">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="container-narrow py-12">{children}</main>
      <footer className="border-t border-muted/20 bg-white/70 py-6 text-sm text-muted">
        <div className="container-narrow flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p>&copy; {new Date().getFullYear()} Detailing Site. All rights reserved.</p>
          <nav>
            <ul className="flex items-center gap-4">
              <li>
                <Link href="/privacy" className="transition hover:text-brand">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition hover:text-brand">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
}
