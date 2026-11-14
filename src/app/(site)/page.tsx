import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Camera,
  Check,
  Package,
  PenTool,
  Ruler,
  Shirt,
  Truck,
} from "lucide-react";
import { getCustomisableProduct } from "@/lib/product";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Testimonials } from "@/components/site/testimonials";

export const metadata: Metadata = {
  title: "Kragbuzz - Custom Sportswear & Kit Builder",
  description:
    "Design custom team kits for your club, school or academy. Pick your colours, collar style, logo, names and numbers in the Kragbuzz Kit Builder.",
};

const STEPS = [
  {
    label: "Select",
    title: "Choose Your Product",
    line1: "Browse jerseys, tees and full team kits.",
    line2: "Built for competitive play",
  },
  {
    label: "Design Your Way",
    title: "Build It or Bring It",
    line1: "Design from scratch in the live Kit Builder.",
    line2: "OR upload your design",
  },
  {
    label: "Deliver",
    title: "Ready to ship in 15–18 days",
    line1: "Manufactured and shipped pan-India.",
    line2: "Free design proof included",
  },
];

const GUARANTEES = [
  "Inclusive sizing (Youth – 4XL)",
  "Full design freedom",
  "Repeat-order ready",
  "Sharp logos. Clean finish.",
];

const FEATURE_STRIP = [
  {
    icon: Ruler,
    title: "Inclusive Sizing",
    text: "Designed to fit every athlete. Men, Women & Youth (XS–4XL)",
  },
  {
    icon: PenTool,
    title: "Live Kit Builder",
    text: "Full design freedom with real-time digital preview",
  },
  {
    icon: Package,
    title: "Repeat-Order Ready",
    text: "Your custom design stays saved for quick reorders",
  },
  {
    icon: Truck,
    title: "15–18 Days Delivery",
    text: "Fast turnaround with end-to-end tracking",
  },
];

const customisable = getCustomisableProduct();
const customiseHref = 
 "/custom-sportswear";

export default function HomePage() {
  return (
    <>
      {/* ============ Hero - jersey wall + configuration bar ============ */}
      <section className="relative h-[82vh] min-h-[600px] max-h-[860px] overflow-hidden">
        <img
          src="/images/hero-banner.jpeg"
          alt="Custom sublimated jerseys lined up on a stadium pitch"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/40 to-transparent"
        />

        {/* Configuration bar */}
        <div className="absolute inset-x-0 bottom-8 z-10 px-4">
          <div className="mx-auto max-w-5xl rounded-2xl bg-black/60 p-5 shadow-2xl backdrop-blur-md sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1.1fr_1fr_1fr_auto] lg:items-end">
              {/* Segment */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-white/90">
                  Segment
                </label>
                <div className="flex h-11 items-center gap-2.5 rounded-lg bg-white px-3.5">
                  <Camera
                    className="h-4 w-4 shrink-0 text-neutral-500"
                    aria-hidden
                  />
                  <span className="truncate text-sm font-medium text-neutral-800">
                    Custom Sportswear
                  </span>
                </div>
              </div>
              {/* Sport */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-white/90">
                  Sport
                </label>
                <Select defaultValue="">
                  <SelectTrigger
                    aria-label="Select sport"
                    className="h-11 w-full rounded-lg border-0 bg-white px-3.5 text-sm font-medium text-neutral-800 shadow-none focus:ring-0"
                  >
                    <SelectValue placeholder="Select Sport" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    <SelectItem value="cricket">Cricket</SelectItem>
                    <SelectItem value="football">Football</SelectItem>
                    <SelectItem value="basketball">Basketball</SelectItem>
                    <SelectItem value="tennis">Tennis</SelectItem>
                    <SelectItem value="badminton">Badminton</SelectItem>
                    <SelectItem value="pickleball">Pickleball</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Apparel */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-white/90">
                  Apparel Type
                </label>
                <Select defaultValue="">
                  <SelectTrigger
                    aria-label="Select apparel"
                    className="h-11 w-full rounded-lg border-0 bg-white px-3.5 text-sm font-medium text-neutral-800 shadow-none focus:ring-0"
                  >
                    <Shirt
                      className="h-4 w-4 shrink-0 text-neutral-500"
                      aria-hidden
                    />
                    <SelectValue placeholder="Select Apparel" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    <SelectItem value="playing-jersey">
                      Playing Jersey
                    </SelectItem>
                    <SelectItem value="training-jersey">
                      Training Jersey
                    </SelectItem>
                    <SelectItem value="t-shirt">T-Shirt</SelectItem>
                    <SelectItem value="polo">Polo</SelectItem>
                    <SelectItem value="hoodie">Hoodie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* CTA */}
              <Button
                asChild
                className="h-11 gap-2 bg-red-600 px-6 text-white hover:bg-red-700"
              >
                <Link href={customiseHref}>Customize Now</Link>
              </Button>
            </div>

            <p className="hidden sm:block mt-4 flex items-center gap-2 text-sm text-white/90">
              {/* <BadgeCheck className="h-4 w-4 shrink-0" aria-hidden /> */}
              Approve your design today – we manufacture and ship globally in
              15–18 days.
            </p>
          </div>
        </div>
      </section>

      {/* ============ How Customization Works ============ */}
      <section className="relative overflow-hidden bg-muted/40 py-20">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-red-600">
              The Process
            </p>
            <h2 className="mt-3 text-4xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-5xl">
              How Customization Works
            </h2>
            <div
              className="mx-auto mt-5 h-1 w-16 rounded-full bg-red-600"
              aria-hidden
            />
            <p className="mt-5 text-sm text-muted-foreground sm:text-base">
              A simple 3-step process - designed by you, made by us.
            </p>
          </div>

          <div className="mt-12 flex flex-col gap-6 lg:flex-row lg:items-stretch">
            {STEPS.map((step, i) => (
              <Fragment key={step.label}>
                {i > 0 && (
                  <div aria-hidden className="hidden items-center lg:flex">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-red-600/30 bg-red-50">
                      <ArrowRight
                        className="h-4 w-4 text-red-600"
                        aria-hidden
                      />
                    </span>
                  </div>
                )}
                <div className="group relative flex-1 overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:-translate-y-1 hover:border-red-300 hover:shadow-lg">
                  <span
                    aria-hidden
                    className="font-display pointer-events-none absolute -right-2 -top-7 select-none text-[110px] font-extrabold leading-none text-neutral-900/5"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="relative inline-block rounded-full bg-red-600/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-red-600">
                    {step.label}
                  </span>
                  <h3 className="relative mt-4 text-2xl font-bold">
                    {step.title}
                  </h3>
                  <p className="relative mt-3 text-sm text-muted-foreground">
                    {step.line1}
                  </p>
                  <p className="relative mt-1.5 text-sm text-muted-foreground/80">
                    {step.line2}
                  </p>
                 
                </div>
              </Fragment>
            ))}
          </div>

          {/* Guarantees */}
          <div className="mt-16 text-center">
            <span className="inline-block rounded-full bg-background px-4 py-1.5 text-sm font-semibold tracking-wide text-foreground shadow-sm">
              Guarantees
            </span>
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {GUARANTEES.map((g) => (
                <li
                  key={g}
                  className="flex items-center gap-2 text-sm text-foreground/80"
                >
                  <Check className="h-4 w-4 text-red-600" aria-hidden />
                  {g}
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Button
                asChild
                className="h-11 bg-red-600 px-7 text-white hover:bg-red-700"
              >
                <Link href={customiseHref}>Customize Now</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-11 border-border px-7 font-semibold text-foreground hover:border-red-600 hover:text-red-600"
              >
                <Link href={customiseHref}>
                  Upload Your Design
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ Testimonials ============ */}
      {/* <Testimonials /> */}

      {/* ============ Feature strip ============ */}
      {/* <section className="border-t border-border">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {FEATURE_STRIP.map((f) => (
            <div key={f.title} className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border bg-background">
                <f.icon className="h-5 w-5 text-foreground" aria-hidden />
              </span>
              <span>
                <span className="block text-base font-bold">{f.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                  {f.text}
                </span>
              </span>
            </div>
          ))}
        </div>
      </section> */}
    </>
  );
}
