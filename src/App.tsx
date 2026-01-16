import DragImage from "./dragImage";
import { useRef, useState, useEffect } from "react";
import "./style.css";
import { Weed } from "./weed";
import Smoke from "./smoke";
import ArtPsychedelic from "./ArtPsychedelic";

type FitMode = "cover" | "contain";

type Background =
  | { name: string; type: "canvas"; render: (c: HTMLCanvasElement) => void; fit: FitMode }
  | { name: string; type: "component"; component: React.ComponentType; fit: FitMode };

const BACKGROUNDS: Background[] = [
  { name: "Weed", type: "canvas", render: Weed, fit: "cover" },
  { name: "Smoke", type: "component", component: Smoke, fit: "contain" },
  { name: "ArtPsychedelic", type: "component", component: ArtPsychedelic, fit: "cover" },
];

function resizeCanvasToElement(canvas: HTMLCanvasElement) {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.round(rect.width * dpr));
  canvas.height = Math.max(1, Math.round(rect.height * dpr));
  const ctx = canvas.getContext("2d");
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function canvasToDataURLFit(source: HTMLCanvasElement, w: number, h: number, fit: FitMode) {
  const dpr = window.devicePixelRatio || 1;
  const out = document.createElement("canvas");
  out.width = Math.max(1, Math.round(w * dpr));
  out.height = Math.max(1, Math.round(h * dpr));

  const ctx = out.getContext("2d");
  if (!ctx || !source.width || !source.height) return null;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const sw = source.width;
  const sh = source.height;
  const sr = sw / sh;
  const tr = w / h;

  if (fit === "cover") {
    const cw = sr > tr ? sh * tr : sw;
    const ch = sr > tr ? sh : sw / tr;
    ctx.drawImage(source, (sw - cw) / 2, (sh - ch) / 2, cw, ch, 0, 0, w, h);
  } else {
    const dw = sr > tr ? w : h * sr;
    const dh = sr > tr ? w / sr : h;
    ctx.drawImage(source, 0, 0, sw, sh, (w - dw) / 2, (h - dh) / 2, dw, dh);
  }

  try {
    return out.toDataURL("image/png");
  } catch {
    return null;
  }
}

function FrozenComponent({
  Component,
  fit,
  bgKey,
}: {
  Component: React.ComponentType;
  fit: FitMode;
  bgKey: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    setImageUrl(null);
    const el = ref.current;
    if (el) el.classList.remove("hide-live");

    const timer = window.setTimeout(() => {
      const container = ref.current;
      const cover = document.getElementById("cover");
      if (!container || !cover) return;

      const rect = cover.getBoundingClientRect();
      const canvas = container.querySelector("canvas") as HTMLCanvasElement | null;

      if (!canvas) return;

      // On tente plusieurs fois pour Smoke (WebGL peut renvoyer noir/vidé)
      let tries = 0;
      const maxTries = 30;

      const tryCapture = () => {
        if (!container.isConnected) return;

        const url = canvasToDataURLFit(canvas, rect.width, rect.height, fit);
        if (url) {
          setImageUrl(url);
          container.classList.add("hide-live"); // pause visuelle
          return;
        }

        tries++;
        if (tries < maxTries) requestAnimationFrame(tryCapture);
      };

      requestAnimationFrame(tryCapture);
    }, 3000);

    return () => clearTimeout(timer);
  }, [fit, bgKey]);

  return (
    <div ref={ref} className="frozen-container">
      <Component />
      {imageUrl && (
        <div className={`frozen-image fit-${fit}`} style={{ backgroundImage: `url(${imageUrl})` }} />
      )}
    </div>
  );
}

export default function App() {
  const backgroundCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const coverCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const coverRef = useRef<HTMLDivElement | null>(null);
  const [bgIndex, setBgIndex] = useState(0);

  const bg = BACKGROUNDS[bgIndex];

  useEffect(() => {
    if (bg.type !== "canvas" || !backgroundCanvasRef.current) return;

    const render = () => {
      resizeCanvasToElement(backgroundCanvasRef.current!);
      bg.render(backgroundCanvasRef.current!);
    };

    render();
    window.addEventListener("resize", render);
    return () => window.removeEventListener("resize", render);
  }, [bg]);

  useEffect(() => {
    if (bg.type !== "canvas" || !coverCanvasRef.current || !coverRef.current) return;

    const canvas = coverCanvasRef.current;
    const cover = coverRef.current;

    canvas.style.display = "block";
    cover.style.backgroundImage = "";
    cover.classList.remove("fit-cover", "fit-contain");

    resizeCanvasToElement(canvas);
    bg.render(canvas);

    const timer = window.setTimeout(() => {
      const rect = cover.getBoundingClientRect();
      const url = canvasToDataURLFit(canvas, rect.width, rect.height, bg.fit);
      if (url) {
        cover.style.backgroundImage = `url(${url})`;
        cover.classList.add(`fit-${bg.fit}`);
        canvas.style.display = "none";
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [bg]);

  return (
    <div className="app-root">
      {bg.type === "canvas" && <canvas ref={backgroundCanvasRef} className="bg-canvas" />}

      {bg.type === "component" && (
        <div className="bg-component">
          <bg.component key={`bg-${bg.name}-${bgIndex}`} />
        </div>
      )}

      <div id="cover" ref={coverRef}>
        {bg.type === "canvas" && <canvas ref={coverCanvasRef} className="cover-canvas" />}

        {bg.type === "component" && (
          <FrozenComponent
            key={`cover-${bg.name}-${bgIndex}`}
            bgKey={`${bg.name}-${bgIndex}`}
            Component={bg.component}
            fit={bg.fit}
          />
        )}
      </div>

      <div className="cover-overlay">
        <h1 className="cover-title">MON TITRE</h1>
        <img src="/ma-image.png" alt="" className="cover-image" />
      </div>

      <button className="chevron left" id="chevron_left" onClick={() => setBgIndex((i) => (i ? i - 1 : BACKGROUNDS.length - 1))}>
        →
      </button>
      <button className="chevron right" id="chevron_right" onClick={() => setBgIndex((i) => (i + 1) % BACKGROUNDS.length)}>
        →
      </button>

      <div className="weedusaur">
        <DragImage src="/weedusaur.png" initial={150} />
      </div>
      <div className="lorenzo">
        <DragImage src="/lorenzo.png" initial={150} />
      </div>
    </div>
  );
}
