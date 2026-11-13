import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import { PRODUCTS, type Product } from "@/lib/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Products — TYKA Kit Builder",
  description:
    "Browse ready-to-customise sports jerseys from TYKA and design your own kit.",
};

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="grid grid-cols-2 gap-px border-b border-border bg-border">
        <div className="relative flex aspect-[456/547] items-center justify-center bg-white p-2">
          <img
            src={product.images.front}
            alt={`${product.name} front view`}
            className="h-full w-full object-contain"
          />
          <span className="absolute left-2 top-2 rounded bg-background/90 px-1.5 py-0.5 text-[10px] font-medium">
            Front
          </span>
        </div>
        <div className="relative flex aspect-[456/547] items-center justify-center bg-white p-2">
          <img
            src={product.images.back}
            alt={`${product.name} back view`}
            className="h-full w-full object-contain"
          />
          <span className="absolute left-2 top-2 rounded bg-background/90 px-1.5 py-0.5 text-[10px] font-medium">
            Back
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary">{product.category}</Badge>
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            {product.designId}
          </span>
        </div>

        <h2 className="mt-2 text-base font-bold">{product.name}</h2>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {product.description}
        </p>

        <ul className="mt-3 flex flex-col gap-1.5">
          {product.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-1.5 text-[11px] text-muted-foreground"
            >
              <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-600" />
              {feature}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
          <span className="text-[11px] text-muted-foreground">
            Fully customisable
          </span>
          {product.price && (
            <span className="text-sm font-semibold">{product.price}</span>
          )}
        </div>

        <Button asChild className="mt-3 w-full gap-1.5">
          <Link href="/">
            Customize
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </article>
  );
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-lg font-black text-primary-foreground">
              T
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-extrabold tracking-tight">
                TYKA
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Kit Builder
              </span>
            </div>
          </Link>

          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link href="/">
              Open Kit Builder
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-8 max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Catalogue
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Products
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Pick a base design, then customise colours, collar, logo and player
            personalisation in the kit builder.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}
