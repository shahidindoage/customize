"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { useKitStore } from "@/lib/kit-store";
import {
  COLOR_PALETTE,
  COLOR_SLOTS,
  getHexByCode,
  getColorName,
  type ColorSlotKey,
} from "@/lib/kit-data";
import type { BuilderConfig } from "@/lib/builder-config";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { JerseyPreview } from "./jersey-preview";

type ColorPickerProps = {
  label: string;
  description: string;
  value: string;
  onChange: (code: string) => void;
};

function ColorPicker({
  label,
  description,
  value,
  onChange,
}: ColorPickerProps) {
  const [open, setOpen] = React.useState(false);
  const hex = getHexByCode(value);
  const colorName = getColorName(value);

  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="min-w-0 flex-1">
        <Label className="text-sm font-medium">{label}</Label>
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

// Accordion section trigger: title + optional right-side hint.
function SectionTrigger({
  title,
  hint,
}: {
  title: string;
  hint?: string;
}) {
  return (
    <span className="flex w-full items-center justify-between gap-3">
      <span>{title}</span>
      {hint && (
        <span className="text-[10px] font-normal text-muted-foreground">
          {hint}
        </span>
      )}
    </span>
  );
}

const TRIGGER_CLASS = "py-3.5 text-sm font-semibold hover:no-underline";

export function CustomizationPanel({ config }: { config: BuilderConfig }) {
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
  const logoX = useKitStore((s) => s.logoX);
  const logoY = useKitStore((s) => s.logoY);
  const logoScale = useKitStore((s) => s.logoScale);
  const logoUrl = useKitStore((s) => s.logoUrl);
  const setLogoEnabled = useKitStore((s) => s.setLogoEnabled);
  const setLogoScale = useKitStore((s) => s.setLogoScale);
  const setLogoUrl = useKitStore((s) => s.setLogoUrl);
  const resetLogo = useKitStore((s) => s.resetLogo);
  const printEnabled = useKitStore((s) => s.printEnabled);
  const printX = useKitStore((s) => s.printX);
  const printY = useKitStore((s) => s.printY);
  const setPrintEnabled = useKitStore((s) => s.setPrintEnabled);
  const resetKit = useKitStore((s) => s.resetKit);

  // Panel flow: step 1 = customise, step 2 = review design + enquiry form.
  const [step, setStep] = React.useState<1 | 2>(1);
  const [submitted, setSubmitted] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", email: "", phone: "", message: "" });

  const [logoUrlInput, setLogoUrlInput] = React.useState(logoUrl);

  React.useEffect(() => {
    setLogoUrlInput(logoUrl);
  }, [logoUrl]);

  const applyLogoUrl = () => setLogoUrl(logoUrlInput);

  // Compute which colour slots have a matching layer asset that is actually
  // available right now. A slot is "active" only if its layer either:
  //   - has a fallback asset (guaranteed to load), OR
  //   - has `available: true` set in the product's builder config.
  // Layers without either stay "pending" until the designer delivers the
  // matching PNG and the dev flips `available: true` in builder-config.ts.
  const activeSlots = React.useMemo<Set<ColorSlotKey>>(() => {
    const s = new Set<ColorSlotKey>();
    for (const layer of config.views[view].layers) {
      if (layer.fallbackPath || layer.available) {
        s.add(layer.slot);
      }
    }
    // name/number is rendered programmatically on back view (always available)
    if (view === "back") s.add("nameNumber");
    return s;
  }, [config, view]);

  return (
    <aside className="flex h-full w-full flex-col border-l border-border bg-background">
      {/* Header */}
      <div className="border-b border-border px-5 py-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {step === 1 ? "Step 1 of 2" : "Step 2 of 2 - Final Step"}
        </div>
        <h2 className="text-base font-bold mt-1">
          {step === 1 ? "Customise Design" : "Review & Submit"}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          {step === 1
            ? "Customise your kit with your team colours here. Premium fabric, fully sublimated printing, and tailored service for your team."
            : "Check your design below, then send us your details. We'll reply with a free design proof."}
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-4 py-3 sm:px-5 sm:py-4">
          {step === 1 ? (
          <Accordion type="multiple" defaultValue={[]}>
            {/* ============ Colours ============ */}
            <AccordionItem value="colours">
              <AccordionTrigger className={TRIGGER_CLASS}>
                <span className="flex w-full items-center justify-between gap-3">
                  <span>Colours</span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      resetKit();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        resetKit();
                      }
                    }}
                    className="text-[11px] font-normal text-muted-foreground hover:text-foreground hover:underline"
                  >
                    Reset
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pt-0 pb-3">
                <div className="divide-y divide-border">
                  {/* Only slots with an available layer asset for this view */}
                  {COLOR_SLOTS.filter((slot) => activeSlots.has(slot.key)).map(
                    (slot) => (
                      <ColorPicker
                        key={slot.key}
                        label={slot.label}
                        description={slot.description}
                        value={colors?.[slot.key] ?? "01"}
                        onChange={(code) => setColor(slot.key, code)}
                      />
                    )
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* ============ Collar Style ============ */}
            <AccordionItem value="collar">
              <AccordionTrigger className={TRIGGER_CLASS}>
                <SectionTrigger
                  title="Collar Style"
                  hint={view === "front" ? "Front view" : "Applies to front"}
                />
              </AccordionTrigger>
              <AccordionContent className="pt-0 pb-3">
                <div className="grid grid-cols-2 gap-2">
                  {config.collarStyles.map((style) => {
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
                          className="h-14 w-16 rounded bg-[#C4C4C4]"
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
                  Collar colour uses the <span className="font-semibold">Collar Colour</span> slot in Colours.
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* ============ Logo ============ */}
            <AccordionItem value="logo">
              <AccordionTrigger className={TRIGGER_CLASS}>
                <SectionTrigger title="Logo" hint="Front view only" />
              </AccordionTrigger>
              <AccordionContent className="pt-0 pb-3">
                <div className="rounded-md border border-border p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <Label className="text-sm">Kragbuzz logo</Label>
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
                      PNG, SVG or JPG URL. Leave blank to use the default logo.
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
              </AccordionContent>
            </AccordionItem>

            {/* ============ Personalisation ============ */}
            <AccordionItem value="personalisation">
              <AccordionTrigger className={TRIGGER_CLASS}>
                <SectionTrigger title="Personalisation" />
              </AccordionTrigger>
              <AccordionContent className="pt-0 pb-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 flex items-center justify-between gap-3 rounded-md border border-border p-2.5">
                    <div className="min-w-0">
                      <Label className="text-sm">Name &amp; Number</Label>
                      <p className="text-[11px] text-muted-foreground">
                        Show on back view
                      </p>
                    </div>
                    <Button
                      variant={printEnabled ? "default" : "outline"}
                      size="sm"
                      aria-pressed={printEnabled}
                      onClick={() => setPrintEnabled(!printEnabled)}
                    >
                      {printEnabled ? "On" : "Off"}
                    </Button>
                  </div>
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          ) : (
            /* ============ Step 2: review design + enquiry form ============ */
            <div className="flex flex-col gap-4">
              {/* Design previews: front + back */}
              <div className="grid grid-cols-2 gap-3">
                {(["front", "back"] as const).map((v) => (
                  <div key={v} className="flex flex-col items-center gap-1.5">
                    <div className="w-full overflow-hidden rounded-lg border border-border bg-white">
                      <div className="aspect-[456/547] w-full">
                        <JerseyPreview
                          config={config}
                          view={v}
                          colors={colors ?? config.defaultColors}
                          playerName={playerName}
                          playerNumber={playerNumber}
                          collarStyle={collarStyle}
                          logoEnabled={logoEnabled}
                          logoX={logoX}
                          logoY={logoY}
                          logoScale={logoScale}
                          logoUrl={logoUrl}
                          printEnabled={printEnabled}
                          printX={printX}
                          printY={printY}
                          downloadName={`${config.productId}-${v}.png`}
                          className="h-full w-full"
                        />
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {v === "front" ? "Front" : "Back"}
                    </span>
                  </div>
                ))}
              </div>

              {submitted ? (
                /* Dummy submit success state */
                <div className="flex flex-col items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-center">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white">
                    <Check className="h-5 w-5" />
                  </span>
                  <p className="text-sm font-semibold text-emerald-900">
                    Design submitted!
                  </p>
                  <p className="text-xs leading-relaxed text-emerald-800">
                    Thanks {form.name || "there"} - our team will contact you
                    within 24 hours with your free design proof.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-1"
                    onClick={() => {
                      setSubmitted(false);
                      setForm({ name: "", email: "", phone: "", message: "" });
                      setStep(1);
                    }}
                  >
                    Make another design
                  </Button>
                </div>
              ) : (
                /* Enquiry form - dummy submit */
                <form
                  className="flex flex-col gap-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true); // dummy - no backend yet
                  }}
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <Label htmlFor="f-name" className="text-xs">
                        Name
                      </Label>
                      <Input
                        id="f-name"
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        placeholder="Your full name"
                        className="mt-1"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="f-email" className="text-xs">
                        Email
                      </Label>
                      <Input
                        id="f-email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        placeholder="you@example.com"
                        className="mt-1"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="f-phone" className="text-xs">
                        Phone
                      </Label>
                      <Input
                        id="f-phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        placeholder="+91 ..."
                        className="mt-1"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="f-msg" className="text-xs">
                        Message
                      </Label>
                      <textarea
                        id="f-msg"
                        rows={3}
                        value={form.message}
                        onChange={(e) =>
                          setForm({ ...form, message: e.target.value })
                        }
                        placeholder="Team name, quantities, delivery date..."
                        className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    Submit Design
                  </Button>
                  <p className="text-center text-[10px] text-muted-foreground">
                    Free design proof • No setup fees • 2–3 week delivery
                  </p>
                </form>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-border p-4">
        {step === 1 ? (
          <Button className="w-full" size="lg" onClick={() => setStep(2)}>
            Next
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-full"
            size="lg"
            onClick={() => setStep(1)}
          >
            Back to Design
          </Button>
        )}
      </div>
    </aside>
  );
}
