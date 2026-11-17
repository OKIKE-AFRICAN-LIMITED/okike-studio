"use client";

import { useEffect, useRef } from "react";

interface Particle3D {
  bx: number;
  by: number;
  bz: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  isCore: boolean;
  phase: number;
}

/**
 * Fallback mathematical OKIKE circular emblem particles while image loads.
 */
function buildFallbackEmblemParticles(): Particle3D[] {
  const particles: Particle3D[] = [];
  const step = 11;
  const maxR = 145;

  for (let y = -maxR; y <= maxR; y += step) {
    for (let x = -maxR; x <= maxR; x += step) {
      const r = Math.hypot(x, y);
      const ax = Math.abs(x);
      const ay = Math.abs(y);

      const inCenter = r <= 34;
      const inInnerRing = r >= 54 && r <= 82 && ax > 16 && ay > 16;
      const inOuterRing = r >= 102 && r <= 145 && ax > 28 && ay > 28;

      if (!inCenter && !inInnerRing && !inOuterRing) continue;

      for (const bz of [-14, 0, 14]) {
        particles.push({
          bx: x,
          by: y,
          bz,
          x: x * 1.4,
          y: y * 1.4,
          z: bz,
          vx: 0,
          vy: 0,
          vz: 0,
          size: bz === 0 ? 2.4 : 1.8,
          isCore: bz >= 0,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }
  }
  return particles;
}

/**
 * Samples the actual OKIKE emblem from /navigation/okike-logo.png into 3D particles.
 */
function sampleLogoFromImage(img: HTMLImageElement): Particle3D[] {
  const sampleH = 120;
  const scale = sampleH / Math.max(1, img.naturalHeight);
  const sampleW = Math.max(sampleH, Math.round(img.naturalWidth * scale));

  const offscreen = document.createElement("canvas");
  offscreen.width = sampleW;
  offscreen.height = sampleH;
  const octx = offscreen.getContext("2d");
  if (!octx) return buildFallbackEmblemParticles();

  octx.clearRect(0, 0, sampleW, sampleH);
  octx.drawImage(img, 0, 0, sampleW, sampleH);

  const imgData = octx.getImageData(0, 0, sampleW, sampleH).data;

  // Detect the horizontal end of the left emblem (first empty column gap after emblem pixels)
  let foundEmblem = false;
  let emblemEndX = sampleH;
  for (let x = 0; x < sampleW; x++) {
    let colHasInk = false;
    for (let y = 0; y < sampleH; y++) {
      const idx = (y * sampleW + x) * 4;
      if (imgData[idx + 3] > 90) {
        colHasInk = true;
        break;
      }
    }
    if (colHasInk) {
      foundEmblem = true;
    } else if (foundEmblem && x > sampleH * 0.5) {
      emblemEndX = x;
      break;
    }
  }

  // Find bounding box of emblem pixels
  let minX = emblemEndX;
  let maxX = 0;
  let minY = sampleH;
  let maxY = 0;
  for (let y = 0; y < sampleH; y++) {
    for (let x = 0; x < emblemEndX; x++) {
      const idx = (y * sampleW + x) * 4;
      if (imgData[idx + 3] > 90) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const boxW = Math.max(1, maxX - minX);
  const boxH = Math.max(1, maxY - minY);
  const cx = minX + boxW / 2;
  const cy = minY + boxH / 2;
  const normScale = 240 / Math.max(boxW, boxH);

  const particles: Particle3D[] = [];
  const step = 3;

  for (let y = minY; y <= maxY; y += step) {
    for (let x = minX; x <= maxX; x += step) {
      const idx = (y * sampleW + x) * 4;
      const alpha = imgData[idx + 3];
      if (alpha < 110) continue;

      const bx = (x - cx) * normScale;
      const by = (y - cy) * normScale;

      const zPlanes = [-14, 0, 14];
      for (const bz of zPlanes) {
        if (bz !== 0 && Math.random() > 0.55) continue;
        particles.push({
          bx,
          by,
          bz,
          x: bx + (Math.random() - 0.5) * 35,
          y: by + (Math.random() - 0.5) * 35,
          z: bz + (Math.random() - 0.5) * 35,
          vx: 0,
          vy: 0,
          vz: 0,
          size: bz === 0 ? 2.4 : 1.8,
          isCore: bz >= 0,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }
  }

  return particles.length > 0 ? particles : buildFallbackEmblemParticles();
}

export function HeroParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Attach pointer tracking to the full hero <section> so particles never clip or block clicks
    const interactionTarget = container.closest("section") || container;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let particles: Particle3D[] = buildFallbackEmblemParticles();
    let isDisposed = false;

    const logoImg = new window.Image();
    logoImg.src = "/navigation/okike-logo.png";
    logoImg.onload = () => {
      if (!isDisposed) {
        particles = sampleLogoFromImage(logoImg);
      }
    };

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animId = 0;

    const pointer = {
      nx: 0,
      ny: 0,
      px: -9999,
      py: -9999,
      active: false,
      pulse: 0,
    };

    let rotY = 0;
    let rotX = 0;
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

    const onPointerMove = (e: Event) => {
      const pe = e as PointerEvent;
      const rect = container.getBoundingClientRect();
      const x = pe.clientX - rect.left;
      const y = pe.clientY - rect.top;
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

    interactionTarget.addEventListener("pointermove", onPointerMove);
    interactionTarget.addEventListener("pointerleave", onPointerLeave);
    interactionTarget.addEventListener("pointerdown", onPointerDown);

    const renderFrame = () => {
      if (!prefersReducedMotion) {
        time += 0.018;
      }

      const idleSwingY = prefersReducedMotion ? 0 : Math.sin(time * 0.7) * 0.22;
      const idleSwingX = prefersReducedMotion ? 0 : Math.cos(time * 0.5) * 0.1;
      const targetRotY = idleSwingY + pointer.nx * 0.45;
      const targetRotX = idleSwingX - pointer.ny * 0.3;

      rotY += (targetRotY - rotY) * 0.08;
      rotX += (targetRotX - rotX) * 0.08;

      if (pointer.pulse > 0.005) {
        pointer.pulse *= 0.9;
      } else {
        pointer.pulse = 0;
      }

      ctx.clearRect(0, 0, width, height);

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      // Position emblem cleanly on the right side on desktop, lower-center on mobile
      const isDesktop = width >= 1024;
      const cx = isDesktop ? width * 0.74 : width * 0.5;
      const cy = isDesktop ? height * 0.48 : height - 175;
      const baseDim = isDesktop ? Math.min(width * 0.4, height * 0.78) : Math.min(width * 0.76, 300);
      const fov = baseDim * 1.15;
      const cameraDist = 420;
      const scaleFactor = baseDim / 360;

      const projected: Array<{
        sx: number;
        sy: number;
        scale: number;
        z: number;
        p: Particle3D;
        hoverGlow: number;
      }> = new Array(particles.length);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        const floatZ = !prefersReducedMotion ? Math.sin(time * 1.5 + p.phase) * 3 : 0;
        const pulseScale = 1 + pointer.pulse * 0.28;

        const tx = p.bx * scaleFactor * pulseScale;
        const ty = p.by * scaleFactor * pulseScale;
        const tz = (p.bz + floatZ) * scaleFactor * pulseScale;

        p.vx += (tx - p.x) * 0.11;
        p.vy += (ty - p.y) * 0.11;
        p.vz += (tz - p.z) * 0.11;

        p.vx *= 0.78;
        p.vy *= 0.78;
        p.vz *= 0.78;

        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.y * sinX;

        const perspective = fov / Math.max(90, cameraDist + z2);
        const sx = cx + x1 * perspective;
        const sy = cy + y2 * perspective;

        let hoverGlow = 0;
        if (pointer.active && !prefersReducedMotion) {
          const dx = sx - pointer.px;
          const dy = sy - pointer.py;
          const dist = Math.hypot(dx, dy);
          const radius = 95;
          if (dist < radius && dist > 0.01) {
            const force = (1 - dist / radius) * 8.0;
            hoverGlow = 1 - dist / radius;
            p.vx += (dx / dist) * force * 0.65;
            p.vy += (dy / dist) * force * 0.65;
            p.vz += force * 0.55;
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

      if (pointer.active) {
        ctx.lineWidth = 0.9;
        for (let i = 0; i < projected.length; i++) {
          const a = projected[i];
          if (a.hoverGlow < 0.25) continue;
          for (let j = i + 1; j < projected.length; j += 2) {
            const b = projected[j];
            if (b.hoverGlow < 0.2) continue;
            const d = Math.hypot(a.sx - b.sx, a.sy - b.sy);
            if (d < 34) {
              const alpha = (1 - d / 34) * 0.65 * Math.max(a.hoverGlow, b.hoverGlow);
              ctx.strokeStyle = `rgba(182, 198, 10, ${alpha.toFixed(3)})`;
              ctx.beginPath();
              ctx.moveTo(a.sx, a.sy);
              ctx.lineTo(b.sx, b.sy);
              ctx.stroke();
            }
          }
        }
      }

      projected.sort((a, b) => b.z - a.z);

      for (let i = 0; i < projected.length; i++) {
        const item = projected[i];
        const depthAlpha = Math.max(0.28, Math.min(0.95, 1 - (item.z + 60) / 180));
        const r = Math.max(1.0, item.p.size * item.scale * (1 + item.hoverGlow * 0.45));

        if (item.hoverGlow > 0.25) {
          ctx.fillStyle = `rgba(182, 198, 10, ${Math.min(1, 0.55 + item.hoverGlow * 0.45).toFixed(3)})`;
        } else if (item.p.isCore) {
          ctx.fillStyle = `rgba(14, 14, 14, ${depthAlpha.toFixed(3)})`;
        } else {
          ctx.fillStyle = `rgba(75, 75, 70, ${(depthAlpha * 0.65).toFixed(3)})`;
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
      isDisposed = true;
      if (animId) window.cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      interactionTarget.removeEventListener("pointermove", onPointerMove);
      interactionTarget.removeEventListener("pointerleave", onPointerLeave);
      interactionTarget.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-gsap="hero-artwork"
      className="pointer-events-none absolute inset-0 z-0 overflow-visible select-none"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
