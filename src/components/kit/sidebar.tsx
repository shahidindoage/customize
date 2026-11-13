"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  Circle,
  CircleDot,
  Shield,
  Disc,
  SunMedium,
  Dumbbell,
  Shirt,
  Volleyball,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";
import { SPORT_CATEGORIES, getCollarStyle, getHexByCode } from "@/lib/kit-data";
import { useKitStore } from "@/lib/kit-store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

const ICONS: Record<string, LucideIcon> = {
  Sparkles,
  Circle,
  CircleDot,
  Shield,
  Disc,
  SunMedium,
  Dumbbell,
  Shirt,
  Volleyball,
};

export function Sidebar() {
  const activeCategory = useKitStore((s) => s.activeCategory);
  const setCategory = useKitStore((s) => s.setCategory);
  const basket = useKitStore((s) => s.basket);
  const removeFromBasket = useKitStore((s) => s.removeFromBasket);
  const clearBasket = useKitStore((s) => s.clearBasket);

  const basketCount = basket.reduce((acc, i) => acc + i.quantity, 0);
  const [open, setOpen] = React.useState(false);

  const handleCategoryClick = (id: string) => {
    setCategory(id);
  };

  return (
    <aside className="flex h-full w-full flex-col border-r border-border bg-sidebar">
      {/* Brand */}
      <Link
        href="/products"
        aria-label="View all products"
        className="flex items-center gap-2 px-5 py-5 border-b border-sidebar-border transition-opacity hover:opacity-80"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground font-black text-lg">
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

      {/* Category list */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Categories
          </div>
          {SPORT_CATEGORIES.map((cat) => {
            const Icon = ICONS[cat.icon] ?? Circle;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={cn(
                  "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive &&
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-sidebar-accent-foreground"
                  )}
                />
                <span className="flex-1 text-left">{cat.name}</span>
              </button>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Basket button */}
      <div className="border-t border-sidebar-border p-3">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button className="w-full justify-between" variant="default">
              <span className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                View Basket
              </span>
              {basketCount > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-primary-foreground text-primary"
                >
                  {basketCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Your Basket</SheetTitle>
              <p className="text-sm text-muted-foreground">
                {basketCount === 0
                  ? "Your basket is empty."
                  : `${basketCount} item${basketCount > 1 ? "s" : ""} ready to order.`}
              </p>
            </SheetHeader>

            {basket.length > 0 && (
              <div className="mt-4 flex flex-col gap-3">
                {basket.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-md border border-border p-3 bg-card"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="font-semibold text-sm">
                          {item.designName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.designId} • {getCollarStyle(item.collarStyle).name} • Size {item.size} • Qty {item.quantity}
                        </div>
                        {item.playerName && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {item.playerName} #{item.playerNumber}
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromBasket(item.id)}
                        className="text-xs text-destructive hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    {/* mini color swatches */}
                    <div className="mt-2 flex gap-1">
                      {Object.entries(item.colors).map(([k, code]) => {
                        const hex = getHexByCode(code);
                        return (
                          <div
                            key={k}
                            className="h-4 w-4 rounded-sm border border-border"
                            style={{ backgroundColor: hex }}
                            title={`${k}: ${code}`}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => clearBasket()}
                  className="mt-2"
                >
                  Clear basket
                </Button>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </aside>
  );
}
