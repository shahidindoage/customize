// Static product catalogue + categories.
//
// Categories drive the builder sidebar (dropdown: category → its products)
// and the "Shop by Category" section on the homepage. Jersey is first.
//
// To add a product:
//   1. Add an entry below (unique `slug` — it becomes the URL:
//      /customise/<slug>; `category` must be a CATEGORIES id).
//   2. Drop its images into /public and point `images` at them.
//
// To make a product CUSTOMISABLE (opens the kit builder as its product page):
//   1. Create /public/customise/<slug>/ and put ALL of its layer images there.
//   2. Add a BuilderConfig for it in src/lib/builder-config.ts (keyed by id).
//
// Products without a builder config show a plain detail page instead.
//
// NOTE: the dummy products below reuse CR2000's placeholder images until
// their own assets are added.

import { getBuilderConfig } from "@/lib/builder-config";

export type ProductCategory = {
  id: string;
  name: string;
  icon: string; // lucide icon name
};

// Order matters — Jersey shows first in the sidebar dropdown.
export const CATEGORIES: ProductCategory[] = [
  { id: "jersey", name: "Jersey", icon: "Shirt" },
  { id: "basketball", name: "Basketball", icon: "CircleDot" },
  { id: "rugby-union", name: "Rugby Union", icon: "Shield" },
  { id: "football", name: "Football", icon: "Circle" },
  { id: "cricket", name: "Cricket", icon: "SunMedium" },
  { id: "training", name: "Training Wear", icon: "Dumbbell" },
];

export const getCategoryName = (id: string): string =>
  CATEGORIES.find((c) => c.id === id)?.name ?? id;

export type Product = {
  id: string;
  slug: string; // URL segment: /customise/<slug>
  designId: string;
  name: string;
  category: string; // CATEGORIES id
  description: string;
  features: string[];
  price?: string;
  minPrice?: string;
  maxPrice?: string;
  images: {
    front: string;
    back: string;
  };
   productCard: {
    front: string;
    back: string;
  };
};

// Shared placeholder images (CR2000's flat renders) until a product gets
// its own asset folder.
const PLACEHOLDER_IMAGES = {
  front: "/products/sublimated-pro-jersey/front-base.webp",
  back: "/products/sublimated-pro-jersey/back-base.webp",
};

export const PRODUCTS: Product[] = [
  // === Jersey ===
  {
    id: "CR2000",
    slug: "sublimated-pro-jersey",
    designId: "CR2000",
    name: "Sublimated Pro Jersey",
    category: "jersey",
    description:
      "Fully sublimated match jersey built on a lightweight performance fabric with breathable panels and a tailored athletic fit.",
    features: [
      "Full-colour sublimation printing",
      "Choice of collar styles",
      "Custom logo, name and number",
    ],
    price: "₹749",
    minPrice: "₹749",
    maxPrice: "₹2249",
    images: {
      front: "/products/sublimated-pro-jersey/front-base.webp",
      back: "/products/sublimated-pro-jersey/back-base.webp",
    },
     productCard:{
      front: "/products/sublimated-pro-jersey/CR2000-front.png",
      back: "/products/sublimated-pro-jersey/CR2000-back.png",
    }
  },
  {
    id: "CR2100",
    slug: "classic-match-jersey",
    designId: "CR2100",
    name: "Classic Match Jersey",
    category: "jersey",
    description:
      "A clean, classic-cut match jersey with breathable interlock fabric - perfect base for team colours, crest and numbers.",
    features: [
      "Breathable polyester interlock",
      "Round neck or polo collar",
      "Names & numbers available",
    ],
    price: "₹599",
    minPrice: "₹1099",
    maxPrice: "₹3099",
     images: {
      front: "/products/sublimated-pro-jersey/front-base.webp",
      back: "/products/sublimated-pro-jersey/back-base.webp",
    },
    productCard:{
      front: "/products/sublimated-pro-jersey/CR2100-front.png",
      back: "/products/sublimated-pro-jersey/CR2100-back.png",
    }
  },
   {
    id: "CR2150",
    slug: "pro-striker-jersey",
    designId: "CR2150",
    name: "PRO STRIKER JERSEY",
    category: "jersey",
    description:
      "Modern athletic jersey with a striking design, quick-dry fabric, and enhanced breathability for all-day comfort.",
    features: [
      "Breathable polyester interlock",
      "Round neck or polo collar",
      "Names & numbers available",
    ],
    price: "₹599",
    minPrice: "₹849",
    maxPrice: "₹2399",
     images: {
      front: "/products/sublimated-pro-jersey/front-base.webp",
      back: "/products/sublimated-pro-jersey/back-base.webp",
    },
    productCard:{
      front: "/products/sublimated-pro-jersey/CR2150-front.png",
      back: "/products/sublimated-pro-jersey/CR2150-back.png",
    }
  },
  {
    id: "CR2300",
    slug: "raglan-training-jersey",
    designId: "CR2300",
    name: "RAGLAN TRAINING JERSEY",
    category: "jersey",
    description:
      "Dynamic raglan-style jersey with contrast sleeves, lightweight breathable fabric, and a sporty fit for everyday training.",
    features: [
      "Full-colour sublimation printing",
      "Choice of collar styles",
      "Custom logo, name and number",
    ],
    price: "₹749",
    minPrice: "₹779",
    maxPrice: "₹2199",
    images: {
      front: "/products/sublimated-pro-jersey/front-base.webp",
      back: "/products/sublimated-pro-jersey/back-base.webp",
    },
     productCard:{
      front: "/products/classic-jersey/CR2300-front.png",
      back: "/products/classic-jersey/CR2300-back.png",
    }
  },
   {
    id: "CR2350",
    slug: "velocity-football-jersey",
    designId: "CR2350",
    name: "VELOCITY FOOTBALL JERSEY",
    category: "jersey",
    description:
      "Lightweight football jersey with a sleek athletic design, breathable fabric, and moisture-wicking comfort for peak performance.",
    features: [
      "Full-colour sublimation printing",
      "Choice of collar styles",
      "Custom logo, name and number",
    ],
    price: "₹749",
    minPrice: "₹899",
    maxPrice: "₹2499",
    images: {
      front: "/products/sublimated-pro-jersey/front-base.webp",
      back: "/products/sublimated-pro-jersey/back-base.webp",
    },
     productCard:{
      front: "/products/classic-jersey/CR2350-front.png",
      back: "/products/classic-jersey/CR2350-back.png",
    }
  },
   {
    id: "CR2400",
    slug: "titan-pro-jersey",
    designId: "CR2400",
    name: "TITAN PRO JERSEY",
    category: "jersey",
    description:
      "Premium sports jersey featuring a bold graphic pattern, durable fabric, and a comfortable fit for training and competitive play.",
    features: [
      "Full-colour sublimation printing",
      "Choice of collar styles",
      "Custom logo, name and number",
    ],
    price: "₹749",
    minPrice: "₹1099",
    maxPrice: "₹2799",
    images: {
      front: "/products/sublimated-pro-jersey/front-base.webp",
      back: "/products/sublimated-pro-jersey/back-base.webp",
    },
     productCard:{
      front: "/products/classic-jersey/CR2400-front.png",
      back: "/products/classic-jersey/CR2400-back.png",
    }
  },

  // === Basketball ===
  // {
  //   id: "CR2200",
  //   slug: "club-basketball-jersey",
  //   designId: "CR2200",
  //   name: "Club Basketball Jersey",
  //   category: "basketball",
  //   description:
  //     "Court-ready basketball jersey with a relaxed cut, moisture-wicking mesh panels and vibrant full-sublimation graphics that survive season after season.",
  //   features: [
  //     "Moisture-wicking performance fabric",
  //     "Reversible colour options",
  //     "Custom team logo and player numbers",
  //   ],
  //   price: "₹699",
  //   images: PLACEHOLDER_IMAGES,
  // },
  // {
  //   id: "CR2250",
  //   slug: "reversible-basketball-singlet",
  //   designId: "CR2250",
  //   name: "Reversible Basketball Singlet",
  //   category: "basketball",
  //   description:
  //     "Two kits in one — a reversible training singlet for scrimmages and drills, with contrasting colours on each side.",
  //   features: [
  //     "Two colourways in one jersey",
  //     "Reinforced shoulder straps",
  //     "Player numbers on both sides",
  //   ],
  //   price: "₹649",
  //   images: PLACEHOLDER_IMAGES,
  // },

  // === Rugby Union ===
  // {
  //   id: "CR2400",
  //   slug: "club-rugby-jersey",
  //   designId: "CR2400",
  //   name: "Club Rugby Jersey",
  //   category: "rugby-union",
  //   description:
  //     "Heavyweight stretch jersey engineered for contact. Reinforced seams, sublimated team branding and a professional fit built for the full 80 minutes.",
  //   features: [
  //     "Reinforced, rip-resistant stitching",
  //     "Heavyweight performance fabric",
  //     "Custom collar, logo, name and number",
  //   ],
  //   price: "₹849",
  //   images: PLACEHOLDER_IMAGES,
  // },

  // === Football ===
  // {
  //   id: "CR3000",
  //   slug: "pro-football-jersey",
  //   designId: "CR3000",
  //   name: "Pro Football Jersey",
  //   category: "football",
  //   description:
  //     "Lightweight match-day football jersey with a sublimated front print panel, engineered fit and club crest placement.",
  //   features: [
  //     "Lightweight match fabric",
  //     "Sublimated front print panel",
  //     "Custom club crest and numbers",
  //   ],
  //   price: "₹699",
  //   images: PLACEHOLDER_IMAGES,
  // },

  // === Cricket ===
  // {
  //   id: "CR3100",
  //   slug: "sublimated-cricket-shirt",
  //   designId: "CR3100",
  //   name: "Sublimated Cricket Shirt",
  //   category: "cricket",
  //   description:
  //     "Half-sleeve cricket shirt with moisture-management panels and room for club branding, player names and numbers.",
  //   features: [
  //     "Half-sleeve cricket cut",
  //     "Moisture management panels",
  //     "Club logo and player name",
  //   ],
  //   price: "₹799",
  //   images: PLACEHOLDER_IMAGES,
  // },

  // === Training Wear ===
  // {
  //   id: "CR4000",
  //   slug: "training-t-shirt",
  //   designId: "CR4000",
  //   name: "Training T-Shirt",
  //   category: "training",
  //   description:
  //     "Everyday quick-dry training tee for drills, gym sessions and warm-ups, with bulk team pricing.",
  //   features: [
  //     "Quick-dry fabric",
  //     "Athletic training fit",
  //     "Bulk team pricing",
  //   ],
  //   price: "₹449",
  //   images: PLACEHOLDER_IMAGES,
  // },
];

export const getProduct = (id: string): Product | undefined =>
  PRODUCTS.find((product) => product.id === id);

export const getProductBySlug = (slug: string): Product | undefined =>
  PRODUCTS.find((product) => product.slug === slug);

// Products in a category (drives the sidebar dropdown + listings).
export const getProductsByCategory = (categoryId: string): Product[] =>
  PRODUCTS.filter((product) => product.category === categoryId);

// Other products in the same category (for "you may also like" sections).
export const getRelatedProducts = (product: Product): Product[] =>
  PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  );

// First product that has a kit-builder config — used by "Customize Now" CTAs.
export const getCustomisableProduct = (): Product | undefined =>
  PRODUCTS.find((product) => getBuilderConfig(product.id) !== undefined);
