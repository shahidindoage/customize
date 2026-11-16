// Per-product kit-builder configuration.
//
// Every customisable product owns:
//   1. an asset folder:  /public/products/<slug>/  holding ALL of its layer
//      images (body, sleeves, collars, cuffs, default chest logo, ...).
//   2. a BuilderConfig entry in BUILDER_CONFIGS below, keyed by the product
//      id, mapping those files to colour slots and defining the defaults.
//
// To make a NEW product customisable:
//   1. Create /public/products/<slug>/ and drop in its layer images.
//   2. Add a matching entry in BUILDER_CONFIGS.
//
// Products WITHOUT a config fall back to a plain detail page — no builder.

import type { CollarStyle, ColorSlotKey, KitView, LayerDef } from "./kit-data";

export type BuilderConfig = {
  productId: string;
  assetsBase: string; // e.g. "/products/sublimated-pro-jersey"
  views: Record<KitView, { layers: LayerDef[] }>;
  collarStyles: CollarStyle[];
  defaultCollarStyle: string;
  defaultColors: Record<ColorSlotKey, string>;
  defaultLogo: {
    enabled: boolean;
    x: number; // % of canvas width
    y: number; // % of canvas height
    scale: number; // % of canvas width
    url: string;
  };
  // Back-view name/number block anchor (% of canvas) — number centre.
  defaultPrint: { enabled: boolean; x: number; y: number };
};

// === CR2000 — Sublimated Pro Jersey ===
const CR2000_ASSETS = "/products/sublimated-pro-jersey";
const CR2100_ASSETS = "/products/sublimated-pro-jersey";
const CR2150_ASSETS = "/products/sublimated-pro-jersey";

const CR2300_ASSETS = "/products/classic-jersey";
const CR2350_ASSETS = "/products/classic-jersey";
const CR2400_ASSETS = "/products/classic-jersey";
const CR2700_ASSETS = "/products/jersey-3";

const cr2000Asset = (name: string) => `${CR2000_ASSETS}/${name}`;
const cr2100Asset = (name: string) => `${CR2100_ASSETS}/${name}`;
const cr2150Asset = (name: string) => `${CR2150_ASSETS}/${name}`;
const cr2300Asset = (name: string) => `${CR2300_ASSETS}/${name}`;
const cr2350Asset = (name: string) => `${CR2350_ASSETS}/${name}`;
const cr2400Asset = (name: string) => `${CR2400_ASSETS}/${name}`;
const cr2700Asset = (name: string) => `${CR2700_ASSETS}/${name}`;

export const BUILDER_CONFIGS: Record<string, BuilderConfig> = {
  CR2000: {
    productId: "CR2000",
    assetsBase: CR2000_ASSETS,
    views: {
      front: {
        // Layers stack bottom-up by `order` and are recoloured per slot.
        // Design patterns print on the fabric: above the body, below the
        // sleeves/collar overlays.
        layers: [
          {
            slot: "base",
            assetPath: cr2000Asset("front-body.png"),
            fallbackPath: cr2000Asset("front-base.webp"),
            available: true,
            order: 0,
            label: "Body",
          },
          {
            slot: "design1",
            assetPath: cr2000Asset("front-design-1.png"),
            available: true,
            order: 1,
            label: "Design 1",
          },
          {
            slot: "design2",
            assetPath: cr2000Asset("front-design-2.png"),
            available: true,
            order: 2,
            label: "Design 2",
          },
          {
            slot: "sleeves",
            assetPath: cr2000Asset("front-sleeves.png"),
            available: true,
            order: 3,
            label: "Sleeves",
          },
          {
            slot: "collarColour",
            // Front collar asset is resolved per selected style — see resolveCollarAsset().
            // The ring's inner hole is painted flat grey by the renderer
            // (paintCollarHole) so the in-between-collar area stays grey.
            assetPath: cr2000Asset("front-collar-1.png"),
            available: true,
            order: 4,
            label: "Collar",
          },
          {
            slot: "sleevesBottom",
            assetPath: cr2000Asset("front-cuffs.png"),
            order: 5,
            label: "Cuffs",
          },
        ],
      },
      back: {
        layers: [
          {
            slot: "base",
            assetPath: cr2000Asset("back-body.png"),
            fallbackPath: cr2000Asset("back-base.webp"),
            available: true,
            order: 0,
            label: "Body",
          },
          {
            slot: "sleeves",
            assetPath: cr2000Asset("back-sleeves.png"),
            available: true,
            order: 1,
            label: "Sleeves",
          },
          {
            slot: "collarColour",
            assetPath: cr2000Asset("back-collar.png"),
            available: true,
            order: 2,
            label: "Collar",
          },
          {
            slot: "sleevesBottom",
            assetPath: cr2000Asset("back-cuffs.png"),
            order: 3,
            label: "Cuffs",
          },
        ],
      },
    },
    collarStyles: [
      {
        id: "polo",
        name: "Polo Collar",
        description: "Classic buttoned placket neckline",
        assetPath: cr2000Asset("front-collar-1.png"),
      },
      {
        id: "crew",
        name: "Crew Neck",
        description: "Close-fitting round neckline",
        assetPath: cr2000Asset("front-collar-2.png"),
      },
    ],
    defaultCollarStyle: "polo",
    defaultColors: {
      base: "01", // Red
      sleeves: "03", // Red
      sleevesBottom: "02", // Black
      design1: "01", // White
      design2: "02", // Black
      nameNumber: "02", // Black
      collarColour: "02", // Black
    },
    defaultLogo: {
      enabled: true,
      x: 35,
      y: 22,
      scale: 12,
      url: "/images/logo.png", // Kragbuzz brand logo
    },
    defaultPrint: { enabled: true, x: 50, y: 45 },
  },
  CR2100: {
    productId: "CR2100",
    assetsBase: CR2100_ASSETS,
    views: {
      front: {
        // Layers stack bottom-up by `order` and are recoloured per slot.
        // Design patterns print on the fabric: above the body, below the
        // sleeves/collar overlays.
        layers: [
          {
            slot: "base",
            assetPath: cr2100Asset("front-body.png"),
            fallbackPath: cr2100Asset("front-base.webp"),
            available: true,
            order: 0,
            label: "Body",
          },
          {
            slot: "design1",
            assetPath: cr2100Asset("front-design-1.png"),
            available: true,
            order: 1,
            label: "Design 1",
          },
          {
            slot: "design2",
            assetPath: cr2100Asset("front-design-2.png"),
            available: true,
            order: 2,
            label: "Design 2",
          },
          {
            slot: "sleeves",
            assetPath: cr2100Asset("front-sleeves.png"),
            available: true,
            order: 3,
            label: "Sleeves",
          },
          {
            slot: "collarColour",
            // Front collar asset is resolved per selected style — see resolveCollarAsset().
            // The ring's inner hole is painted flat grey by the renderer
            // (paintCollarHole) so the in-between-collar area stays grey.
            assetPath: cr2100Asset("front-collar-1.png"),
            available: true,
            order: 4,
            label: "Collar",
          },
          {
            slot: "sleevesBottom",
            assetPath: cr2100Asset("front-cuffs.png"),
            order: 5,
            label: "Cuffs",
          },
        ],
      },
      back: {
        layers: [
          {
            slot: "base",
            assetPath: cr2100Asset("back-body.png"),
            fallbackPath: cr2100Asset("back-base.webp"),
            available: true,
            order: 0,
            label: "Body",
          },
          {
            slot: "sleeves",
            assetPath: cr2100Asset("back-sleeves.png"),
            available: true,
            order: 1,
            label: "Sleeves",
          },
          {
            slot: "collarColour",
            assetPath: cr2100Asset("back-collar.png"),
            available: true,
            order: 2,
            label: "Collar",
          },
          {
            slot: "sleevesBottom",
            assetPath: cr2100Asset("back-cuffs.png"),
            order: 3,
            label: "Cuffs",
          },
        ],
      },
    },
    collarStyles: [
      {
        id: "polo",
        name: "Polo Collar",
        description: "Classic buttoned placket neckline",
        assetPath: cr2100Asset("front-collar-1.png"),
      },
      {
        id: "crew",
        name: "Crew Neck",
        description: "Close-fitting round neckline",
        assetPath: cr2100Asset("front-collar-2.png"),
      },
    ],
    defaultCollarStyle: "polo",
    defaultColors: {
      base: "10", // Red
      sleeves: "06", // Red
      sleevesBottom: "02", // Black
      design1: "01", // White
      design2: "06", // Black
      nameNumber: "01", // Black
      collarColour: "02", // Black
    },
    defaultLogo: {
      enabled: true,
      x: 35,
      y: 22,
      scale: 12,
      url: "/images/logo.png", // Kragbuzz brand logo
    },
    defaultPrint: { enabled: true, x: 50, y: 45 },
  },
   CR2150: {
    productId: "CR2150",
    assetsBase: CR2150_ASSETS,
    views: {
      front: {
        // Layers stack bottom-up by `order` and are recoloured per slot.
        // Design patterns print on the fabric: above the body, below the
        // sleeves/collar overlays.
        layers: [
          {
            slot: "base",
            assetPath: cr2150Asset("front-body.png"),
            fallbackPath: cr2150Asset("front-base.webp"),
            available: true,
            order: 0,
            label: "Body",
          },
          {
            slot: "design1",
            assetPath: cr2150Asset("front-design-1.png"),
            available: true,
            order: 1,
            label: "Design 1",
          },
          {
            slot: "design2",
            assetPath: cr2150Asset("front-design-2.png"),
            available: true,
            order: 2,
            label: "Design 2",
          },
          {
            slot: "sleeves",
            assetPath: cr2150Asset("front-sleeves.png"),
            available: true,
            order: 3,
            label: "Sleeves",
          },
          {
            slot: "collarColour",
            // Front collar asset is resolved per selected style — see resolveCollarAsset().
            // The ring's inner hole is painted flat grey by the renderer
            // (paintCollarHole) so the in-between-collar area stays grey.
            assetPath: cr2150Asset("front-collar-1.png"),
            available: true,
            order: 4,
            label: "Collar",
          },
          {
            slot: "sleevesBottom",
            assetPath: cr2150Asset("front-cuffs.png"),
            order: 5,
            label: "Cuffs",
          },
        ],
      },
      back: {
        layers: [
          {
            slot: "base",
            assetPath: cr2150Asset("back-body.png"),
            fallbackPath: cr2150Asset("back-base.webp"),
            available: true,
            order: 0,
            label: "Body",
          },
          {
            slot: "sleeves",
            assetPath: cr2150Asset("back-sleeves.png"),
            available: true,
            order: 1,
            label: "Sleeves",
          },
          {
            slot: "collarColour",
            assetPath: cr2150Asset("back-collar.png"),
            available: true,
            order: 2,
            label: "Collar",
          },
          {
            slot: "sleevesBottom",
            assetPath: cr2150Asset("back-cuffs.png"),
            order: 3,
            label: "Cuffs",
          },
        ],
      },
    },
    collarStyles: [
      {
        id: "polo",
        name: "Polo Collar",
        description: "Classic buttoned placket neckline",
        assetPath: cr2150Asset("front-collar-1.png"),
      },
      {
        id: "crew",
        name: "Crew Neck",
        description: "Close-fitting round neckline",
        assetPath: cr2150Asset("front-collar-2.png"),
      },
    ],
    defaultCollarStyle: "polo",
    defaultColors: {
      base: "04", // Red
      sleeves: "13", // Red
      sleevesBottom: "02", // Black
      design1: "14", // White
      design2: "13", // Black
      nameNumber: "14", // Black
      collarColour: "13", // Black
    },
    defaultLogo: {
      enabled: true,
      x: 35,
      y: 22,
      scale: 12,
      url: "/images/logo.png", // Kragbuzz brand logo
    },
    defaultPrint: { enabled: true, x: 50, y: 45 },
  },
  CR2300: {
    productId: "CR2300",
    assetsBase: CR2300_ASSETS,
    views: {
      front: {
        // Layers stack bottom-up by `order` and are recoloured per slot.
        // Design patterns print on the fabric: above the body, below the
        // sleeves/collar overlays.
        layers: [
          {
            slot: "base",
            assetPath: cr2300Asset("front-body.png"),
            fallbackPath: cr2300Asset("front-base.webp"),
            available: true,
            order: 0,
            label: "Body",
          },
          {
            slot: "design1",
            assetPath: cr2300Asset("front-design-1.png"),
            available: true,
            order: 1,
            label: "Design 1",
          },
          {
            slot: "design2",
            assetPath: cr2300Asset("front-design-2.png"),
            available: true,
            order: 2,
            label: "Design 2",
          },
          {
            slot: "sleeves",
            assetPath: cr2300Asset("front-sleeves.png"),
            available: true,
            order: 3,
            label: "Sleeves",
          },
          {
            slot: "collarColour",
            // Front collar asset is resolved per selected style — see resolveCollarAsset().
            // The ring's inner hole is painted flat grey by the renderer
            // (paintCollarHole) so the in-between-collar area stays grey.
            assetPath: cr2300Asset("front-collar-1.png"),
            available: true,
            order: 4,
            label: "Collar",
          },
          {
            slot: "sleevesBottom",
            assetPath: cr2300Asset("front-cuffs.png"),
            order: 5,
            label: "Cuffs",
          },
        ],
      },
      back: {
        layers: [
          {
            slot: "base",
            assetPath: cr2300Asset("back-body.png"),
            fallbackPath: cr2300Asset("back-base.webp"),
            available: true,
            order: 0,
            label: "Body",
          },
          {
            slot: "sleeves",
            assetPath: cr2300Asset("back-sleeves.png"),
            available: true,
            order: 1,
            label: "Sleeves",
          },
          {
            slot: "collarColour",
            assetPath: cr2300Asset("back-collar.png"),
            available: true,
            order: 2,
            label: "Collar",
          },
          {
            slot: "sleevesBottom",
            assetPath: cr2300Asset("back-cuffs.png"),
            order: 3,
            label: "Cuffs",
          },
        ],
      },
    },
    collarStyles: [
      {
        id: "polo",
        name: "Polo Collar",
        description: "Classic buttoned placket neckline",
        assetPath: cr2300Asset("front-collar-1.png"),
      },
      {
        id: "crew",
        name: "Crew Neck",
        description: "Close-fitting round neckline",
        assetPath: cr2300Asset("front-collar-2.png"),
      },
    ],
    defaultCollarStyle: "polo",
    defaultColors: {
      base: "03", // Red
      sleeves: "06", // Red
      sleevesBottom: "02", // Black
      design1: "09", // White
      design2: "06", // Black
      nameNumber: "01", // Black
      collarColour: "09", // Black
    },
    defaultLogo: {
      enabled: true,
      x: 35,
      y: 22,
      scale: 12,
      url: "/images/logo.png", // Kragbuzz brand logo
    },
    defaultPrint: { enabled: true, x: 50, y: 45 },
  },
  CR2350: {
    productId: "CR2350",
    assetsBase: CR2350_ASSETS,
    views: {
      front: {
        // Layers stack bottom-up by `order` and are recoloured per slot.
        // Design patterns print on the fabric: above the body, below the
        // sleeves/collar overlays.
        layers: [
          {
            slot: "base",
            assetPath: cr2350Asset("front-body.png"),
            fallbackPath: cr2350Asset("front-base.webp"),
            available: true,
            order: 0,
            label: "Body",
          },
          {
            slot: "design1",
            assetPath: cr2350Asset("front-design-1.png"),
            available: true,
            order: 1,
            label: "Design 1",
          },
          {
            slot: "design2",
            assetPath: cr2350Asset("front-design-2.png"),
            available: true,
            order: 2,
            label: "Design 2",
          },
          {
            slot: "sleeves",
            assetPath: cr2350Asset("front-sleeves.png"),
            available: true,
            order: 3,
            label: "Sleeves",
          },
          {
            slot: "collarColour",
            // Front collar asset is resolved per selected style — see resolveCollarAsset().
            // The ring's inner hole is painted flat grey by the renderer
            // (paintCollarHole) so the in-between-collar area stays grey.
            assetPath: cr2350Asset("front-collar-1.png"),
            available: true,
            order: 4,
            label: "Collar",
          },
          {
            slot: "sleevesBottom",
            assetPath: cr2350Asset("front-cuffs.png"),
            order: 5,
            label: "Cuffs",
          },
        ],
      },
      back: {
        layers: [
          {
            slot: "base",
            assetPath: cr2350Asset("back-body.png"),
            fallbackPath: cr2350Asset("back-base.webp"),
            available: true,
            order: 0,
            label: "Body",
          },
          {
            slot: "sleeves",
            assetPath: cr2350Asset("back-sleeves.png"),
            available: true,
            order: 1,
            label: "Sleeves",
          },
          {
            slot: "collarColour",
            assetPath: cr2350Asset("back-collar.png"),
            available: true,
            order: 2,
            label: "Collar",
          },
          {
            slot: "sleevesBottom",
            assetPath: cr2350Asset("back-cuffs.png"),
            order: 3,
            label: "Cuffs",
          },
        ],
      },
    },
    collarStyles: [
      {
        id: "polo",
        name: "Polo Collar",
        description: "Classic buttoned placket neckline",
        assetPath: cr2350Asset("front-collar-1.png"),
      },
      {
        id: "crew",
        name: "Crew Neck",
        description: "Close-fitting round neckline",
        assetPath: cr2350Asset("front-collar-2.png"),
      },
    ],
    defaultCollarStyle: "polo",
    defaultColors: {
      base: "10", // Red
      sleeves: "06", // Red
      sleevesBottom: "02", // Black
      design1: "01", // White
      design2: "06", // Black
      nameNumber: "02", // Black
      collarColour: "02", // Black
    },
    defaultLogo: {
      enabled: true,
      x: 35,
      y: 22,
      scale: 12,
      url: "/images/logo.png", // Kragbuzz brand logo
    },
    defaultPrint: { enabled: true, x: 50, y: 45 },
  },
  CR2400: {
    productId: "CR2400",
    assetsBase: CR2400_ASSETS,
    views: {
      front: {
        // Layers stack bottom-up by `order` and are recoloured per slot.
        // Design patterns print on the fabric: above the body, below the
        // sleeves/collar overlays.
        layers: [
          {
            slot: "base",
            assetPath: cr2400Asset("front-body.png"),
            fallbackPath: cr2400Asset("front-base.webp"),
            available: true,
            order: 0,
            label: "Body",
          },
          {
            slot: "design1",
            assetPath: cr2400Asset("front-design-1.png"),
            available: true,
            order: 1,
            label: "Design 1",
          },
          {
            slot: "design2",
            assetPath: cr2400Asset("front-design-2.png"),
            available: true,
            order: 2,
            label: "Design 2",
          },
          {
            slot: "sleeves",
            assetPath: cr2400Asset("front-sleeves.png"),
            available: true,
            order: 3,
            label: "Sleeves",
          },
          {
            slot: "collarColour",
            // Front collar asset is resolved per selected style — see resolveCollarAsset().
            // The ring's inner hole is painted flat grey by the renderer
            // (paintCollarHole) so the in-between-collar area stays grey.
            assetPath: cr2400Asset("front-collar-1.png"),
            available: true,
            order: 4,
            label: "Collar",
          },
          {
            slot: "sleevesBottom",
            assetPath: cr2400Asset("front-cuffs.png"),
            order: 5,
            label: "Cuffs",
          },
        ],
      },
      back: {
        layers: [
          {
            slot: "base",
            assetPath: cr2400Asset("back-body.png"),
            fallbackPath: cr2400Asset("back-base.webp"),
            available: true,
            order: 0,
            label: "Body",
          },
          {
            slot: "sleeves",
            assetPath: cr2400Asset("back-sleeves.png"),
            available: true,
            order: 1,
            label: "Sleeves",
          },
          {
            slot: "collarColour",
            assetPath: cr2400Asset("back-collar.png"),
            available: true,
            order: 2,
            label: "Collar",
          },
          {
            slot: "sleevesBottom",
            assetPath: cr2400Asset("back-cuffs.png"),
            order: 3,
            label: "Cuffs",
          },
        ],
      },
    },
    collarStyles: [
      {
        id: "polo",
        name: "Polo Collar",
        description: "Classic buttoned placket neckline",
        assetPath: cr2400Asset("front-collar-1.png"),
      },
      {
        id: "crew",
        name: "Crew Neck",
        description: "Close-fitting round neckline",
        assetPath: cr2400Asset("front-collar-2.png"),
      },
    ],
    defaultCollarStyle: "polo",
    defaultColors: {
      base: "08", // Red
      sleeves: "04", // Red
      sleevesBottom: "02", // Black
      design1: "01", // White
      design2: "07", // Black
      nameNumber: "01", // Black
      collarColour: "04", // Black
    },
    defaultLogo: {
      enabled: true,
      x: 35,
      y: 22,
      scale: 12,
      url: "/images/logo.png", // Kragbuzz brand logo
    },
    defaultPrint: { enabled: true, x: 50, y: 45 },
  },
  CR2700: {
    productId: "CR2700",
    assetsBase: CR2700_ASSETS,
    views: {
      front: {
        // Layers stack bottom-up by `order` and are recoloured per slot.
        // Design patterns print on the fabric: above the body, below the
        // sleeves/collar overlays.
        layers: [
          {
            slot: "base",
            assetPath: cr2700Asset("front-body.png"),
            fallbackPath: cr2700Asset("front-base.webp"),
            available: true,
            order: 0,
            label: "Body",
          },
          {
            slot: "design1",
            assetPath: cr2700Asset("front-design-1.png"),
            available: true,
            order: 1,
            label: "Design 1",
          },
          {
            slot: "design2",
            assetPath: cr2700Asset("front-design-2.png"),
            available: true,
            order: 2,
            label: "Design 2",
          },
          {
            slot: "sleeves",
            assetPath: cr2700Asset("front-sleeves.png"),
            available: true,
            order: 3,
            label: "Sleeves",
          },
          {
            slot: "collarColour",
            // Front collar asset is resolved per selected style — see resolveCollarAsset().
            // The ring's inner hole is painted flat grey by the renderer
            // (paintCollarHole) so the in-between-collar area stays grey.
            assetPath: cr2700Asset("front-collar-1.png"),
            available: true,
            order: 4,
            label: "Collar",
          },
          {
            slot: "sleevesBottom",
            assetPath: cr2700Asset("front-cuffs.png"),
            order: 5,
            label: "Cuffs",
          },
        ],
      },
      back: {
        layers: [
          {
            slot: "base",
            assetPath: cr2700Asset("back-body.png"),
            fallbackPath: cr2700Asset("back-base.webp"),
            available: true,
            order: 0,
            label: "Body",
          },
          {
            slot: "sleeves",
            assetPath: cr2700Asset("back-sleeves.png"),
            available: true,
            order: 1,
            label: "Sleeves",
          },
          {
            slot: "collarColour",
            assetPath: cr2700Asset("back-collar.png"),
            available: true,
            order: 2,
            label: "Collar",
          },
          {
            slot: "sleevesBottom",
            assetPath: cr2700Asset("back-cuffs.png"),
            order: 3,
            label: "Cuffs",
          },
        ],
      },
    },
    collarStyles: [
      {
        id: "polo",
        name: "Polo Collar",
        description: "Classic buttoned placket neckline",
        assetPath: cr2700Asset("front-collar-1.png"),
      },
      {
        id: "crew",
        name: "Crew Neck",
        description: "Close-fitting round neckline",
        assetPath: cr2700Asset("front-collar-2.png"),
      },
    ],
    defaultCollarStyle: "polo",
    defaultColors: {
      base: "15", // Red
      sleeves: "12", // Red
      sleevesBottom: "02", // Black
      design1: "02", // White
      design2: "05", // Black
      nameNumber: "02", // Black
      collarColour: "12", // Black
    },
    defaultLogo: {
      enabled: true,
      x: 35,
      y: 22,
      scale: 12,
      url: "/images/logo.png", // Kragbuzz brand logo
    },
    defaultPrint: { enabled: true, x: 50, y: 45 },
  },
   CR2800: {
    productId: "CR2800",
    assetsBase: CR2700_ASSETS,
    views: {
      front: {
        // Layers stack bottom-up by `order` and are recoloured per slot.
        // Design patterns print on the fabric: above the body, below the
        // sleeves/collar overlays.
        layers: [
          {
            slot: "base",
            assetPath: cr2700Asset("front-body.png"),
            fallbackPath: cr2700Asset("front-base.webp"),
            available: true,
            order: 0,
            label: "Body",
          },
          {
            slot: "design1",
            assetPath: cr2700Asset("front-design-1.png"),
            available: true,
            order: 1,
            label: "Design 1",
          },
          {
            slot: "design2",
            assetPath: cr2700Asset("front-design-2.png"),
            available: true,
            order: 2,
            label: "Design 2",
          },
          {
            slot: "sleeves",
            assetPath: cr2700Asset("front-sleeves.png"),
            available: true,
            order: 3,
            label: "Sleeves",
          },
          {
            slot: "collarColour",
            // Front collar asset is resolved per selected style — see resolveCollarAsset().
            // The ring's inner hole is painted flat grey by the renderer
            // (paintCollarHole) so the in-between-collar area stays grey.
            assetPath: cr2700Asset("front-collar-1.png"),
            available: true,
            order: 4,
            label: "Collar",
          },
          {
            slot: "sleevesBottom",
            assetPath: cr2700Asset("front-cuffs.png"),
            order: 5,
            label: "Cuffs",
          },
        ],
      },
      back: {
        layers: [
          {
            slot: "base",
            assetPath: cr2700Asset("back-body.png"),
            fallbackPath: cr2700Asset("back-base.webp"),
            available: true,
            order: 0,
            label: "Body",
          },
          {
            slot: "sleeves",
            assetPath: cr2700Asset("back-sleeves.png"),
            available: true,
            order: 1,
            label: "Sleeves",
          },
          {
            slot: "collarColour",
            assetPath: cr2700Asset("back-collar.png"),
            available: true,
            order: 2,
            label: "Collar",
          },
          {
            slot: "sleevesBottom",
            assetPath: cr2700Asset("back-cuffs.png"),
            order: 3,
            label: "Cuffs",
          },
        ],
      },
    },
    collarStyles: [
      {
        id: "polo",
        name: "Polo Collar",
        description: "Classic buttoned placket neckline",
        assetPath: cr2700Asset("front-collar-1.png"),
      },
      {
        id: "crew",
        name: "Crew Neck",
        description: "Close-fitting round neckline",
        assetPath: cr2700Asset("front-collar-2.png"),
      },
    ],
    defaultCollarStyle: "polo",
    defaultColors: {
      base: "11", // Red
      sleeves: "04", // Red
      sleevesBottom: "02", // Black
      design1: "06", // White
      design2: "14", // Black
      nameNumber: "01", // Black
      collarColour: "04", // Black
    },
    defaultLogo: {
      enabled: true,
      x: 35,
      y: 22,
      scale: 12,
      url: "/images/logo.png", // Kragbuzz brand logo
    },
    defaultPrint: { enabled: true, x: 50, y: 45 },
  },
   CR2900: {
    productId: "CR2900",
    assetsBase: CR2700_ASSETS,
    views: {
      front: {
        // Layers stack bottom-up by `order` and are recoloured per slot.
        // Design patterns print on the fabric: above the body, below the
        // sleeves/collar overlays.
        layers: [
          {
            slot: "base",
            assetPath: cr2700Asset("front-body.png"),
            fallbackPath: cr2700Asset("front-base.webp"),
            available: true,
            order: 0,
            label: "Body",
          },
          {
            slot: "design1",
            assetPath: cr2700Asset("front-design-1.png"),
            available: true,
            order: 1,
            label: "Design 1",
          },
          {
            slot: "design2",
            assetPath: cr2700Asset("front-design-2.png"),
            available: true,
            order: 2,
            label: "Design 2",
          },
          {
            slot: "sleeves",
            assetPath: cr2700Asset("front-sleeves.png"),
            available: true,
            order: 3,
            label: "Sleeves",
          },
          {
            slot: "collarColour",
            // Front collar asset is resolved per selected style — see resolveCollarAsset().
            // The ring's inner hole is painted flat grey by the renderer
            // (paintCollarHole) so the in-between-collar area stays grey.
            assetPath: cr2700Asset("front-collar-1.png"),
            available: true,
            order: 4,
            label: "Collar",
          },
          {
            slot: "sleevesBottom",
            assetPath: cr2700Asset("front-cuffs.png"),
            order: 5,
            label: "Cuffs",
          },
        ],
      },
      back: {
        layers: [
          {
            slot: "base",
            assetPath: cr2700Asset("back-body.png"),
            fallbackPath: cr2700Asset("back-base.webp"),
            available: true,
            order: 0,
            label: "Body",
          },
          {
            slot: "sleeves",
            assetPath: cr2700Asset("back-sleeves.png"),
            available: true,
            order: 1,
            label: "Sleeves",
          },
          {
            slot: "collarColour",
            assetPath: cr2700Asset("back-collar.png"),
            available: true,
            order: 2,
            label: "Collar",
          },
          {
            slot: "sleevesBottom",
            assetPath: cr2700Asset("back-cuffs.png"),
            order: 3,
            label: "Cuffs",
          },
        ],
      },
    },
    collarStyles: [
      {
        id: "polo",
        name: "Polo Collar",
        description: "Classic buttoned placket neckline",
        assetPath: cr2700Asset("front-collar-1.png"),
      },
      {
        id: "crew",
        name: "Crew Neck",
        description: "Close-fitting round neckline",
        assetPath: cr2700Asset("front-collar-2.png"),
      },
    ],
    defaultCollarStyle: "polo",
    defaultColors: {
      base: "08", // Red
      sleeves: "03", // Red
      sleevesBottom: "02", // Black
      design1: "09", // White
      design2: "02", // Black
      nameNumber: "01", // Black
      collarColour: "09", // Black
    },
    defaultLogo: {
      enabled: true,
      x: 35,
      y: 22,
      scale: 12,
      url: "/images/logo.png", // Kragbuzz brand logo
    },
    defaultPrint: { enabled: true, x: 50, y: 45 },
  },
};

export const getBuilderConfig = (productId: string): BuilderConfig | undefined =>
  BUILDER_CONFIGS[productId];

// Front collar honours the selected style; back always uses its own layer.
export const resolveCollarAsset = (
  config: BuilderConfig,
  view: KitView,
  styleId: string
): string => {
  if (view === "front") {
    const style =
      config.collarStyles.find((c) => c.id === styleId) ?? config.collarStyles[0];
    return style.assetPath;
  }
  const layer = config.views.back.layers.find((l) => l.slot === "collarColour");
  return layer?.assetPath ?? "";
};
