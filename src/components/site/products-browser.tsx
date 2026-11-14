"use client";

import * as React from "react";
import Link from "next/link";
import { Check, SlidersHorizontal } from "lucide-react";

import { getBuilderConfig } from "@/lib/builder-config";
import { type Product, type ProductCategory } from "@/lib/product";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

function ProductCard({ product }: { product: Product }) {
  const hasBuilder = getBuilderConfig(product.id) !== undefined;
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:border-red-200 hover:shadow-lg">
      {/* Card image - front by default; hover shows the back view, slightly
          enlarged. Uses the product's dedicated productCard assets. */}
      <Link
        href={`/customise/${product.slug}`}
        aria-label={`View ${product.name}`}
        className="group/img block overflow-hidden bg-neutral-100 p-2"
      >
        <div className="relative aspect-square w-full">
          <img
            src={product.productCard.front}
            alt={`${product.name} front`}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = product.images.front;
            }}
            className="absolute inset-0 h-full w-full object-contain transition-all duration-300 group-hover/img:scale-105 group-hover/img:opacity-0"
          />
          <img
            src={product.productCard.back}
            alt={`${product.name} back`}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = product.images.back;
            }}
            className="absolute inset-0 h-full w-full object-contain opacity-0 transition-all duration-300 group-hover/img:scale-105 group-hover/img:opacity-100"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <h2 className="text-lg font-bold uppercase tracking-wide text-red-700">
          <Link
            href={`/customise/${product.slug}`}
            className="transition-colors hover:text-red-600"
          >
            {product.name}
          </Link>
        </h2>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-foreground/80">
          {product.description}
        </p>
        {/* <p className="mt-1.5 truncate text-xs text-muted-foreground">
          {product.features[0]}
        </p> */}
        {product.minPrice && product.maxPrice ? (
          <p className="mt-2 text-base font-bold">
            {product.minPrice} - {product.maxPrice}
          </p>
        ) : product.price ? (
          <p className="mt-2 text-base font-bold">{product.price}</p>
        ) : null}

        {/* Kragbuzz logo colours: black button */}
        <Button
          asChild
          className="mt-3 h-11 w-full text-xs font-semibold uppercase tracking-[0.14em] bg-neutral-900 text-white hover:bg-neutral-800"
        >
          <Link href={`/customise/${product.slug}`}>
            {hasBuilder ? "Customise Now" : "View Product"}
          </Link>
        </Button>
      </div>
    </article>
  );
}

export function ProductsBrowser({
  products,
  categories,
}: {
  products: Product[];
  categories: ProductCategory[];
}) {
  const [selected, setSelected] = React.useState<string>("all");
  const [filterOpen, setFilterOpen] = React.useState(false);

  const visible =
    selected === "all"
      ? products
      : products.filter((p) => p.category === selected);

  const pickAndClose = (id: string) => {
    setSelected(id);
    setFilterOpen(false);
  };

  const activeName =
    selected === "all"
      ? null
      : (categories.find((c) => c.id === selected)?.name ?? null);

  return (
    <div className="grid gap-8 lg:grid-cols-[230px_1fr]">
      {/* Category filter rail - desktop only */}
      <aside className="hidden lg:sticky lg:top-32 lg:block lg:self-start">
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Categories
        </h3>
        <nav
          aria-label="Product categories"
          className="mt-4 flex flex-col gap-1"
        >
          {[{ id: "all", name: "All Custom sportswear" }, ...categories].map(
            (cat) => {
              const isActive = selected === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelected(cat.id)}
                  className={cn(
                    "inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-neutral-900 font-medium text-white"
                      : "text-foreground/80 hover:text-red-700 lg:rounded-none lg:border-b lg:border-border lg:px-1"
                  )}
                >
                  {isActive && <Check className="h-3.5 w-3.5" aria-hidden />}
                  {cat.name}
                </button>
              );
            }
          )}
        </nav>
      </aside>

      {/* Products */}
      <div>
        {/* Mobile filter bar - opens the category drawer from the left */}
        <div className="mb-4 flex items-center gap-3 lg:hidden">
          <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" aria-hidden />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 overflow-y-auto p-0">
              <SheetHeader className="border-b border-border p-4 text-left">
                <SheetTitle>Categories</SheetTitle>
              </SheetHeader>
              <nav
                aria-label="Product categories"
                className="flex flex-col gap-1 p-3"
              >
                {[{ id: "all", name: "All Custom sportswear" }, ...categories].map(
                  (cat) => {
                    const isActive = selected === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => pickAndClose(cat.id)}
                        className={cn(
                          "inline-flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-sm transition-colors",
                          isActive
                            ? "bg-neutral-900 font-medium text-white"
                            : "text-foreground/80 hover:text-red-700"
                        )}
                      >
                        {isActive && (
                          <Check className="h-3.5 w-3.5" aria-hidden />
                        )}
                        {cat.name}
                      </button>
                    );
                  }
                )}
              </nav>
            </SheetContent>
          </Sheet>
          {activeName && (
            <span className="text-xs text-muted-foreground">
              Showing:{" "}
              <span className="font-semibold text-foreground">{activeName}</span>
            </span>
          )}
        </div>

        {visible.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No products in this category yet.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
