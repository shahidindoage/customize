import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CATEGORIES, PRODUCTS } from "@/lib/product";
import { ProductsBrowser } from "@/components/site/products-browser";

export const metadata: Metadata = {
  title: "Products - Kragbuzz Kit Builder",
  description:
    "Browse ready-to-customise sports jerseys from Kragbuzz and design your own kit.",
};

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1 text-xs text-muted-foreground"
      >
        <Link href="/" className="transition-colors hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden />
        {/* <span className="font-medium text-foreground">Products</span> */}
      </nav>

      <div className="mt-6 max-w-2xl">
        {/* <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-600">
          Collection
        </p> */}
        <h1 className="mt-2 text-5xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-6xl">
         Custom sportswear
        </h1>
        <div className="mt-4 h-1 w-16 rounded-full bg-red-600" aria-hidden />
        {/* <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Pick a base design, then customise colours, collar, logo and player
          personalisation in the kit builder.
        </p> */}
      </div>

      <div className="mt-8">
        <ProductsBrowser products={PRODUCTS} categories={CATEGORIES} />
      </div>
    </div>
  );
}
