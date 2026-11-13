"use client";

import * as React from "react";
import {
  COLOR_PALETTE,
  DEFAULT_COLLAR_STYLE,
  DEFAULT_LOGO,
  LOGO_ASSET,
  VIEW_LAYERS,
  getCollarAsset,
  getHexByCode,
  type ColorSlotKey,
  type KitView,
} from "@/lib/kit-data";

type JerseyPreviewProps = {
  view: KitView;
  colors: Record<ColorSlotKey, string>;
  playerName?: string;
  playerNumber?: string;
  collarStyle?: string;
  logoEnabled?: boolean;
  logoX?: number;
  logoY?: number;
  logoScale?: number;
  logoUrl?: string;
  onLogoMove?: (x: number, y: number) => void;
  className?: string;
};

const clampLogo = (value: number) => Math.min(96, Math.max(4, value));

/**
 * Loads the layered PNG assets for the given view, recolors each layer
 * according to the chosen colour slot, and composites them onto a canvas.
 *
 * Layered PNGs (body.png, sleeves.png, etc.) are loaded if present in
 * /public/jersey/. For any layer without a PNG, the optional fallback
 * asset (e.g. the flat base photo) is used instead — this lets us ship
 * a working single-colour preview today and auto-upgrade to multi-colour
 * the moment the designer delivers the layered assets.
 *
 * Recoloring technique (verified):
 *   For each pixel in the source PNG:
 *     - alpha preserved (silhouette + edges stay soft)
 *     - rgb replaced with chosen_color * (0.4 + 0.6 * source_rgb/255)
 *       — soft-multiply blend that keeps fabric folds visible while
 *         showing the chosen colour clearly.
 */
export function JerseyPreview({
  view,
  colors,
  playerName,
  playerNumber,
  collarStyle = DEFAULT_COLLAR_STYLE,
  logoEnabled = DEFAULT_LOGO.enabled,
  logoX = DEFAULT_LOGO.x,
  logoY = DEFAULT_LOGO.y,
  logoScale = DEFAULT_LOGO.scale,
  logoUrl = DEFAULT_LOGO.url,
  onLogoMove,
  className,
}: JerseyPreviewProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const [draggingLogo, setDraggingLogo] = React.useState(false);
  const [status, setStatus] = React.useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [errorMsg, setErrorMsg] = React.useState<string>("");

  // Cache loaded HTMLImageElement per src so we don't reload on every recolor
  const imageCacheRef = React.useRef<Map<string, HTMLImageElement>>(new Map());

  // Sort layers by order (bottom first) and resolve the collar overlay for
  // the selected style (front) or the shared back collar.
  const layers = React.useMemo(
    () =>
      [...VIEW_LAYERS[view].layers]
        .sort((a, b) => a.order - b.order)
        .map((layer) =>
          layer.slot === "collarColour"
            ? { ...layer, assetPath: getCollarAsset(view, collarStyle) }
            : layer
        ),
    [view, collarStyle]
  );

  // Load an image, with on-error handling that returns null for missing PNGs
  const loadImage = React.useCallback(
    (src: string): Promise<HTMLImageElement | null> => {
      return new Promise((resolve) => {
        const cached = imageCacheRef.current.get(src);
        if (cached) {
          resolve(cached);
          return;
        }
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          imageCacheRef.current.set(src, img);
          resolve(img);
        };
        img.onerror = () => resolve(null);
        img.src = src;
      });
    },
    []
  );

      // Recolor a single layer's pixel data using the soft-multiply approach.
  // Returns a new canvas with the recolored layer drawn on transparent bg.
  // Also boosts the alpha channel because the source webp has low alpha values
  // (max ~216, mean ~53) that would otherwise wash the colour out when the
  // canvas is composited over the page background.
  const recolorLayer = React.useCallback(
    (
      img: HTMLImageElement,
      hexColor: string,
      uniform = false
    ): HTMLCanvasElement => {
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      const ctx = c.getContext("2d");
      if (!ctx) return c;

      // Draw the source PNG
      ctx.drawImage(img, 0, 0, w, h);

      // Read pixel data
      const data = ctx.getImageData(0, 0, w, h);
      const px = data.data;

      // Parse hex color
      const r = parseInt(hexColor.slice(1, 3), 16);
      const g = parseInt(hexColor.slice(3, 5), 16);
      const b = parseInt(hexColor.slice(5, 7), 16);

      // Soft-multiply blend:
      //   factor = 0.4 + 0.6 * (source_brightness / 255)
      //   result = chosen_color * factor
      // This preserves dark shadows (low factor) and bright highlights (high factor)
      //
      // Alpha boost: source alpha is in 0..~216 range; multiply by 4 and clamp
      // to 255 so the jersey interior is fully opaque while edges stay soft.
      for (let i = 0; i < px.length; i += 4) {
        const a = px[i + 3];
        if (a === 0) continue; // skip fully-transparent pixels

        // Use luminance as the shading multiplier.
        // Collar overlays use near-uniform shading so the pre-baked grey
        // lining inside the collar doesn't render as a second, darker tone.
        const lum =
          (0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]) / 255;
        const factor = uniform ? 0.85 + 0.15 * lum : 0.4 + 0.6 * lum;

        px[i] = Math.min(255, r * factor);
        px[i + 1] = Math.min(255, g * factor);
        px[i + 2] = Math.min(255, b * factor);
        // Boost alpha so the interior is fully opaque
        px[i + 3] = Math.min(255, a * 4);
      }

      ctx.putImageData(data, 0, 0);
      return c;
    },
    []
  );

  // Draw player name + number on back view
  const drawBackPrint = React.useCallback(
    (
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      name: string,
      number: string,
      color: string
    ) => {
      const num = number || "10";
      const nm = (name || "PLAYER").toUpperCase();

      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = color;

      // Number - large, centered on upper back
      ctx.font = `900 ${Math.round(h * 0.22)}px Arial, sans-serif`;
      ctx.fillText(num, w / 2, h * 0.45);

      // Name - smaller, curved/straight above or below number
      ctx.font = `800 ${Math.round(h * 0.05)}px Arial, sans-serif`;
      ctx.fillText(nm, w / 2, h * 0.62);
      ctx.restore();
    },
    []
  );

  // Main render: load all layers, recolor each, composite onto visible canvas
  const render = React.useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setStatus("loading");

    try {
      // Determine which layers actually have a usable asset.
      // Try preferred assetPath; if missing and a fallback exists, use it.
      const layerAssets: {
        layer: (typeof layers)[number];
        img: HTMLImageElement;
        hex: string;
      }[] = [];

      for (const layer of layers) {
        let img = await loadImage(layer.assetPath);
        if (!img && layer.fallbackPath) {
          img = await loadImage(layer.fallbackPath);
        }
        if (!img) continue; // skip layer entirely if no asset
        const hex = getHexByCode(colors[layer.slot] ?? "01");
        layerAssets.push({ layer, img, hex });
      }

      if (layerAssets.length === 0) {
        setStatus("error");
        setErrorMsg(
          "No jersey assets found. Add PNGs to /public/jersey/ (front-body.png, etc.)"
        );
        return;
      }

      // Match canvas size to the first (base) layer
      const base = layerAssets[0].img;
      const w = base.naturalWidth || base.width;
      const h = base.naturalHeight || base.height;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setStatus("error");
        setErrorMsg("Canvas not supported.");
        return;
      }

      // Clear
      ctx.clearRect(0, 0, w, h);

      // Draw each recolored layer bottom-up
      for (const { layer, img, hex } of layerAssets) {
        const recolored = recolorLayer(
          img,
          hex,
          layer.slot === "collarColour"
        );
        ctx.drawImage(recolored, 0, 0, w, h);
      }

      // Back view: draw name + number
      if (view === "back") {
        const nameHex = getHexByCode(colors.nameNumber ?? "02");
        drawBackPrint(
          ctx,
          w,
          h,
          playerName ?? "",
          playerNumber ?? "",
          nameHex
        );
      }

      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : String(err));
    }
  }, [
    layers,
    colors,
    view,
    playerName,
    playerNumber,
    loadImage,
    recolorLayer,
    drawBackPrint,
  ]);

  // Re-render whenever any input changes
  React.useEffect(() => {
    void render();
  }, [render]);

  // Drag the front logo to reposition it (percentages of the preview box).
  const updateLogoFromPointer = React.useCallback(
    (e: React.PointerEvent<HTMLImageElement>) => {
      const el = wrapperRef.current;
      if (!el || !onLogoMove) return;
      const rect = el.getBoundingClientRect();
      onLogoMove(
        clampLogo(((e.clientX - rect.left) / rect.width) * 100),
        clampLogo(((e.clientY - rect.top) / rect.height) * 100)
      );
    },
    [onLogoMove]
  );

  const handleLogoPointerDown = (e: React.PointerEvent<HTMLImageElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDraggingLogo(true);
    updateLogoFromPointer(e);
  };

  const handleLogoPointerMove = (e: React.PointerEvent<HTMLImageElement>) => {
    if (draggingLogo) updateLogoFromPointer(e);
  };

  const handleLogoPointerUp = (e: React.PointerEvent<HTMLImageElement>) => {
    setDraggingLogo(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleLogoKeyDown = (e: React.KeyboardEvent<HTMLImageElement>) => {
    if (!onLogoMove) return;
    const step = e.shiftKey ? 1 : 3;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const move = moves[e.key];
    if (!move) return;
    e.preventDefault();
    onLogoMove(clampLogo(logoX + move[0]), clampLogo(logoY + move[1]));
  };

  return (
    <div ref={wrapperRef} className={className} style={{ position: "relative" }}>
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        style={{ objectFit: "contain" }}
        aria-label={`Jersey ${view} view`}
      />
      {view === "front" && logoEnabled && (
        <img
          src={logoUrl || LOGO_ASSET}
          alt="Team logo"
          draggable={false}
          role="button"
          tabIndex={0}
          aria-label="Drag or use arrow keys to move the logo"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = LOGO_ASSET;
          }}
          onPointerDown={handleLogoPointerDown}
          onPointerMove={handleLogoPointerMove}
          onPointerUp={handleLogoPointerUp}
          onPointerCancel={handleLogoPointerUp}
          onKeyDown={handleLogoKeyDown}
          className={
            "absolute z-20 select-none drop-shadow-sm " +
            (draggingLogo ? "cursor-grabbing" : "cursor-grab")
          }
          style={{
            left: `${logoX}%`,
            top: `${logoY}%`,
            width: `${logoScale}%`,
            transform: "translate(-50%, -50%)",
            touchAction: "none",
          }}
        />
      )}
      {status === "loading" && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
          Rendering…
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-xs text-destructive">
          {errorMsg}
        </div>
      )}
    </div>
  );
}

// Silence unused import warning - COLOR_PALETTE is re-exported for the panel
export { COLOR_PALETTE };
