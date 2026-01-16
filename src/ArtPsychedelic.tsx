"use client";

import { useRef, useEffect, useMemo, type FC } from 'react';

type ArtPsychedelic = 'arc' | 'rect' | 'poly';
const MODES: ArtPsychedelic[] = ['arc', 'rect', 'poly'];

const ArtPsychedelic: FC = () => {
  const surfaceRef = useRef<HTMLCanvasElement>(null);

  const cfg = useMemo(() => {
    const mode = MODES[Math.floor(Math.random() * MODES.length)];
    return {
      density: Math.floor(Math.random() * 12) + 12,
      depth: Math.floor(Math.random() * 8) + 8,
      mode,
      baseVel: (Math.random() - 0.5) * 0.02,
      oscFreq: Math.random() * 0.5 + 0.1,
      oscAmp: Math.random() * 0.8,
      drift: Math.random() * 0.015 + 0.005,
      pulse: Math.random() * 1.5 + 0.5,
      hStart: Math.random() * 360,
      hStep: Math.random() * 30 + 10,
      hFlow: Math.random() * 2 + 0.5,
      weight: Math.random() > 0.7 ? Math.random() * 3 + 1 : 0,
    }
  }, []);

  useEffect(() => {
    const el = surfaceRef.current;
    if (!el) return;
    const ctx = el.getContext('2d');
    if (!ctx) return;

    let frameId = 0;
    let t = 0;
    let off = 0;

    const taille = () => {
      const dpr = window.devicePixelRatio || 1;
      el.width = window.innerWidth * dpr;
      el.height = window.innerHeight * dpr;
      el.style.width = `${window.innerWidth}px`;
      el.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    window.addEventListener('resize', taille);
    taille();

    const render = () => {
      t += 0.016;
      off += cfg.drift;

      const osc = Math.sin(t * cfg.oscFreq) * cfg.oscAmp;
      const rot = (t * cfg.baseVel) + osc;
      const beat = Math.sin(t * cfg.pulse) * 0.2 + 1.0;

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const maxR = Math.max(window.innerWidth, window.innerHeight) * 0.7;

      for (let i = cfg.depth; i > 0; i--) {
        const step = (i + off) % cfg.depth;
        const norm = Math.pow(step / cfg.depth, 2.2);
        const r = norm * maxR;
        let s = (r * (2.5 / cfg.density)) * beat;

        if (s < 1) continue;
        const rRot = rot + (i * 0.1);

        for (let j = 0; j < cfg.density; j++) {
          const a = (j / cfg.density) * Math.PI * 2 + rRot;
          const x = cx + Math.cos(a) * r;
          const y = cy + Math.sin(a) * r;
          const h = (cfg.hStart + (i * cfg.hStep) + (t * cfg.hFlow * 20)) % 360;

          ctx.fillStyle = `hsl(${h}, 90%, 55%)`;
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(a + Math.PI / 2);

          ctx.beginPath();
          if (cfg.mode === 'arc') {
            ctx.arc(0, 0, s, 0, Math.PI * 2);
          } else if (cfg.mode === 'rect') {
            ctx.rect(-s, -s, s * 2, s * 2);
          } else {
            ctx.moveTo(0, -s * 1.5);
            ctx.lineTo(s, s);
            ctx.lineTo(-s, s);
            ctx.closePath();
          }

          ctx.fill();
          if (cfg.weight > 0) {
            ctx.strokeStyle = '#000';
            ctx.lineWidth = cfg.weight * norm;
            ctx.stroke();
          }
          ctx.restore();
        }
      }
      frameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', taille);
    };
  }, [cfg]);

  return (
    <canvas 
      ref={surfaceRef} 
      className="fixed inset-0 -z-10 bg-black"
      style={{ filter: 'contrast(1.1) saturate(1.2)' }}
    />
  );
};

export default ArtPsychedelic;