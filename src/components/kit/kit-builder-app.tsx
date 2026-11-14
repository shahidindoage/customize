"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Palette, Sparkles, X } from "lucide-react";
import { Sidebar } from "@/components/kit/sidebar";
import { PreviewArea } from "@/components/kit/preview-area";
import { CustomizationPanel } from "@/components/kit/customization-panel";
import type { BuilderConfig } from "@/lib/builder-config";
import type { Product } from "@/lib/product";
import { useKitStore } from "@/lib/kit-store";
import { Button } from "@/components/ui/button";

type KitBuilderAppProps = {
  product: Product;
  config: BuilderConfig;
};

/**
 * Full-screen customiser rendered as the product page for products that have
 * a BuilderConfig. Applies the product's config to the store on mount.
 */
export function KitBuilderApp({ product, config }: KitBuilderAppProps) {
  // Mobile drawer state for sidebar + panel
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [panelOpen, setPanelOpen] = React.useState(false);

  const initForProduct = useKitStore((s) => s.initForProduct);
  const setCategory = useKitStore((s) => s.setCategory);
  React.useEffect(() => {
    initForProduct(config);
    setCategory(product.category);
  }, [config, product.category, initForProduct, setCategory]);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background">
      {/* Mobile/tablet top bar */}
      <header className="flex items-center justify-between border-b border-border bg-background px-4 py-2 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open categories"
        >
          <Menu className="h-15 w-15" />
        </Button>
        <Link href="/" aria-label="Back to home" className="flex items-center">
          <img
            src="/images/logo.png"
            alt="Kragbuzz - Play In Style"
            className="h-12 w-auto"
          />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setPanelOpen(true)}
          aria-label="Open customisation"
        >
          <Palette className="h-15 w-15" />
        </Button>
      </header>

      {/* Desktop three-column layout */}
      <div className="hidden lg:flex h-full min-h-0">
        <div className="w-56 xl:w-64 shrink-0">
          <Sidebar />
        </div>
        <div className="flex-1 min-w-0">
          <PreviewArea config={config} />
        </div>
        <div className="w-[320px] xl:w-[380px] shrink-0">
          <CustomizationPanel config={config} />
        </div>
      </div>

      {/* Mobile/tablet main content */}
      <main className="lg:hidden flex-1 min-h-0 overflow-y-auto">
        <PreviewArea config={config} />
      </main>

      {/* Mobile/tablet sidebar drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-72 max-w-[80%] h-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-10"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </Button>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Mobile/tablet customization drawer */}
      {panelOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setPanelOpen(false)}
          />
          <div className="relative w-[88%] max-w-sm h-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-10"
              onClick={() => setPanelOpen(false)}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </Button>
            <CustomizationPanel config={config} />
          </div>
        </div>
      )}
    </div>
  );
}
