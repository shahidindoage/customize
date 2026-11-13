// Static product catalogue.
//
// To add a product:
//   1. Add an entry below.
//   2. Drop its images into /public (e.g. /public/products/<id>/front.webp
//      and /public/products/<id>/back.webp) and point `images` at them.
//
// The current product reuses the jersey assets already in /public/jersey/.

export type Product = {
  id: string;
  designId: string;
  name: string;
  category: string;
  description: string;
  features: string[];
  price?: string;
  images: {
    front: string;
    back: string;
  };
};

export const PRODUCTS: Product[] = [
  {
    id: "CR2000",
    designId: "CR2000",
    name: "Sublimated Pro Jersey",
    category: "Sublimated 2.0",
    description:
      "Fully sublimated match jersey built on a lightweight performance fabric with breathable panels and a tailored athletic fit.",
    features: [
      "Full-colour sublimation printing",
      "Choice of collar styles",
      "Custom logo, name and number",
    ],
    images: {
      front: "/jersey/front-base.webp",
      back: "/jersey/back-base.webp",
    },
  },
];

export const getProduct = (id: string): Product | undefined =>
  PRODUCTS.find((product) => product.id === id);
