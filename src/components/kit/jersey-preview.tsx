"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { getHexByCode, type KitView, type ColorSlotKey } from "@/lib/kit-data";
import {
  resolveCollarAsset,
  type BuilderConfig,
} from "@/lib/builder-config";

type JerseyPreviewProps = {
  config: BuilderConfig;
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
  printX?: number;
  printY?: number;
  printEnabled?: boolean;
  onPrintMove?: (x: number, y: number) => void;
  // When set, shows a download button that exports the composite as a PNG
  downloadName?: string;
  className?: string;
};

const clampLogo = (value: number) => Math.min(96, Math.max(4, value));

// Cache of collar-hole masks (grey-painted canvases) keyed by asset path
const collarHoleCache = new Map<string, HTMLCanvasElement>();

/**
 * Builds a canvas of the collar asset's inner hole painted flat grey.
 * The hole = transparent pixels enclosed by the solid ring band (found via
 * flood fill from the image borders). Drawing this under the recoloured
 * ring makes the in-between-collar area always grey, with no gaps, for any
 * collar style.
 */
const buildCollarHole = (img: HTMLImageElement, src: string): HTMLCanvasElement | null => {
  const cached = collarHoleCache.get(src);
  if (cached) return cached;

  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const c = document.createElement("canvas");
  c.width = iw;
  c.height = ih;
  const ictx = c.getContext("2d");
  if (!ictx) return null;
  ictx.drawImage(img, 0, 0);
  const imgData = ictx.getImageData(0, 0, iw, ih);
  const px = imgData.data;
  const n = iw * ih;
  const SOLID = 250; // pixels at/above this alpha belong to the ring band

  // Bounding box of the solid ring (containment guard against fill leaks)
  let minX = iw;
  let maxX = -1;
  let minY = ih;
  let maxY = -1;
  for (let i = 0; i < n; i++) {
    if (px[i * 4 + 3] >= SOLID) {
      const x = i % iw;
      const y = (i / iw) | 0;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  if (maxX < 0) return null;

  // Flood fill the outside transparent region from the image borders
  const outside = new Uint8Array(n);
  const stack: number[] = [];
  const seed = (x: number, y: number) => {
    const i = y * iw + x;
    if (!outside[i] && px[i * 4 + 3] < SOLID) {
      outside[i] = 1;
      stack.push(i);
    }
  };
  for (let x = 0; x < iw; x++) {
    seed(x, 0);
    seed(x, ih - 1);
  }
  for (let y = 0; y < ih; y++) {
    seed(0, y);
    seed(iw - 1, y);
  }
  while (stack.length > 0) {
    const i = stack.pop() as number;
    const x = i % iw;
    const y = (i / iw) | 0;
    if (x > 0) seed(x - 1, y);
    if (x < iw - 1) seed(x + 1, y);
    if (y > 0) seed(x, y - 1);
    if (y < ih - 1) seed(x, y + 1);
  }

  // Enclosed transparent pixels within the ring's bbox = the hole → grey
  let painted = 0;
  for (let i = 0; i < n; i++) {
    if (outside[i]) continue;
    const a = px[i * 4 + 3];
    if (a >= SOLID) continue;
    const x = i % iw;
    const y = (i / iw) | 0;
    if (x < minX - 2 || x > maxX + 2 || y < minY - 2 || y > maxY + 2) continue;
    px[i * 4] = 196; // #C4C4C4
    px[i * 4 + 1] = 196;
    px[i * 4 + 2] = 196;
    px[i * 4 + 3] = 255;
    painted++;
  }
  if (painted === 0) return null;
  ictx.putImageData(imgData, 0, 0);
  collarHoleCache.set(src, c);
  return c;
};

/**
 * Loads the product's layered PNG assets for the given view, recolors each
 * layer according to the chosen colour slot, and composites them onto a canvas.
 *
 * Layers are defined per product in src/lib/builder-config.ts and the files
 * live in /public/products/<slug>/. For any layer whose PNG is missing, the
 * optional fallback asset (e.g. the flat base photo) is used instead.
 *
 * Recoloring technique (verified):
 *   For each pixel in the source PNG:
 *     - alpha preserved (silhouette + edges stay soft)
 *     - rgb replaced with chosen_color * (0.4 + 0.6 * source_rgb/255)
 *       — soft-multiply blend that keeps fabric folds visible while
 *         showing the chosen colour clearly.
 */
export function JerseyPreview({
  config,
  view,
  colors,
  playerName,
  playerNumber,
  collarStyle = config.defaultCollarStyle,
  logoEnabled = config.defaultLogo.enabled,
  logoX = config.defaultLogo.x,
  logoY = config.defaultLogo.y,
  logoScale = config.defaultLogo.scale,
  logoUrl = config.defaultLogo.url,
  onLogoMove,
  printX = config.defaultPrint.x,
  printY = config.defaultPrint.y,
  printEnabled = config.defaultPrint.enabled,
  onPrintMove,
  downloadName,
  className,
}: JerseyPreviewProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const logoImgRef = React.useRef<HTMLImageElement | null>(null);
  // Sequence counter for async renders — only the latest may paint
  const renderSeqRef = React.useRef(0);
  // Key of the last rendered view (product|view|collar) — detects switches
  const lastRenderKeyRef = React.useRef<string>("");
  // Cached composite of the recoloured layers (without the print). Print
  // dragging redraws only this composite + text, so drags stay smooth.
  const baseCanvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [draggingLogo, setDraggingLogo] = React.useState(false);
  const [draggingPrint, setDraggingPrint] = React.useState(false);
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
      [...config.views[view].layers]
        .sort((a, b) => a.order - b.order)
        .map((layer) =>
          layer.slot === "collarColour"
            ? { ...layer, assetPath: resolveCollarAsset(config, view, collarStyle) }
            : layer
        ),
    [config, view, collarStyle]
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
      uniform = false,
      fixed = false
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

        if (fixed) {
          // Fixed layers are painted a uniform grey (in-collar lining) —
          // this wipes any baked-in branding from the source asset and the
          // area stays grey no matter which colours are picked.
          px[i] = 196; // #C4C4C4
          px[i + 1] = 196;
          px[i + 2] = 196;
          px[i + 3] = Math.min(255, a * 4);
          continue;
        }

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

  // Draw player name + number on back view at the given anchor (% of canvas).
  // The name stays a fixed offset below the number.
  const drawBackPrint = React.useCallback(
    (
      ctx: CanvasRenderingContext2D,
      w: number,
      h: number,
      name: string,
      number: string,
      color: string,
      x: number,
      y: number
    ) => {
      const num = number || "10";
      const nm = (name || "PLAYER").toUpperCase();
      const cx = (x / 100) * w;
      const cy = (y / 100) * h;

      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = color;

      // Number - large, centered on the anchor
      ctx.font = `900 ${Math.round(h * 0.22)}px Arial, sans-serif`;
      ctx.fillText(num, cx, cy);

      // Name - smaller, below the number
      ctx.font = `800 ${Math.round(h * 0.05)}px Arial, sans-serif`;
      ctx.fillText(nm, cx, cy + h * 0.17);
      ctx.restore();
    },
    []
  );

  // Cheap redraw of the visible canvas from the cached base composite.
  // Runs on print drag / name/number typing without re-recolouring layers.
  const compositeFromBase = React.useCallback(() => {
    const canvas = canvasRef.current;
    const base = baseCanvasRef.current;
    if (!canvas || !base) return;
    canvas.width = base.width;
    canvas.height = base.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, base.width, base.height);
    ctx.drawImage(base, 0, 0);
    if (view === "back" && printEnabled) {
      const nameHex = getHexByCode(colors.nameNumber ?? "02");
      drawBackPrint(
        ctx,
        base.width,
        base.height,
        playerName ?? "",
        playerNumber ?? "",
        nameHex,
        printX,
        printY
      );
    }
  }, [view, colors, playerName, playerNumber, printX, printY, printEnabled, drawBackPrint]);

  // Main render: load all layers, recolor each, composite onto visible canvas.
  // Async (image loading) — a sequence counter discards stale runs so a slow
  // older render can never paint over a newer one (e.g. after a product
  // switch, old colours finishing last would overwrite the new ones).
  const render = React.useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const seq = ++renderSeqRef.current;

    setStatus("loading");

    // On a view/product switch, wipe the previous view right away instead of
    // letting it linger behind the loading state. Colour-only changes keep
    // the canvas (smooth recolour) — only view/collar/product switches clear.
    const renderKey = `${config.assetsBase}|${view}|${collarStyle}`;
    if (renderKey !== lastRenderKeyRef.current) {
      const clearCtx = canvas.getContext("2d");
      if (clearCtx) clearCtx.clearRect(0, 0, canvas.width, canvas.height);
      baseCanvasRef.current = null;
      lastRenderKeyRef.current = renderKey;
    }

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

      // A newer render superseded this one — discard it entirely
      if (seq !== renderSeqRef.current) return;

      if (layerAssets.length === 0) {
        setStatus("error");
        setErrorMsg(
          `No jersey assets found. Add the product's layer PNGs to ${config.assetsBase}/`
        );
        return;
      }

      // Match canvas size to the first (base) layer
      const base = layerAssets[0].img;
      const w = base.naturalWidth || base.width;
      const h = base.naturalHeight || base.height;

      // Composite the recoloured layers into a cached offscreen canvas.
      // Print dragging re-uses this cache instead of re-recoulouring.
      const baseCanvas = document.createElement("canvas");
      baseCanvas.width = w;
      baseCanvas.height = h;
      const bctx = baseCanvas.getContext("2d");
      if (!bctx) {
        setStatus("error");
        setErrorMsg("Canvas not supported.");
        return;
      }
      bctx.clearRect(0, 0, w, h);
      for (const { layer, img, hex } of layerAssets) {
        // Paint the collar ring's inner hole flat grey before drawing the
        // recoloured ring, so the in-between-collar area stays grey always.
        if (layer.slot === "collarColour" && view === "front") {
          const hole = buildCollarHole(img, layer.assetPath);
          if (hole) bctx.drawImage(hole, 0, 0, w, h);
        }
        const recolored = recolorLayer(
          img,
          hex,
          layer.slot === "collarColour",
          layer.fixed === true
        );
        bctx.drawImage(recolored, 0, 0, w, h);
      }
      baseCanvasRef.current = baseCanvas;

      // Superseded while compositing — let the newer render own the canvas
      if (seq !== renderSeqRef.current) return;

      // Draw the cached composite (+ back print) onto the visible canvas
      compositeFromBase();
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : String(err));
    }
  }, [
    layers,
    colors,
    view,
    config.assetsBase,
    loadImage,
    recolorLayer,
    compositeFromBase,
  ]);

  // Full re-render whenever layer inputs change
  React.useEffect(() => {
    void render();
  }, [render]);

  // Cheap redraw when only the print position / text changes
  React.useEffect(() => {
    compositeFromBase();
  }, [compositeFromBase]);

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

  // Drag the back-view name/number block to reposition it.
  const updatePrintFromPointer = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = wrapperRef.current;
      if (!el || !onPrintMove) return;
      const rect = el.getBoundingClientRect();
      onPrintMove(
        clampLogo(((e.clientX - rect.left) / rect.width) * 100),
        clampLogo(((e.clientY - rect.top) / rect.height) * 100)
      );
    },
    [onPrintMove]
  );

  const handlePrintPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDraggingPrint(true);
    updatePrintFromPointer(e);
  };

  const handlePrintPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (draggingPrint) updatePrintFromPointer(e);
  };

  const handlePrintPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setDraggingPrint(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handlePrintKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onPrintMove) return;
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
    onPrintMove(clampLogo(printX + move[0]), clampLogo(printY + move[1]));
  };

  // Export the composite (layers + front logo + back print) as a PNG.
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const exp = document.createElement("canvas");
      exp.width = canvas.width;
      exp.height = canvas.height;
      const ctx = exp.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(canvas, 0, 0);
      // The front logo is an HTML overlay — bake it into the export
      if (view === "front" && logoEnabled) {
        const img = logoImgRef.current;
        if (img && img.complete && img.naturalWidth > 0) {
          const lw = (logoScale / 100) * canvas.width;
          const lh = lw * (img.naturalHeight / img.naturalWidth);
          const cx = (logoX / 100) * canvas.width;
          const cy = (logoY / 100) * canvas.height;
          ctx.drawImage(img, cx - lw / 2, cy - lh / 2, lw, lh);
        }
      }
      const a = document.createElement("a");
      a.href = exp.toDataURL("image/png");
      a.download = downloadName || `${config.productId}-${view}.png`;
      a.click();
    } catch {
      // Tainted canvas (cross-origin logo URL) — nothing we can do
    }
  };

  return (
    <div ref={wrapperRef} className={className} style={{ position: "relative" }}>
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        style={{ objectFit: "contain" }}
        aria-label={`Jersey ${view} view`}
      />
      {downloadName && (
        <button
          type="button"
          onClick={handleDownload}
          title="Download design"
          aria-label={`Download ${view} design`}
          className="absolute right-2 top-2 z-30 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-white/90 text-foreground shadow-sm transition-colors hover:bg-white"
        >
          <Download className="h-3.5 w-3.5" aria-hidden />
        </button>
      )}
      {view === "back" && printEnabled && onPrintMove && (
        // Invisible drag surface over the name/number block — nothing drawn.
        <div
          role="button"
          tabIndex={0}
          aria-label="Drag or use arrow keys to move the name and number"
          onPointerDown={handlePrintPointerDown}
          onPointerMove={handlePrintPointerMove}
          onPointerUp={handlePrintPointerUp}
          onPointerCancel={handlePrintPointerUp}
          onKeyDown={handlePrintKeyDown}
          className="absolute z-20 cursor-move"
          style={{
            left: `${printX}%`,
            top: `${printY - 12}%`,
            width: "52%",
            height: "42%",
            transform: "translateX(-50%)",
            touchAction: "none",
          }}
        />
      )}
      {view === "front" && logoEnabled && (
        <img
          src={logoUrl || config.defaultLogo.url}
          alt="Team logo"
          draggable={false}
          role="button"
          tabIndex={0}
          ref={logoImgRef}
          aria-label="Drag or use arrow keys to move the logo"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = config.defaultLogo.url;
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
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span
            aria-hidden
            className="h-9 w-9 animate-spin rounded-full border-[3px] border-muted-foreground/25 border-t-red-600"
          />
          <span className="sr-only">Loading…</span>
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
