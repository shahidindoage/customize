import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  async redirects() {
    return [
      // The kit builder lives at /customise/<slug>; catalogue at /custom-sportswear
      { source: "/customize", destination: "/custom-sportswear", permanent: false },
      { source: "/products", destination: "/custom-sportswear", permanent: false },
      {
        source: "/products/:slug",
        destination: "/customise/:slug",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
