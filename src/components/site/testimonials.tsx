"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PRODUCTS } from "@/lib/product";

const TESTIMONIALS = [
  {
    topic: "Process Simplicity",
    quote:
      "From customisation to final quantities, everything was streamlined with Kragbuzz. No unnecessary back-and-forth - just clarity and execution.",
    nps: "9/10",
    name: "Sunil Rawat",
    role: "Academy Coach, Delhi NCR",
    image: "/images/hero-banner.jpeg",
  },
  {
    topic: "Fabric Quality",
    quote:
      "The sublimation print hasn't faded after a full season of play. Colours stay sharp wash after wash - the kits look brand new on match day.",
    nps: "10/10",
    name: "Meera Nair",
    role: "Club Manager, Bengaluru",
    image: "/images/mega2.png",
  },
];

export function Testimonials() {
  const [index, setIndex] = React.useState(0);
  const t = TESTIMONIALS[index];
  const featured = PRODUCTS[0];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="flex items-center justify-between gap-6">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Testimonials
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
            }
            aria-label="Previous testimonial"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white transition-colors hover:bg-neutral-700"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button
            onClick={() => setIndex((i) => (i + 1) % TESTIMONIALS.length)}
            aria-label="Next testimonial"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white transition-colors hover:bg-neutral-700"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>

      <div className="mt-8 grid items-stretch gap-10 lg:grid-cols-2">
        {/* Photo with product chip overlay */}
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={t.image}
            alt={t.name}
            className="h-full min-h-[320px] w-full object-cover"
          />
          <Link
            href={`/customise/${featured.slug}`}
            className="absolute bottom-5 left-5 flex items-center gap-3 rounded-lg bg-white/90 p-2.5 pr-5 shadow-lg backdrop-blur transition-colors hover:bg-white"
          >
            <img
              src={featured.productCard.front}
              alt={featured.name}
              className="h-12 w-12 rounded bg-white object-contain"
            />
            <span>
              <span className="block text-sm font-bold text-foreground">
                {featured.name}
              </span>
              <span className="block text-xs text-muted-foreground">
                Customize Now →
              </span>
            </span>
          </Link>
        </div>

        {/* Quote */}
        <div className="flex flex-col justify-center">
          <span
            aria-hidden
            className="text-6xl font-bold leading-none text-foreground/15"
          >
            “
          </span>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            When asked about:
          </p>
          <h3 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            {t.topic}
          </h3>
          <blockquote className="mt-4 text-base italic leading-relaxed text-muted-foreground">
            “{t.quote}”
          </blockquote>
          <p className="mt-5 text-sm font-bold text-foreground">
            NPS Equivalent: {t.nps}
          </p>
          <div className="mt-5 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600/10 text-sm font-bold text-red-700">
              {t.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
            <span>
              <span className="block text-sm font-bold">{t.name}</span>
              <span className="block text-sm text-muted-foreground">
                {t.role}
              </span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
