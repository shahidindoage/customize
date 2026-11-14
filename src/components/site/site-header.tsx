"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, CircleUser, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type NavItem = {
  label: string;
  mega?: "cricket" | "sports";
  simpleLinks?: string[];
};

const NAV_ITEMS: NavItem[] = [
  { label: "Cricket Uniforms", mega: "cricket" },
  { label: "Sports", mega: "sports" },
  {
    label: "Resources",
    simpleLinks: [
      "Size Guide",
      "Fabric DNA",
      "FAQ",
      "Price Estimator",
      "Catalog",
    ],
  },
  { label: "Blogs" },
];

type MegaColumn = { heading: string; image?: string; links: string[] };

const CRICKET_COLUMNS: MegaColumn[] = [
  {
    heading: "Build Your Kit",
    links: [
      "Playing Jersey",
      "White T-Shirts",
      "Umpire T-Shirts",
      "White Trousers",
      "Playing Trousers",
      "Caps & Accessories",
    ],
  },
  {
    heading: "Training Wear",
    links: ["Training Jersey", "Training Shorts", "Training Tanks"],
  },
  {
    heading: "Athleisure",
    links: ["Jacket", "Hoodie", "Travel Trousers", "& More"],
  },
];

const CRICKET_PROMOS = [
  { image: "/images/mega2.png", caption: "Cricket Whites" },
  { image: "/images/mega1.png", caption: "Playing Jersey" },
];

const SPORTS_COLUMNS: MegaColumn[] = [
  {
    heading: "Cricket",
    image: "/images/cricket.jpg",
    links: [
      "Playing Jersey",
      "White T-Shirts",
      "Umpire T-Shirts",
      "White Trousers",
      "Playing Trouser",
      "Training Jersey",
      "Training Shorts",
      "Training Tanks",
      "Caps & Accessories",
    ],
  },
  {
    heading: "Soccer",
    image: "/images/soccer.jpg",
    links: [
      "Playing Jersey",
      "Playing Shorts",
      "Goalkeeper Jersey",
      "Training Tanks",
      "Umpire T-Shirts",
      "Caps",
    ],
  },
  {
    heading: "Tennis",
    image: "/images/tennis.jpg",
    links: [
      "Playing T-Shirt",
      "Playing Shorts",
      "Training Tanks",
      "Umpire T-Shirts",
      "Caps",
    ],
  },
  {
    heading: "Badminton",
    image: "/images/badminton.jpg",
    links: [
      "Playing T-Shirt",
      "Playing Shorts",
      "Training Tanks",
      "Umpire T-Shirts",
      "Caps",
    ],
  },
  {
    heading: "Pickleball",
    image: "/images/pickleball.jpg",
    links: [
      "Playing T-Shirt",
      "Playing Shorts",
      "Training Tanks",
      "Umpire T-Shirts",
      "Caps",
    ],
  },
  {
    heading: "Athleisure",
    image: "/images/off_field.jpg",
    links: [
      "Jacket",
      "Hoodie",
      "Travel Pants",
      "Officials Polo",
      "Volunteer Jersey",
      "Coach Polo",
      "Travel Polo",
      "Sweatshirts",
    ],
  },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [openMega, setOpenMega] = React.useState<"cricket" | "sports" | null>(
    null
  );
  const [openSimple, setOpenSimple] = React.useState<string | null>(null);

  const closeAllMenus = () => {
    setOpenMega(null);
    setOpenSimple(null);
  };

  return (
    <header
      className="sticky top-0 z-40 border-b border-border bg-background"
      onMouseLeave={closeAllMenus}
    >
      {/* Announcement bar - desktop only */}
      <div className="hidden bg-red-600 text-white lg:block">
        <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 text-sm font-bold sm:px-6">
          <p className="flex items-center gap-2">
            Proudly Made In India
            <img
              src="/images/india-flag.svg"
              alt="Flag of India"
              className="h-3.5 w-auto"
            />
          </p>
          <div className="flex items-center gap-3">
            <Link href="#" className="transition-opacity hover:opacity-80">
              Brand Shop
            </Link>
            <span className="h-4 w-px bg-white/60" aria-hidden />
            <a
              href="tel:+919811960396"
              className="transition-opacity hover:opacity-80"
            >
              Call : +91 9811960396
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" aria-label="Kragbuzz home" className="shrink-0">
          <img
            src="/images/logo.png"
            alt="Kragbuzz"
            className="h-16 w-auto sm:h-20"
          />
        </Link>

        {/* Center nav - desktop */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-8 lg:flex"
        >
          {NAV_ITEMS.map((item) => {
            const megaOpen = !!item.mega && openMega === item.mega;
            const simpleOpen =
              !!item.simpleLinks && openSimple === item.label;
            const isOpen = megaOpen || simpleOpen;
            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => {
                  setOpenMega(item.mega ?? null);
                  setOpenSimple(item.simpleLinks ? item.label : null);
                }}
              >
                <Link
                  href="#"
                  onClick={(e) => {
                    const mega = item.mega;
                    if (mega) {
                      e.preventDefault();
                      setOpenSimple(null);
                      setOpenMega((cur) => (cur === mega ? null : mega));
                    } else if (item.simpleLinks) {
                      e.preventDefault();
                      setOpenMega(null);
                      setOpenSimple((cur) =>
                        cur === item.label ? null : item.label
                      );
                    }
                  }}
                  aria-expanded={isOpen}
                  className={cn(
                    "inline-flex items-center gap-1.5 text-[15px] font-semibold transition-colors hover:text-red-600",
                    isOpen
                      ? "text-red-600 underline underline-offset-8"
                      : "text-foreground"
                  )}
                >
                  {item.label}
                  {(item.mega || item.simpleLinks) && (
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 text-foreground/70 transition-transform",
                        isOpen && "rotate-180 text-red-600"
                      )}
                      aria-hidden
                    />
                  )}
                </Link>

                {/* Simple dropdown (Resources / Sports Hub) */}
                {item.simpleLinks && simpleOpen && (
                  <div className="absolute left-0 top-full pt-4">
                    <div className="w-44 border border-border bg-background py-2 shadow-[0_16px_32px_-16px_rgba(0,0,0,0.18)]">
                      {item.simpleLinks.map((link) => (
                        <Link
                          key={link}
                          href="#"
                          className="block px-5 py-2.5 text-[15px] text-foreground/85 transition-colors hover:text-red-600"
                        >
                          {link}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <Link
            href="#"
            aria-label="Account"
            onMouseEnter={closeAllMenus}
            className="hidden text-foreground transition-colors hover:text-red-600 sm:inline-flex"
          >
            <CircleUser className="h-7 w-7" aria-hidden />
          </Link>
          <Link
            href="#"
            onMouseEnter={closeAllMenus}
            className="hidden rounded-lg border border-foreground/25 bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-red-600 hover:text-red-600 sm:inline-block"
          >
            Get A Free Quote
          </Link>

          {/* Mobile menu toggle */}
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Cricket Uniforms mega menu - desktop */}
      <div
        className={cn(
          "absolute inset-x-0 top-full hidden border-b border-border bg-background shadow-[0_24px_40px_-24px_rgba(0,0,0,0.18)] transition-opacity duration-200 lg:block",
          openMega === "cricket"
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
        onMouseEnter={() => setOpenMega("cricket")}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-[1fr_1.1fr] gap-12 px-6 py-9">
          {/* Link columns */}
          <div>
            <div className="grid grid-cols-3 gap-8">
              {CRICKET_COLUMNS.map((col) => (
                <div key={col.heading}>
                  <h4 className="text-[15px] font-bold uppercase tracking-wide text-foreground">
                    {col.heading}
                  </h4>
                  <ul className="mt-5 space-y-3.5">
                    {col.links.map((link) => (
                      <li key={link}>
                        <Link
                          href="#"
                          className="text-[15px] text-foreground/85 transition-colors hover:text-red-600"
                        >
                          {link}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-8 text-sm text-foreground/80">
              Already have a design?{" "}
              <Link
                href="#"
                className="font-semibold text-foreground underline underline-offset-4 hover:text-red-600"
              >
                Upload your own kit design
              </Link>
              <span className="mx-2 text-foreground/40" aria-hidden>
                ·
              </span>
              Ordering for large squads?{" "}
              <Link
                href="#"
                className="font-semibold text-foreground underline underline-offset-4 hover:text-red-600"
              >
                Contact Sales
              </Link>
            </p>
          </div>

          {/* Promo image cards */}
          <div className="flex gap-6">
            {CRICKET_PROMOS.map((promo) => (
              <Link
                key={promo.caption}
                href="#"
                className="group block flex-1"
              >
                <div className="overflow-hidden rounded-md border border-border">
                  <img
                    src={promo.image}
                    alt={promo.caption}
                    className="aspect-[4/5] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <p className="mt-3 text-center text-[15px] font-bold text-foreground transition-colors group-hover:text-red-600">
                  {promo.caption}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Sports mega menu - desktop */}
      <div
        className={cn(
          "absolute inset-x-0 top-full hidden border-b border-border bg-background shadow-[0_24px_40px_-24px_rgba(0,0,0,0.18)] transition-opacity duration-200 lg:block",
          openMega === "sports"
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        )}
        onMouseEnter={() => setOpenMega("sports")}
      >
        <div className="mx-auto grid max-w-7xl grid-cols-6 gap-6 px-6 py-7">
          {SPORTS_COLUMNS.map((col) => (
            <div key={col.heading}>
              <div className="overflow-hidden rounded-md">
                <img
                  src={col.image}
                  alt={col.heading}
                  className="aspect-[16/10] w-full object-cover"
                />
              </div>
              <h4 className="mt-4 text-[15px] font-bold uppercase tracking-wide text-foreground">
                {col.heading}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-[15px] text-foreground/85 transition-colors hover:text-red-600"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile nav panel */}
      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile navigation"
          className="border-t border-border bg-background lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col px-4 py-2 sm:px-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href="#"
                className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted hover:text-red-600"
              >
                {item.label}
                {(item.mega || item.simpleLinks) && (
                  <ChevronDown
                    className="h-3.5 w-3.5 text-foreground/60"
                    aria-hidden
                  />
                )}
              </Link>
            ))}
            <Link
              href="#"
              className="mt-2 flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-semibold text-foreground hover:text-red-600"
            >
              <CircleUser className="h-5 w-5" aria-hidden />
              Account
            </Link>
            <Link
              href="#"
              className="mb-2 mt-1 inline-flex items-center justify-center rounded-lg border border-foreground/25 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-red-600 hover:text-red-600"
            >
              Get A Free Quote
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
