"use client";

import { create } from "zustand";
import { getCategoryName } from "./product";
import type { ColorSlotKey } from "./kit-data";
import type { BuilderConfig } from "./builder-config";

export type BasketItem = {
  id: string;
  designId: string;
  designName: string;
  categoryName: string;
  size: string;
  quantity: number;
  colors: Record<ColorSlotKey, string>;
  playerName?: string;
  playerNumber?: string;
  collarStyle: string;
  collarName: string;
};

type KitState = {
  // Active product config (set via initForProduct)
  builderConfig: BuilderConfig | null;

  // Active selections
  activeCategory: string;
  activeDesignId: string;
  view: "front" | "back";
  colors: Record<ColorSlotKey, string> | null;
  playerName: string;
  playerNumber: string;
  size: string;
  quantity: number;

  // Collar
  collarStyle: string;

  // Front logo
  logoEnabled: boolean;
  logoX: number;
  logoY: number;
  logoScale: number;
  logoUrl: string;

  // Back-view name/number position (anchor % of canvas)
  printEnabled: boolean;
  printX: number;
  printY: number;

  // Basket
  basket: BasketItem[];

  // Actions
  initForProduct: (config: BuilderConfig) => void;
  setCategory: (id: string) => void;
  setDesign: (id: string) => void;
  setView: (v: "front" | "back") => void;
  setColor: (slot: ColorSlotKey, code: string) => void;
  setPlayerName: (n: string) => void;
  setPlayerNumber: (n: string) => void;
  setSize: (s: string) => void;
  setQuantity: (q: number) => void;
  setCollarStyle: (id: string) => void;
  setLogoEnabled: (v: boolean) => void;
  setLogoPosition: (x: number, y: number) => void;
  setLogoScale: (s: number) => void;
  setLogoUrl: (url: string) => void;
  resetLogo: () => void;
  setPrintEnabled: (v: boolean) => void;
  setPrintPosition: (x: number, y: number) => void;
  addToBasket: () => void;
  removeFromBasket: (id: string) => void;
  clearBasket: () => void;
  resetKit: () => void;
};

let basketCounter = 0;

export const useKitStore = create<KitState>((set, get) => ({
  builderConfig: null,

  activeCategory: "jersey",
  activeDesignId: "",
  view: "front",
  colors: null,
  playerName: "",
  playerNumber: "10",
  size: "M",
  quantity: 1,
  collarStyle: "",
  logoEnabled: false,
  logoX: 35,
  logoY: 34,
  logoScale: 12,
  logoUrl: "",
  printEnabled: true,
  printX: 50,
  printY: 45,
  basket: [],

  // Apply a product's builder config: loads its default colours, collar and
  // logo. Skipped if this product is already active (e.g. React remounts).
  initForProduct: (config) => {
    if (get().builderConfig?.productId === config.productId) return;
    set({
      builderConfig: config,
      activeDesignId: config.productId,
      view: "front",
      colors: { ...config.defaultColors },
      playerName: "",
      playerNumber: "10",
      size: "M",
      quantity: 1,
      collarStyle: config.defaultCollarStyle,
      logoEnabled: config.defaultLogo.enabled,
      logoX: config.defaultLogo.x,
      logoY: config.defaultLogo.y,
      logoScale: config.defaultLogo.scale,
      logoUrl: config.defaultLogo.url,
      printEnabled: config.defaultPrint.enabled,
      printX: config.defaultPrint.x,
      printY: config.defaultPrint.y,
    });
  },

  setCategory: (id) => set({ activeCategory: id }),
  setDesign: (id) => set({ activeDesignId: id }),
  setView: (v) => set({ view: v }),
  setColor: (slot, code) =>
    set((state) =>
      state.colors
        ? { colors: { ...state.colors, [slot]: code } }
        : state
    ),
  setPlayerName: (n) => set({ playerName: n }),
  setPlayerNumber: (n) => set({ playerNumber: n }),
  setSize: (s) => set({ size: s }),
  setQuantity: (q) => set({ quantity: Math.max(1, q) }),
  setCollarStyle: (id) => set({ collarStyle: id }),

  setLogoEnabled: (v) => set({ logoEnabled: v }),
  setLogoPosition: (x, y) =>
    set({
      logoX: Math.min(96, Math.max(4, x)),
      logoY: Math.min(96, Math.max(4, y)),
    }),
  setLogoScale: (s) => set({ logoScale: Math.min(30, Math.max(6, s)) }),
  setLogoUrl: (url) =>
    set((state) => ({
      logoUrl: url.trim() || state.builderConfig?.defaultLogo.url || "",
    })),
  resetLogo: () =>
    set((state) => {
      const logo = state.builderConfig?.defaultLogo;
      return logo
        ? {
            logoEnabled: logo.enabled,
            logoX: logo.x,
            logoY: logo.y,
            logoScale: logo.scale,
            logoUrl: logo.url,
          }
        : state;
    }),
  setPrintEnabled: (v) => set({ printEnabled: v }),
  setPrintPosition: (x, y) =>
    set({
      printX: Math.min(88, Math.max(12, x)),
      printY: Math.min(75, Math.max(15, y)),
    }),

  addToBasket: () => {
    const state = get();
    const config = state.builderConfig;
    const colors = state.colors;
    if (!config || !colors) return;
    basketCounter += 1;
    const collarName =
      config.collarStyles.find((c) => c.id === state.collarStyle)?.name ??
      state.collarStyle;
    const item: BasketItem = {
      id: `item-${basketCounter}`,
      designId: config.productId,
      designName: `Custom ${config.productId}`,
      categoryName: getCategoryName(state.activeCategory),
      colors: { ...colors },
      playerName: state.playerName,
      playerNumber: state.playerNumber,
      size: state.size,
      quantity: state.quantity,
      collarStyle: state.collarStyle,
      collarName,
    };
    set({ basket: [...state.basket, item] });
  },

  removeFromBasket: (id) =>
    set((state) => ({ basket: state.basket.filter((i) => i.id !== id) })),

  clearBasket: () => set({ basket: [] }),

  resetKit: () =>
    set((state) => {
      const config = state.builderConfig;
      if (!config) return state;
      return {
        colors: { ...config.defaultColors },
        playerName: "",
        playerNumber: "10",
        size: "M",
        quantity: 1,
        collarStyle: config.defaultCollarStyle,
        logoEnabled: config.defaultLogo.enabled,
        logoX: config.defaultLogo.x,
        logoY: config.defaultLogo.y,
        logoScale: config.defaultLogo.scale,
        logoUrl: config.defaultLogo.url,
        printEnabled: config.defaultPrint.enabled,
        printX: config.defaultPrint.x,
        printY: config.defaultPrint.y,
      };
    }),
}));
