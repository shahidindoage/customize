// Kit Builder data: colors, slots, layer asset configuration

export type ColorOption = {
  code: string; // e.g. "01", "02"
  name: string; // e.g. "White", "Black"
  hex: string;
};

// Color palette - mimics the TYKA palette with numeric codes
export const COLOR_PALETTE: ColorOption[] = [
  { code: "01", name: "White", hex: "#FFFFFF" },
  { code: "02", name: "Black", hex: "#1A1A1A" },
  { code: "03", name: "Red", hex: "#D32F2F" },
  { code: "04", name: "Navy", hex: "#1A237E" },
  { code: "05", name: "Royal", hex: "#1976D2" },
  { code: "06", name: "Yellow", hex: "#FBC02D" },
  { code: "07", name: "Green", hex: "#2E7D32" },
  { code: "08", name: "Orange", hex: "#EF6C00" },
  { code: "09", name: "Maroon", hex: "#6D1B1B" },
  { code: "10", name: "Grey", hex: "#616161" },
  { code: "11", name: "Purple", hex: "#6A1B9A" },
  { code: "12", name: "Sky", hex: "#29B6F6" },
  { code: "13", name: "Teal", hex: "#00897B" },
  { code: "14", name: "Pink", hex: "#E91E63" },
  { code: "15", name: "Gold", hex: "#C5A059" },
];

export const getHexByCode = (code: string): string => {
  const found = COLOR_PALETTE.find((c) => c.code === code);
  return found ? found.hex : "#FFFFFF";
};

export const getColorName = (code: string): string => {
  const found = COLOR_PALETTE.find((c) => c.code === code);
  return found ? `${found.name} ${found.code}` : `Colour ${code}`;
};

// === Layer asset configuration ===
// Each view is rendered as a stack of PNG layers.
// Layered PNGs (body.png, sleeves.png) will be provided by the designer.
// Until then, the flat `*-base.webp` photo is used as a fallback for the body,
// giving us a working single-color preview today.

export type ColorSlotKey =
  | "base"
  | "sleeves"
  | "sleevesBottom"
  | "design1"
  | "design2"
  | "nameNumber"
  | "collarColour";

export type ColorSlot = {
  key: ColorSlotKey;
  label: string;
  description: string;
};

// All slot definitions - we keep the full TYKA slot set in the data model.
// The UI shows only slots that have a matching layer in the current view.
export const COLOR_SLOTS: ColorSlot[] = [
  { key: "base", label: "Base Colour", description: "Main body fabric" },
  { key: "sleeves", label: "Sleeves Colour", description: "Sleeve fabric" },
  { key: "sleevesBottom", label: "Sleeves Bottom", description: "Sleeve cuff trim" },
  { key: "design1", label: "Design Colour 1", description: "Primary pattern colour" },
  { key: "design2", label: "Design Colour 2", description: "Secondary pattern colour" },
  { key: "nameNumber", label: "Name & Number", description: "Player print colour" },
  { key: "collarColour", label: "Collar Colour", description: "Collar fabric" },
];

export type KitView = "front" | "back";

export type LayerDef = {
  slot: ColorSlotKey; // which color slot drives this layer
  assetPath: string; // preferred asset path (layered PNG)
  fallbackPath?: string; // fallback asset (e.g. the flat base photo)
  available?: boolean; // set to true once the designer delivers this PNG
  order: number; // lower = drawn first (bottom)
  label: string; // for display/debug
};

export type ViewLayers = {
  view: KitView;
  layers: LayerDef[];
};

// Helper to build asset paths in /public/jersey/
const asset = (name: string) => `/jersey/${name}`;

export const VIEW_LAYERS: Record<KitView, ViewLayers> = {
  front: {
    view: "front",
    layers: [
      {
        slot: "base",
        assetPath: asset("front-body.png"),
        fallbackPath: asset("front-base.webp"),
        available: true,
        order: 0,
        label: "Body",
      },
      {
        slot: "sleeves",
        assetPath: asset("front-sleeves.png"),
        available: true,
        order: 1,
        label: "Sleeves",
      },
      {
        slot: "collarColour",
        assetPath: asset("front-collar-1.png"),
        available: true,
        order: 2,
        label: "Collar",
      },
      {
        slot: "sleevesBottom",
        assetPath: asset("front-cuffs.png"),
        order: 3,
        label: "Cuffs",
      },
    ],
  },
  back: {
    view: "back",
    layers: [
      {
        slot: "base",
        assetPath: asset("back-body.png"),
        fallbackPath: asset("back-base.webp"),
        available: true,
        order: 0,
        label: "Body",
      },
      {
        slot: "sleeves",
        assetPath: asset("back-sleeves.png"),
        available: true,
        order: 1,
        label: "Sleeves",
      },
      {
        slot: "collarColour",
        assetPath: asset("back-collar.png"),
        available: true,
        order: 2,
        label: "Collar",
      },
      {
        slot: "sleevesBottom",
        assetPath: asset("back-cuffs.png"),
        order: 3,
        label: "Cuffs",
      },
    ],
  },
};

// Default kit colours - matches the TYKA red jersey screenshot
export const DEFAULT_KIT_COLORS: Record<ColorSlotKey, string> = {
  base: "03", // Red
  sleeves: "03", // Red
  sleevesBottom: "02", // Black
  design1: "01", // White
  design2: "02", // Black
  nameNumber: "02", // Black
  collarColour: "02", // Black
};

// === Sport categories (kept from earlier for the sidebar) ===
export type SportCategory = {
  id: string;
  name: string;
  icon: string;
};

export const SPORT_CATEGORIES: SportCategory[] = [
  { id: "sublimated", name: "Sublimated 2.0", icon: "Sparkles" },
  { id: "football", name: "Football", icon: "Circle" },
  { id: "basketball", name: "Basketball", icon: "CircleDot" },
  { id: "rugby-union", name: "Rugby Union", icon: "Shield" },
  { id: "hockey", name: "Hockey", icon: "Disc" },
  { id: "cricket-whites", name: "Cricket Whites", icon: "SunMedium" },
  { id: "training", name: "Training", icon: "Dumbbell" },
  { id: "leisure", name: "Leisure", icon: "Shirt" },
  { id: "netball", name: "Netball", icon: "Volleyball" },
];

// Collar styles - each style has its own front overlay PNG.
// The back view uses a single shared collar overlay (back-collar.png).
export type CollarStyle = {
  id: string;
  name: string;
  description: string;
  assetPath: string;
};

export const COLLAR_STYLES: CollarStyle[] = [
  {
    id: "polo",
    name: "Polo Collar",
    description: "Classic buttoned placket neckline",
    assetPath: asset("front-collar-1.png"),
  },
  {
    id: "crew",
    name: "Crew Neck",
    description: "Close-fitting round neckline",
    assetPath: asset("front-collar-2.png"),
  },
];

export const DEFAULT_COLLAR_STYLE = "polo";

export const getCollarStyle = (id: string): CollarStyle => {
  return COLLAR_STYLES.find((c) => c.id === id) ?? COLLAR_STYLES[0];
};

// Asset path for the collar overlay in a given view/style.
// Front honours the selected style; back always uses the shared back collar.
export const getCollarAsset = (view: KitView, styleId: string): string => {
  return view === "back" ? asset("back-collar.png") : getCollarStyle(styleId).assetPath;
};

// === Front chest logo ===
// The logo is placed as an overlay on the front view only. Positions are
// percentages of the jersey canvas; scale is a percentage of canvas width.
export const LOGO_ASSET = "/logo.svg";

export const DEFAULT_LOGO = {
  enabled: true,
  x: 35,
  y: 34,
  scale: 12,
  url: LOGO_ASSET,
} as const;

