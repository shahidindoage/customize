"use client";

import { ChevronRight, Eye, ShoppingBag, RefreshCw } from "lucide-react";
import { useKitStore } from "@/lib/kit-store";
import { SPORT_CATEGORIES } from "@/lib/kit-data";
import { JerseyPreview } from "./jersey-preview";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function PreviewArea() {
  const activeCategory = useKitStore((s) => s.activeCategory);
  const activeDesignId = useKitStore((s) => s.activeDesignId);
  const view = useKitStore((s) => s.view);
  const setView = useKitStore((s) => s.setView);
  const colors = useKitStore((s) => s.colors);
  const playerName = useKitStore((s) => s.playerName);
  const playerNumber = useKitStore((s) => s.playerNumber);
  const collarStyle = useKitStore((s) => s.collarStyle);
  const logoEnabled = useKitStore((s) => s.logoEnabled);
  const logoX = useKitStore((s) => s.logoX);
  const logoY = useKitStore((s) => s.logoY);
  const logoScale = useKitStore((s) => s.logoScale);
  const logoUrl = useKitStore((s) => s.logoUrl);
  const setLogoPosition = useKitStore((s) => s.setLogoPosition);
  const addToBasket = useKitStore((s) => s.addToBasket);
  const resetKit = useKitStore((s) => s.resetKit);
  const { toast } = useToast();

  const activeCategoryObj = SPORT_CATEGORIES.find(
    (c) => c.id === activeCategory
  );

  const handleAddToBasket = () => {
    addToBasket();
    toast({
      title: "Added to basket",
      description: `${activeDesignId} custom jersey added to your basket.`,
    });
  };

  return (
    <section className="flex h-full flex-col bg-muted/30">
      {/* Top bar with breadcrumb + actions */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background px-5 py-3">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1 text-xs text-muted-foreground"
        >
          <span className="font-semibold text-foreground">Kit Builder</span>
          <ChevronRight className="h-3 w-3" />
          <span>{activeCategoryObj?.name ?? "—"}</span>
          <ChevronRight className="h-3 w-3" />
          <span>Playing Jerseys</span>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-foreground">
            Customise Design ({activeDesignId})
          </span>
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={resetKit}
            title="Reset all colours to default"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Reset
          </Button>

          <Button
            variant={view === "front" ? "default" : "outline"}
            size="sm"
            className="gap-1.5"
            onClick={() => setView("front")}
          >
            <Eye className="h-3.5 w-3.5" />
            Front
          </Button>
          <Button
            variant={view === "back" ? "default" : "outline"}
            size="sm"
            className="gap-1.5"
            onClick={() => setView("back")}
          >
            <Eye className="h-3.5 w-3.5" />
            View Back
          </Button>
        </div>
      </header>

      {/* Main canvas */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden p-6">
        {/* Decorative grid background */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Jersey preview */}
        <div className="relative z-10 flex w-full max-w-md flex-col items-center">
          <div className="mb-3 flex items-center gap-2 rounded-full bg-background px-3 py-1 shadow-sm border border-border">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-muted-foreground">
              {view === "front" ? "Front view" : "Back view"} • Model{" "}
              {activeDesignId}
            </span>
          </div>
          <div className="aspect-[456/547] w-full max-w-sm drop-shadow-2xl">
            <JerseyPreview
              view={view}
              colors={colors}
              playerName={playerName}
              playerNumber={playerNumber}
              collarStyle={collarStyle}
              logoEnabled={logoEnabled}
              logoX={logoX}
              logoY={logoY}
              logoScale={logoScale}
              logoUrl={logoUrl}
              onLogoMove={setLogoPosition}
              className="h-full w-full"
            />
          </div>
          <div className="mt-4 max-w-sm text-center">
            <p className="text-xs text-muted-foreground">
              Customise your kit with your team colours. Premium fabric,
              fully sublimated printing, and tailored service for your team.
            </p>
          </div>
        </div>

        {/* Quick add to basket button floating */}
        <Button
          onClick={handleAddToBasket}
          className="absolute bottom-4 right-4 gap-2 shadow-lg"
          size="sm"
        >
          <ShoppingBag className="h-4 w-4" />
          Add to Basket
        </Button>
      </div>
    </section>
  );
}
