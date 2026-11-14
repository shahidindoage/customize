import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS, getProductBySlug } from "@/lib/product";
import { getBuilderConfig } from "@/lib/builder-config";
import { KitBuilderApp } from "@/components/kit/kit-builder-app";
import { ProductDetail } from "@/components/site/product-detail";

type Params = { slug: string };

// Pre-render every product page at build time
export function generateStaticParams(): Params[] {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: `${product.name} - Customise Your Kit`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  // Products with a builder config get the full-screen customiser as their
  // product page; others fall back to a plain detail page.
  const config = getBuilderConfig(product.id);
  if (config) {
    // key forces a clean remount when switching products client-side, so the
    // store re-initialises with THIS product's default colours/config.
    return <KitBuilderApp key={product.id} product={product} config={config} />;
  }
  return <ProductDetail product={product} />;
}
