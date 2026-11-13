"use client";

import { create } from "zustand";
import {
  DEFAULT_COLLAR_STYLE,
  DEFAULT_KIT_COLORS,
  DEFAULT_LOGO,
  SPORT_CATEGORIES,
  type ColorSlotKey,
  type KitView,
} from "./kit-data";

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
};

type KitState = {
  // Active selections
  activeCategory: string;
  activeDesignId: string;
  view: KitView;
  colors: Record<ColorSlotKey, string>;
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

  // Basket
  basket: BasketItem[];

  // Actions
  setCategory: (id: string) => void;
  setDesign: (id: string) => void;
  setView: (v: KitView) => void;
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
  addToBasket: () => void;
  removeFromBasket: (id: string) => void;
  clearBasket: () => void;
  resetKit: () => void;
};

let basketCounter = 0;

const getCategoryName = (id: string): string => {
  const cat = SPORT_CATEGORIES.find((c) => c.id === id);
  return cat ? cat.name : id;
};

export const useKitStore = create<KitState>((set, get) => ({
  activeCategory: "sublimated",
  activeDesignId: "CR2000",
  view: "front",
  colors: { ...DEFAULT_KIT_COLORS },
  playerName: "",
  playerNumber: "10",
  size: "M",
  quantity: 1,
  collarStyle: DEFAULT_COLLAR_STYLE,
  logoEnabled: DEFAULT_LOGO.enabled,
  logoX: DEFAULT_LOGO.x,
  logoY: DEFAULT_LOGO.y,
  logoScale: DEFAULT_LOGO.scale,
  logoUrl: DEFAULT_LOGO.url,
  basket: [],

  setCategory: (id) => set({ activeCategory: id }),
  setDesign: (id) => set({ activeDesignId: id }),
  setView: (v) => set({ view: v }),
  setColor: (slot, code) =>
    set((state) => ({
      colors: { ...state.colors, [slot]: code },
    })),
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
  setLogoUrl: (url) => set({ logoUrl: url.trim() || DEFAULT_LOGO.url }),
  resetLogo: () =>
    set({
      logoEnabled: DEFAULT_LOGO.enabled,
      logoX: DEFAULT_LOGO.x,
      logoY: DEFAULT_LOGO.y,
      logoScale: DEFAULT_LOGO.scale,
      logoUrl: DEFAULT_LOGO.url,
    }),

  addToBasket: () => {
    const state = get();
    basketCounter += 1;
    const item: BasketItem = {
      id: `item-${basketCounter}`,
      designId: state.activeDesignId,
      designName: `Custom ${state.activeDesignId}`,
      categoryName: getCategoryName(state.activeCategory),
      colors: { ...state.colors },
      playerName: state.playerName,
      playerNumber: state.playerNumber,
      size: state.size,
      quantity: state.quantity,
      collarStyle: state.collarStyle,
    };
    set({ basket: [...state.basket, item] });
  },

  removeFromBasket: (id) =>
    set((state) => ({ basket: state.basket.filter((i) => i.id !== id) })),

  clearBasket: () => set({ basket: [] }),

  resetKit: () =>
    set({
      colors: { ...DEFAULT_KIT_COLORS },
      playerName: "",
      playerNumber: "10",
      size: "M",
      quantity: 1,
      collarStyle: DEFAULT_COLLAR_STYLE,
      logoEnabled: DEFAULT_LOGO.enabled,
      logoX: DEFAULT_LOGO.x,
      logoY: DEFAULT_LOGO.y,
      logoScale: DEFAULT_LOGO.scale,
      logoUrl: DEFAULT_LOGO.url,
    }),
}));
