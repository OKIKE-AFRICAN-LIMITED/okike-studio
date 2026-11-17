"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

export function FooterGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const footerEl = wrapper.closest("footer");

    let width = wrapper.offsetWidth || 760;
    let phi = 4.2; // Start centered nicely over Africa / Europe / Americas
    let targetTheta = 0.22;
    let theta = 0.22;
    let animId = 0;

    const onResize = () => {
      if (wrapper) {
        width = wrapper.offsetWidth || 760;
      }
    };
    window.addEventListener("resize", onResize);

    const onPointerMove = (e: Event) => {
      if (!footerEl || prefersReducedMotion) return;
      const pe = e as PointerEvent;
      const rect = footerEl.getBoundingClientRect();
      const ny = (pe.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
      targetTheta = 0.22 + ny * 0.25;
    };

    footerEl?.addEventListener("pointermove", onPointerMove);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: width * dpr,
      height: width * dpr,
      phi,
      theta,
      dark: 1,
      diffuse: 1.4,
      mapSamples: 18000,
      mapBrightness: 6.5,
      mapBaseBrightness: 0.05,
      baseColor: [0.16, 0.16, 0.15],
      markerColor: [0.89, 0.93, 0.2],
      glowColor: [0.14, 0.15, 0.11],
      opacity: 0.85,
      markers: [
        { location: [6.5244, 3.3792], size: 0.075 }, // Lagos
        { location: [51.5074, -0.1278], size: 0.06 }, // London
        { location: [40.7128, -74.006], size: 0.055 }, // New York
        { location: [25.2048, 55.2708], size: 0.05 }, // Dubai
        { location: [35.6762, 139.6503], size: 0.05 }, // Tokyo
      ],
      arcs: [
        { from: [6.5244, 3.3792], to: [51.5074, -0.1278] },
        { from: [6.5244, 3.3792], to: [40.7128, -74.006] },
        { from: [6.5244, 3.3792], to: [25.2048, 55.2708] },
        { from: [51.5074, -0.1278], to: [35.6762, 139.6503] },
      ],
      arcColor: [0.89, 0.93, 0.2],
      arcWidth: 0.5,
      arcHeight: 0.28,
    });

    const tick = () => {
      if (!prefersReducedMotion) {
        phi += 0.0028;
        theta += (targetTheta - theta) * 0.05;
        globe.update({
          phi,
          theta,
          width: width * dpr,
          height: width * dpr,
        });
        animId = window.requestAnimationFrame(tick);
      }
    };

    if (!prefersReducedMotion) {
      animId = window.requestAnimationFrame(tick);
    }

    return () => {
      if (animId) window.cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      footerEl?.removeEventListener("pointermove", onPointerMove);
      globe.destroy();
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className="pointer-events-none absolute -right-28 -bottom-40 z-0 aspect-square w-[520px] opacity-55 md:-right-24 md:-bottom-56 md:w-[740px] lg:-right-16 lg:-bottom-64 lg:w-[900px]"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
