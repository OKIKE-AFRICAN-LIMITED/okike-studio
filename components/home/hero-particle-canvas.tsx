"use client";

import { useEffect, useRef } from "react";

interface Particle3D {
  // Base 3D coordinates
  bx: number;
  by: number;
  bz: number;
  // Current displaced 3D coordinates
  x: number;
  y: number;
  z: number;
  // Velocity for spring return
  vx: number;
  vy: number;
  vz: number;
  size: number;
  isAccent: boolean;
  layer: number;
  phase: number;
}

function buildArchitecturalParticles(): Particle3D[] {
  const particles: Particle3D[] = [];

  // 1. Three stacked isometric-style 3D hollow square frames (nod to Structure Before Scale)
  const layers = [-85, 0, 85];
  layers.forEach((yOffset, layerIdx) => {
    const outer = 125;
    const inner = 58;
    const step = 18;

    for (let x = -outer; x <= outer; x += step) {
      for (let z = -outer; z <= outer; z += step) {
        const inHollow = Math.abs(x) < inner && Math.abs(z) < inner;
        if (inHollow) continue;

        // Keep particles primarily on edges and top surface for crisp architectural look
        const isEdge =
          Math.abs(Math.abs(x) - outer) < step ||
          Math.abs(Math.abs(z) - outer) < step ||
          Math.abs(Math.abs(x) - inner) < step ||
          Math.abs(Math.abs(z) - inner) < step;

        if (!isEdge && Math.random() > 0.35) continue;

        particles.push({
          bx: x,
          by: yOffset,
          bz: z,
          x,
          y: yOffset,
          z,
          vx: 0,
          vy: 0,
          vz: 0,
          size: isEdge ? 2.1 : 1.5,
          isAccent: layerIdx === 0 || isEdge,
          layer: layerIdx,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }
  });

  // 2. Surrounding orbital depth dust for 3D immersion
  for (let i = 0; i < 160; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 175 + Math.random() * 75;
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.cos(phi) * 0.85;
    const z = r * Math.sin(phi) * Math.sin(theta);

    particles.push({
      bx: x,
      by: y,
      bz: z,
      x,
      y,
      z,
      vx: 0,
      vy: 0,
      vz: 0,
      size: 1 + Math.random() * 1.2,
      isAccent: Math.random() > 0.65,
      layer: -1,
      phase: Math.random() * Math.PI * 2,
    });
  }

  return particles;
}

export function HeroParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const particles = buildArchitecturalParticles();

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animId = 0;

    // Interactive pointer state (normalized -1 to 1, plus pixel coords)
    const pointer = {
      nx: 0,
      ny: 0,
      px: -9999,
      py: -9999,
      active: false,
      pulse: 0,
    };

    // Smoothed camera rotation
    let rotY = 0.65;
    let rotX = 0.52;
    let time = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      pointer.px = x;
      pointer.py = y;
      pointer.nx = (x / Math.max(1, rect.width)) * 2 - 1;
      pointer.ny = (y / Math.max(1, rect.height)) * 2 - 1;
      pointer.active = true;
    };

    const onPointerLeave = () => {
      pointer.active = false;
      pointer.px = -9999;
      pointer.py = -9999;
      pointer.nx = 0;
      pointer.ny = 0;
    };

    const onPointerDown = () => {
      pointer.pulse = 1;
    };

    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerleave", onPointerLeave);
    container.addEventListener("pointerdown", onPointerDown);

    const projected: Array<{
      sx: number;
      sy: number;
      scale: number;
      z: number;
      p: Particle3D;
      hoverGlow: number;
    }> = new Array(particles.length);

    const renderFrame = () => {
      if (!prefersReducedMotion) {
        time += 0.014;
      }

      // Smoothly ease camera tilt toward pointer
      const targetRotY = 0.65 + (prefersReducedMotion ? 0 : time * 0.22) + pointer.nx * 0.45;
      const targetRotX = 0.52 + pointer.ny * 0.32;
      rotY += (targetRotY - rotY) * 0.06;
      rotX += (targetRotX - rotX) * 0.06;

      if (pointer.pulse > 0.005) {
        pointer.pulse *= 0.92;
      } else {
        pointer.pulse = 0;
      }

      ctx.clearRect(0, 0, width, height);

      // Subtle architectural grid lines
      const gridStep = 44;
      ctx.strokeStyle = "rgba(245, 245, 240, 0.045)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let gx = gridStep; gx < width; gx += gridStep) {
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
      }
      for (let gy = gridStep; gy < height; gy += gridStep) {
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
      }
      ctx.stroke();

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const cx = width / 2;
      const cy = height / 2;
      const fov = Math.min(width, height) * 1.15;
      const cameraDist = 440;
      const scaleFactor = Math.min(width, height) / 480;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Gentle breathing wave on base position
        const floatY =
          !prefersReducedMotion && p.layer >= 0
            ? Math.sin(time * 1.4 + p.layer * 0.9 + p.phase * 0.3) * 5
            : 0;

        // Click pulse radial expansion
        const pulseScale = 1 + pointer.pulse * 0.22;
        const tx = p.bx * scaleFactor * pulseScale;
        const ty = (p.by + floatY) * scaleFactor * pulseScale;
        const tz = p.bz * scaleFactor * pulseScale;

        // Spring back toward target 3D position
        p.vx += (tx - p.x) * 0.09;
        p.vy += (ty - p.y) * 0.09;
        p.vz += (tz - p.z) * 0.09;

        p.vx *= 0.8;
        p.vy *= 0.8;
        p.vz *= 0.8;

        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // 3D rotation around Y then X
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.y * sinX;

        const perspective = fov / Math.max(80, cameraDist + z2);
        const sx = cx + x1 * perspective;
        const sy = cy + y2 * perspective;

        // Interactive 2D->3D cursor repulsion
        let hoverGlow = 0;
        if (pointer.active && !prefersReducedMotion) {
          const dx = sx - pointer.px;
          const dy = sy - pointer.py;
          const dist = Math.hypot(dx, dy);
          const radius = 95;
          if (dist < radius && dist > 0.01) {
            const force = (1 - dist / radius) * 6.5;
            hoverGlow = 1 - dist / radius;
            p.vx += (dx / dist) * force * 0.55;
            p.vy += (dy / dist) * force * 0.55;
            p.vz += force * 0.4;
          }
        }

        projected[i] = {
          sx,
          sy,
          scale: perspective,
          z: z2,
          p,
          hoverGlow,
        };
      }

      // Draw subtle glowing connections near pointer
      if (pointer.active) {
        ctx.lineWidth = 0.8;
        for (let i = 0; i < projected.length; i++) {
          const a = projected[i];
          if (a.hoverGlow < 0.15) continue;
          for (let j = i + 1; j < projected.length; j++) {
            const b = projected[j];
            if (b.hoverGlow < 0.1) continue;
            const d = Math.hypot(a.sx - b.sx, a.sy - b.sy);
            if (d < 46) {
              const alpha = (1 - d / 46) * 0.45 * Math.max(a.hoverGlow, b.hoverGlow);
              ctx.strokeStyle = `rgba(227, 237, 51, ${alpha.toFixed(3)})`;
              ctx.beginPath();
              ctx.moveTo(a.sx, a.sy);
              ctx.lineTo(b.sx, b.sy);
              ctx.stroke();
            }
          }
        }
      }

      // Painter's sort back-to-front
      projected.sort((a, b) => b.z - a.z);

      for (let i = 0; i < projected.length; i++) {
        const item = projected[i];
        const depthAlpha = Math.max(0.18, Math.min(1, 1 - (item.z + 180) / 420));
        const r = Math.max(0.8, item.p.size * item.scale * (1 + item.hoverGlow * 0.7));

        if (item.p.isAccent || item.hoverGlow > 0.2) {
          const alpha = Math.min(1, depthAlpha + item.hoverGlow * 0.5);
          ctx.fillStyle = `rgba(227, 237, 51, ${alpha.toFixed(3)})`;
        } else {
          ctx.fillStyle = `rgba(245, 245, 240, ${(depthAlpha * 0.72).toFixed(3)})`;
        }

        ctx.beginPath();
        ctx.arc(item.sx, item.sy, r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!prefersReducedMotion) {
        animId = window.requestAnimationFrame(renderFrame);
      }
    };

    renderFrame();

    return () => {
      if (animId) window.cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      container.removeEventListener("pointermove", onPointerMove);
      container.removeEventListener("pointerleave", onPointerLeave);
      container.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-gsap="hero-artwork"
      className="relative aspect-square w-full overflow-hidden border border-[#242422] bg-[#0e0e0e] md:max-w-134 md:justify-self-center cursor-crosshair select-none"
      aria-label="Interactive 3D architectural particle sculpture"
    >
      {/* Subtle radial spotlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(227,237,51,0.08),transparent_65%)]"
      />

      {/* Corner architectural crosshairs */}
      <span aria-hidden="true" className="pointer-events-none absolute top-3.5 left-4 font-mono text-[12px] text-[#70706b]">
        +
      </span>
      <span aria-hidden="true" className="pointer-events-none absolute top-3.5 right-4 font-mono text-[12px] text-[#70706b]">
        +
      </span>
      <span aria-hidden="true" className="pointer-events-none absolute bottom-3.5 right-4 font-mono text-[12px] text-[#70706b]">
        +
      </span>

      <canvas ref={canvasRef} className="block h-full w-full" />

      {/* Minimal interactive hint */}
      <div className="pointer-events-none absolute bottom-3.5 left-4 flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-[#e3ed33] animate-pulse" />
        <span className="font-mono text-[10px] font-semibold tracking-[1px] text-[#a3a39e] uppercase">
          3D FIELD · MOVE OR CLICK
        </span>
      </div>
    </div>
  );
}
