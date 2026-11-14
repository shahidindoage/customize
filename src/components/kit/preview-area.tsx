"use client";

import * as React from "react";
import { ChevronRight, Eye, RefreshCw, ZoomIn, ZoomOut } from "lucide-react";
import { useKitStore } from "@/lib/kit-store";
import { getCategoryName } from "@/lib/product";
import type { BuilderConfig } from "@/lib/builder-config";
import { JerseyPreview } from "./jersey-preview";
import { Button } from "@/components/ui/button";

// Zoom levels: 100% base, then +10, +15, +25, +25, +25 → up to 200%
const ZOOM_LEVELS = [1, 1.1, 1.25, 1.5, 1.75, 2];

export function PreviewArea({ config }: { config: BuilderConfig }) {
  // Preview zoom. The whole canvas area pans when zoomed in.
  const [zoomIndex, setZoomIndex] = React.useState(0);
  const zoom = ZOOM_LEVELS[zoomIndex];
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
  const printX = useKitStore((s) => s.printX);
  const printY = useKitStore((s) => s.printY);
  const printEnabled = useKitStore((s) => s.printEnabled);
  const setPrintPosition = useKitStore((s) => s.setPrintPosition);
  const resetKit = useKitStore((s) => s.resetKit);

  const activeCategoryName = getCategoryName(activeCategory);

  return (
    <section className="flex h-full flex-col bg-muted/30">
      {/* Top bar with breadcrumb + actions */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background px-5 py-3">
        <nav
          aria-label="Breadcrumb"
          className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground"
        >
          <span className="font-semibold text-foreground">KragBuzz Customisation</span>
          <ChevronRight className="h-3 w-3" />
          <span>{activeCategoryName}</span>
          {/* <ChevronRight className="h-3 w-3" />
          <span>Playing Jerseys</span> */}
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
      <div className="relative flex flex-1 flex-col overflow-hidden">
        {/* Decorative grid background (fixed, does not scroll with zoom) */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* View badge - fixed above the zoom area */}
        <div className="relative z-10 flex justify-center pt-4">
          <div className="flex items-center gap-2 rounded-full bg-background px-3 py-1 shadow-sm border border-border">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-muted-foreground">
              {view === "front" ? "Front view" : "Back view"} • Model{" "}
              {activeDesignId}
            </span>
          </div>
        </div>

        {/* Zoomable canvas - fills the whole area, pannable when zoomed.
            Scrollbar hidden; pan with wheel/touch still works. */}
        <div className="relative z-10 flex-1 overflow-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-h-full min-w-full items-center justify-center p-6">
            <div
              className="aspect-[456/547] drop-shadow-2xl"
              style={{ width: `calc(${zoom} * min(100%, 28rem))` }}
            >
              <JerseyPreview
                config={config}
                view={view}
                colors={colors ?? config.defaultColors}
                playerName={playerName}
                playerNumber={playerNumber}
                collarStyle={collarStyle}
                logoEnabled={logoEnabled}
                logoX={logoX}
                logoY={logoY}
                logoScale={logoScale}
                logoUrl={logoUrl}
                onLogoMove={setLogoPosition}
                printX={printX}
                printY={printY}
                printEnabled={printEnabled}
                onPrintMove={setPrintPosition}
                className="h-full w-full"
              />
            </div>
          </div>
        </div>

        {/* Caption - fixed below the zoom area */}
        {/* <div className="relative z-10 flex justify-center px-6 pb-4">
          <p className="max-w-sm text-center text-xs text-muted-foreground">
            Customise your kit with your team colours. Premium fabric,
            fully sublimated printing, and tailored service for your team.
          </p>
        </div> */}

        {/* Zoom controls - fixed at the right edge of the whole area */}
        <div className="absolute right-4 top-1/2 z-30 hidden sm:flex -translate-y-1/2 flex-col items-center gap-1.5">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full border-border bg-background shadow-sm"
                onClick={() =>
                  setZoomIndex((i) =>
                    Math.min(ZOOM_LEVELS.length - 1, i + 1)
                  )
                }
                disabled={zoomIndex >= ZOOM_LEVELS.length - 1}
                aria-label="Zoom in"
              >
                <ZoomIn className="h-4 w-4" aria-hidden />
              </Button>
              <span className="rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-semibold text-muted-foreground shadow-sm">
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full border-border bg-background shadow-sm"
                onClick={() => setZoomIndex((i) => Math.max(0, i - 1))}
                disabled={zoomIndex <= 0}
                aria-label="Zoom out"
              >
                <ZoomOut className="h-4 w-4" aria-hidden />
              </Button>
        </div>
      </div>
    </section>
  );
}
