// Kit Builder shared data: colour palette, colour slots, sport categories.
// Per-product layer assets / collar styles / defaults live in builder-config.ts.

export type ColorOption = {
  code: string; // e.g. "01", "02"
  name: string; // e.g. "White", "Black"
  hex: string;
};

// Colour palette - shared by every product's builder
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

// === Colour slots ===
// Shared labels for every customisable zone. A slot is only rendered as
// active for a product whose BuilderConfig maps a layer to it.
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
  fixed?: boolean; // draw as-is, never recoloured (e.g. grey collar lining)
};

export type CollarStyle = {
  id: string;
  name: string;
  description: string;
  assetPath: string;
};

// Sport categories live in src/lib/product.ts (CATEGORIES) — single source
// of truth for the sidebar dropdown, homepage and footer.
