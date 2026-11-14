import { Fragment } from "react";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

const COMPANY_LINKS = [
  "About us",
  "Management",
  "Contact Us",
  "Brand Guidelines",
  "Brand Profiles",
  "Company Profile",
  "Kragbuzz Retail Profile",
  "Profile For Associations",
];

const BULK_ORDERING_LINKS = [
  "Catalogues",
  "Newsletter",
  "Brand Shops",
  "Media",
  "Dealer",
  "Track Order",
];

const LEGAL_LINKS = ["Privacy Policy", "Refund Policy", "Terms & Conditions"];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="space-y-5">
            <Link href="/" aria-label="Kragbuzz home" className="inline-block">
              <img
                src="/images/logo.png"
                alt="Kragbuzz"
                className="h-24 w-auto"
              />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-foreground/80">
              Kragbuzz ATHLETICO ROYAAL PVT LTD - Plot No-5A, Khasra No 15/6,
              New Mandoli Inds Area, Phase-1, New Delhi-110093
            </p>
          </div>

          {/* Company */}
          <nav aria-label="Company">
            <h3 className="text-base font-bold uppercase tracking-wide text-foreground">
              Company
            </h3>
            <ul className="mt-5 space-y-3.5">
              {COMPANY_LINKS.map((label) => (
                <li key={label}>
                  <Link
                    href="#"
                    className="text-[15px] text-foreground/90 transition-colors hover:text-red-600"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bulk ordering */}
          <nav aria-label="Bulk ordering">
            <h3 className="text-base font-bold uppercase tracking-wide text-foreground">
              Bulk Ordering
            </h3>
            <ul className="mt-5 space-y-3.5">
              {BULK_ORDERING_LINKS.map((label) => (
                <li key={label}>
                  <Link
                    href="#"
                    className="text-[15px] text-foreground/90 transition-colors hover:text-red-600"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="text-base font-bold uppercase tracking-wide text-foreground">
              Contact
            </h3>
            <ul className="mt-5 space-y-4 text-[15px] text-foreground/90">
              <li className="flex items-start gap-3">
                <Phone className="mt-1 h-4 w-4 shrink-0" aria-hidden />
                <a href="tel:+919811960396" className="hover:text-red-600">
                  +91 9811960396
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-1 h-4 w-4 shrink-0" aria-hidden />
                <a
                  href="mailto:info@kragbuzz.in"
                  className="hover:text-red-600"
                >
                  info@kragbuzz.in
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 h-4 w-4 shrink-0" aria-hidden />
                <span className="leading-relaxed">
                  ATHLETICO ROYAAL PVT LTD Plot No-5A, khasra no 15/6, New
                  Mandoli Inds area,Phase-1, New Delhi-110093
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 sm:flex-row sm:px-6">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Kragbuzz. All rights reserved.
          </p>
          <p className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
            {LEGAL_LINKS.map((label, i) => (
              <Fragment key={label}>
                {i > 0 && <span aria-hidden>·</span>}
                <Link
                  href="#"
                  className="transition-colors hover:text-foreground"
                >
                  {label}
                </Link>
              </Fragment>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
