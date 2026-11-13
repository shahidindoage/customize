"use client";

import * as React from "react";
import { Check, ChevronDown, Info } from "lucide-react";
import { useKitStore } from "@/lib/kit-store";
import {
  COLLAR_STYLES,
  COLOR_PALETTE,
  COLOR_SLOTS,
  VIEW_LAYERS,
  getHexByCode,
  getColorName,
  type ColorSlotKey,
} from "@/lib/kit-data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ColorPickerProps = {
  slotKey: ColorSlotKey;
  label: string;
  description: string;
  value: string;
  onChange: (code: string) => void;
  active: boolean;
};

function ColorPicker({
  slotKey,
  label,
  description,
  value,
  onChange,
  active,
}: ColorPickerProps) {
  const [open, setOpen] = React.useState(false);
  const hex = getHexByCode(value);
  const colorName = getColorName(value);

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 py-2 transition-opacity",
        !active && "opacity-50"
      )}
    >
      <div className="min-w-0 flex-1">
        <Label className="text-sm font-medium flex items-center gap-1.5">
          {label}
          {!active && (
            <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-muted-foreground">
              pending
            </span>
          )}
        </Label>
        <p className="truncate text-[11px] text-muted-foreground">
          {description}
        </p>
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2 rounded-md border border-border bg-background px-2 py-1.5 text-xs hover:bg-accent transition-colors"
            aria-label={`Pick ${label}`}
          >
            <span
              className="h-5 w-5 rounded border border-border"
              style={{ backgroundColor: hex }}
            />
            <span className="font-medium">{colorName}</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" align="end">
          <div className="mb-2 text-xs font-semibold text-muted-foreground">
            {label}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {COLOR_PALETTE.map((c) => {
              const isSelected = c.code === value;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    onChange(c.code);
                    setOpen(false);
                  }}
                  className={cn(
                    "group relative flex flex-col items-center gap-1 rounded-md border p-1.5 transition-all hover:bg-accent",
                    isSelected
                      ? "border-primary ring-1 ring-primary"
                      : "border-border"
                  )}
                  title={`${c.name} ${c.code}`}
                  aria-label={`${c.name} ${c.code}`}
                >
                  <span
                    className="h-7 w-7 rounded border border-border"
                    style={{ backgroundColor: c.hex }}
                  />
                  <span className="text-[10px] font-medium">{c.code}</span>
                  {isSelected && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function CustomizationPanel() {
  const view = useKitStore((s) => s.view);
  const colors = useKitStore((s) => s.colors);
  const setColor = useKitStore((s) => s.setColor);
  const playerName = useKitStore((s) => s.playerName);
  const setPlayerName = useKitStore((s) => s.setPlayerName);
  const playerNumber = useKitStore((s) => s.playerNumber);
  const setPlayerNumber = useKitStore((s) => s.setPlayerNumber);
  const size = useKitStore((s) => s.size);
  const setSize = useKitStore((s) => s.setSize);
  const quantity = useKitStore((s) => s.quantity);
  const setQuantity = useKitStore((s) => s.setQuantity);
  const collarStyle = useKitStore((s) => s.collarStyle);
  const setCollarStyle = useKitStore((s) => s.setCollarStyle);
  const logoEnabled = useKitStore((s) => s.logoEnabled);
  const logoScale = useKitStore((s) => s.logoScale);
  const logoUrl = useKitStore((s) => s.logoUrl);
  const setLogoEnabled = useKitStore((s) => s.setLogoEnabled);
  const setLogoScale = useKitStore((s) => s.setLogoScale);
  const setLogoUrl = useKitStore((s) => s.setLogoUrl);
  const resetLogo = useKitStore((s) => s.resetLogo);
  const resetKit = useKitStore((s) => s.resetKit);

  const [logoUrlInput, setLogoUrlInput] = React.useState(logoUrl);

  React.useEffect(() => {
    setLogoUrlInput(logoUrl);
  }, [logoUrl]);

  const applyLogoUrl = () => setLogoUrl(logoUrlInput);

  // Compute which colour slots have a matching layer asset that is actually
  // available right now. A slot is "active" only if its layer either:
  //   - has a fallback asset (guaranteed to load), OR
  //   - has `available: true` set in the layer config (designer delivered the PNG).
  // Layers without either stay "pending" until the designer delivers the
  // matching PNG and the dev flips `available: true` in kit-data.ts.
  const activeSlots = React.useMemo<Set<ColorSlotKey>>(() => {
    const s = new Set<ColorSlotKey>();
    for (const layer of VIEW_LAYERS[view].layers) {
      if (layer.fallbackPath || layer.available) {
        s.add(layer.slot);
      }
    }
    // name/number is rendered programmatically on back view (always available)
    if (view === "back") s.add("nameNumber");
    return s;
  }, [view]);

  return (
    <aside className="flex h-full w-full flex-col border-l border-border bg-background">
      {/* Header */}
      <div className="border-b border-border px-5 py-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Step 2 of 3
        </div>
        <h2 className="text-base font-bold mt-1">Customise Design</h2>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          Customise your kit with your team colours here. Premium fabric,
          fully sublimated printing, and tailored service for your team.
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-5 py-4">
          {/* Info banner */}
          <div className="mb-4 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-900">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <p>
              Showing {activeSlots.size} colour slot{activeSlots.size > 1 ? "s" : ""} for the {view} view.
              Slots marked <span className="font-semibold">pending</span> will activate
              when the matching PNG layer is added to <code>/public/jersey/</code>.
            </p>
          </div>

          {/* Colours section */}
          <section>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Colours</h3>
              <button
                onClick={resetKit}
                className="text-[11px] text-muted-foreground hover:text-foreground hover:underline"
              >
                Reset
              </button>
            </div>
            <div className="divide-y divide-border">
              {COLOR_SLOTS.map((slot) => (
                <ColorPicker
                  key={slot.key}
                  slotKey={slot.key}
                  label={slot.label}
                  description={slot.description}
                  value={colors[slot.key]}
                  onChange={(code) => setColor(slot.key, code)}
                  active={activeSlots.has(slot.key)}
                />
              ))}
            </div>
          </section>

          {/* Collar style section */}
          <section className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Collar Style</h3>
              <span className="text-[11px] text-muted-foreground">
                {view === "front" ? "Front view" : "Applies to front"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {COLLAR_STYLES.map((style) => {
                const selected = collarStyle === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => setCollarStyle(style.id)}
                    aria-pressed={selected}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-md border p-2 text-center transition-colors hover:bg-accent",
                      selected
                        ? "border-primary ring-1 ring-primary"
                        : "border-border"
                    )}
                  >
                    <span
                      aria-hidden
                      className="h-14 w-16 rounded bg-muted/60"
                      style={{
                        backgroundImage: `url(${style.assetPath})`,
                        backgroundSize: "auto 150px",
                        backgroundPosition: "center top",
                        backgroundRepeat: "no-repeat",
                      }}
                    />
                    <span className="text-[11px] font-semibold leading-tight">
                      {style.name}
                    </span>
                    <span className="text-[10px] leading-tight text-muted-foreground">
                      {style.description}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
              Collar colour uses the <span className="font-semibold">Collar Colour</span> slot below.
            </p>
          </section>

          {/* Logo section */}
          <section className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Logo</h3>
              <span className="text-[11px] text-muted-foreground">
                Front view only
              </span>
            </div>
            <div className="rounded-md border border-border p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <Label className="text-sm">TYKA logo</Label>
                  <p className="text-[11px] text-muted-foreground">
                    Drag it on the jersey to reposition, or use the arrow keys.
                  </p>
                </div>
                <Button
                  variant={logoEnabled ? "default" : "outline"}
                  size="sm"
                  aria-pressed={logoEnabled}
                  onClick={() => setLogoEnabled(!logoEnabled)}
                >
                  {logoEnabled ? "On" : "Off"}
                </Button>
              </div>
              <div className="mt-3">
                <Label htmlFor="logo-url" className="text-xs">
                  Logo URL
                </Label>
                <div className="mt-1 flex gap-2">
                  <Input
                    id="logo-url"
                    value={logoUrlInput}
                    onChange={(e) => setLogoUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        applyLogoUrl();
                      }
                    }}
                    placeholder="https://example.com/logo.png"
                    className="h-8 text-xs"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 shrink-0"
                    onClick={applyLogoUrl}
                  >
                    Apply
                  </Button>
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  PNG, SVG or JPG URL. Leave blank to use the TYKA logo.
                </p>
              </div>
              <div
                className={cn(
                  "mt-3",
                  !logoEnabled && "pointer-events-none opacity-50"
                )}
              >
                <div className="flex items-center justify-between">
                  <Label htmlFor="logo-size" className="text-xs">
                    Size
                  </Label>
                  <span className="text-[11px] text-muted-foreground">
                    {logoScale}%
                  </span>
                </div>
                <input
                  id="logo-size"
                  type="range"
                  min={6}
                  max={30}
                  step={1}
                  value={logoScale}
                  onChange={(e) => setLogoScale(Number(e.target.value))}
                  className="mt-1 w-full accent-primary"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-1 h-7 px-2 text-[11px]"
                  onClick={resetLogo}
                >
                  Reset logo position
                </Button>
              </div>
            </div>
          </section>

          {/* Personalisation section */}
          <section className="mt-6">
            <h3 className="mb-2 text-sm font-semibold">Personalisation</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label htmlFor="player-name" className="text-xs">
                  Player Name (back)
                </Label>
                <Input
                  id="player-name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="e.g. SMITH"
                  maxLength={14}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="player-number" className="text-xs">
                  Number
                </Label>
                <Input
                  id="player-number"
                  value={playerNumber}
                  onChange={(e) => setPlayerNumber(e.target.value)}
                  placeholder="10"
                  maxLength={3}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="size" className="text-xs">
                  Size
                </Label>
                <Select value={size} onValueChange={setSize}>
                  <SelectTrigger id="size" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["XS", "S", "M", "L", "XL", "XXL"].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="quantity" className="text-xs">
                  Quantity
                </Label>
                <div className="mt-1 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    –
                  </Button>
                  <Input
                    id="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(parseInt(e.target.value) || 1)
                    }
                    className="w-20 text-center"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </ScrollArea>

      {/* Footer with Next button */}
      <div className="border-t border-border p-4">
        <Button className="w-full" size="lg">
          Next
        </Button>
        <p className="mt-2 text-center text-[10px] text-muted-foreground">
          Free design proof • No setup fees • 2-3 week delivery
        </p>
      </div>
    </aside>
  );
}
