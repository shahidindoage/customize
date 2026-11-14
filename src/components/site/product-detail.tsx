import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronRight,
  Ruler,
  Shirt,
} from "lucide-react";
import { getCategoryName, type Product } from "@/lib/product";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * Plain detail page for products that don't have a BuilderConfig yet.
 * Products WITH a config render the full-screen customiser instead
 * (see src/app/customise/[slug]/page.tsx).
 */
export function ProductDetail({ product }: { product: Product }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground"
          >
            <Link href="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" aria-hidden />
            <Link
              href="/custom-sportswear"
              className="transition-colors hover:text-foreground"
            >
              Products
            </Link>
            <ChevronRight className="h-3 w-3" aria-hidden />
            <span className="font-medium text-foreground">{product.name}</span>
          </nav>

          {/* Product */}
          <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
            {/* Images */}
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border">
              <div className="relative flex aspect-[456/547] items-center justify-center bg-white p-3">
                <img
                  src={product.images.front}
                  alt={`${product.name} front view`}
                  className="h-full w-full object-contain"
                />
                <span className="absolute left-2 top-2 rounded bg-background/90 px-1.5 py-0.5 text-[10px] font-medium">
                  Front
                </span>
              </div>
              <div className="relative flex aspect-[456/547] items-center justify-center bg-white p-3">
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

            {/* Details */}
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <Badge variant="secondary">
                  {getCategoryName(product.category)}
                </Badge>
                <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Design {product.designId}
                </span>
              </div>

              <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                {product.name}
              </h1>

              {product.price && (
                <p className="mt-3 text-xl font-semibold text-red-600">
                  From {product.price}
                  <span className="ml-2 align-middle text-[11px] font-normal text-muted-foreground">
                    per piece (custom quote for bulk)
                  </span>
                </p>
              )}

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {product.description}
              </p>

              <ul className="mt-5 flex flex-col gap-2">
                {product.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-foreground"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Perks */}
              <div className="mt-6 grid gap-3 rounded-xl border border-border bg-muted/40 p-4 sm:grid-cols-2">
                {[
                  { icon: BadgeCheck, text: "Free design proof before printing" },
                  { icon: Shirt, text: "Custom logo, names & numbers" },
                  { icon: Ruler, text: "Sizes XS to XXL" },
                  { icon: BadgeCheck, text: "No setup fees on any order" },
                ].map((perk) => (
                  <p
                    key={perk.text}
                    className="flex items-center gap-2 text-xs text-muted-foreground"
                  >
                    <perk.icon
                      className="h-4 w-4 shrink-0 text-red-600"
                      aria-hidden
                    />
                    {perk.text}
                  </p>
                ))}
              </div>

              {/* CTAs */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" className="gap-2" disabled>
                  Customisation coming soon
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/custom-sportswear">Back to Products</Link>
                </Button>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                The online customiser for this design is being prepared. Contact
                us to order {product.name} in the meantime.
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
