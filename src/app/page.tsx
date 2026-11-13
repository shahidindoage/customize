"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Sidebar } from "@/components/kit/sidebar";
import { PreviewArea } from "@/components/kit/preview-area";
import { CustomizationPanel } from "@/components/kit/customization-panel";
import { Button } from "@/components/ui/button";

export default function Home() {
  // Mobile drawer state for sidebar + panel
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [panelOpen, setPanelOpen] = React.useState(false);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background">
      {/* Mobile top bar */}
      <header className="flex items-center justify-between border-b border-border bg-background px-4 py-2 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open categories"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Link
          href="/products"
          aria-label="View all products"
          className="flex items-center gap-2"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground font-black text-sm">
            T
          </div>
          <span className="text-sm font-extrabold tracking-tight">TYKA</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setPanelOpen(true)}
          aria-label="Open customisation"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </header>

      {/* Desktop three-column layout */}
      <div className="hidden md:flex h-full min-h-0">
        <div className="w-64 shrink-0">
          <Sidebar />
        </div>
        <div className="flex-1 min-w-0">
          <PreviewArea />
        </div>
        <div className="w-[360px] shrink-0">
          <CustomizationPanel />
        </div>
      </div>

      {/* Mobile main content */}
      <main className="md:hidden flex-1 min-h-0 overflow-y-auto">
        <PreviewArea />
      </main>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-72 max-w-[80%] h-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-10"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </Button>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Mobile customization drawer */}
      {panelOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setPanelOpen(false)}
          />
          <div className="relative w-[88%] max-w-sm h-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-10"
              onClick={() => setPanelOpen(false)}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </Button>
            <CustomizationPanel />
          </div>
        </div>
      )}
    </div>
  );
}
