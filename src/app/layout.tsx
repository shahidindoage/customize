import type { Metadata } from "next";
import { Big_Shoulders, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bigShoulders = Big_Shoulders({
  variable: "--font-big-shoulders",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Kragbuzz - Custom Sportswear & Kit Builder",
    template: "%s - Kragbuzz",
  },
  description: "Design your own custom sports jersey with the Kragbuzz Kit Builder. Pick your colours, collar style, pattern, and personalisation.",
  keywords: ["Kit Builder", "Kragbuzz", "custom jersey", "sports kit", "jersey designer", "sublimated kit"],
  authors: [{ name: "Kragbuzz" }],
  icons: {
    icon: "/images/logo.png",
  },
  openGraph: {
    title: "Kragbuzz - Custom Sportswear & Kit Builder",
    description: "Design your own custom sports jersey",
    siteName: "Kragbuzz",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kragbuzz - Custom Sportswear & Kit Builder",
    description: "Design your own custom sports jersey",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${bigShoulders.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
