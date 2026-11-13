import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TYKA Kit Builder — Custom Jersey Designer",
  description: "Design your own custom sports jersey with the TYKA Kit Builder. Pick your colours, collar style, pattern, and personalisation.",
  keywords: ["Kit Builder", "TYKA", "custom jersey", "sports kit", "jersey designer", "sublimated kit"],
  authors: [{ name: "TYKA Kit Builder" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "TYKA Kit Builder",
    description: "Design your own custom sports jersey",
    siteName: "TYKA Kit Builder",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TYKA Kit Builder",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
