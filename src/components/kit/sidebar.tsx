"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Circle,
  CircleDot,
  Dumbbell,
  Shield,
  SunMedium,
  Shirt,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { CATEGORIES, PRODUCTS } from "@/lib/product";
import { useKitStore } from "@/lib/kit-store";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const ICONS: Record<string, LucideIcon> = {
  Shirt,
  Circle,
  CircleDot,
  Shield,
  SunMedium,
  Dumbbell,
};

export function Sidebar() {
  const pathname = usePathname();
  const setCategory = useKitStore((s) => s.setCategory);

  // Dropdown state: categories expand to reveal their products.
  // All start collapsed; click a category to open it.
  const [openCategories, setOpenCategories] = React.useState<Set<string>>(
    () => new Set()
  );

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <aside className="flex h-full w-full flex-col border-r border-border bg-sidebar">
      {/* Brand */}
      <Link
        href="/"
        aria-label="Back to home"
        className="flex items-center gap-2 px-5 py-4 border-b border-sidebar-border transition-opacity hover:opacity-80"
      >
        <img
          src="/images/logo.png"
          alt="Kragbuzz - Play In Style"
          className="h-10 w-auto"
        />
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          KragBuzz Customisation
        </span>
      </Link>

      {/* Category → product dropdowns */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Categories
          </div>
          {CATEGORIES.map((cat) => {
            const Icon = ICONS[cat.icon] ?? Circle;
            const products = PRODUCTS.filter((p) => p.category === cat.id);
            const isOpen = openCategories.has(cat.id);
            return (
              <div key={cat.id} className="flex flex-col">
                <button
                  onClick={() => toggleCategory(cat.id)}
                  aria-expanded={isOpen}
                  className="group flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <Icon
                    className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-sidebar-accent-foreground"
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1 truncate text-left">
                    {cat.name}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform",
                      isOpen && "rotate-180"
                    )}
                    aria-hidden
                  />
                </button>

                {isOpen && (
                  <div className="mb-1 ml-9 mr-1 flex flex-col gap-0.5">
                    {products.length === 0 ? (
                      <p className="px-2 py-1.5 text-[11px] text-muted-foreground">
                        No products yet
                      </p>
                    ) : (
                      products.map((product) => {
                        const href = `/customise/${product.slug}`;
                        const isActive = pathname === href;
                        return (
                          <Link
                            key={product.id}
                            href={href}
                            onClick={() => setCategory(cat.id)}
                            className={cn(
                              "flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-[13px] transition-colors",
                              "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                              isActive
                                ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                                : "text-muted-foreground"
                            )}
                          >
                            <span className="truncate">{product.name}</span>
                            <span
                              className={cn(
                                "shrink-0 text-[10px] tabular-nums",
                                isActive
                                  ? "text-primary-foreground/70"
                                  : "text-muted-foreground/70"
                              )}
                            >
                              {product.designId}
                            </span>
                          </Link>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
}
