"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/** Elements that fade/lift in as a group when they enter the viewport. */
const REVEAL_ITEMS = [
  "capabilities-intro",
  "systems-intro",
  "systems-discipline",
  "capability-row",
  "service-row",
  "work-heading",
  "project-card",
  "process-intro",
  "process-stage",
  "principles-heading",
  "principle",
  "audience-intro",
  "audience-point",
  "pricing-heading",
  "pricing-card",
  "cta-masthead",
  "cta-heading",
  "cta-action",
  "footer-contact",
  "work-page-eyebrow",
  "work-page-subheading",
  "work-index-bar",
  "work-project-card",
  "work-project-caption",
  "case-study-header",
  "case-study-section",
  "case-study-card",
] as const;

const g = (name: string) => `[data-gsap="${name}"]`;

/**
 * Smooth scrolling (Lenis) driven by the GSAP ticker, plus scroll-triggered
 * reveals for every `data-gsap` hook in the markup. Everything is skipped when
 * the visitor prefers reduced motion, so native scrolling and static content remain.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  // Lenis lives for the whole session and shares GSAP's ticker.
  useEffect(() => {
    const media = window.matchMedia(REDUCED_MOTION);
    let stop: (() => void) | undefined;

    const start = () => {
      if (lenisRef.current) return;
      const lenis = new Lenis({ autoRaf: false, anchors: true, lerp: 0.1, smoothWheel: true });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      stop = () => {
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
        lenisRef.current = null;
      };
    };
    const onChange = () => {
      if (media.matches) stop?.();
      else start();
    };

    if (!media.matches) start();
    media.addEventListener("change", onChange);
    return () => {
      media.removeEventListener("change", onChange);
      stop?.();
    };
  }, []);

  // Rebuild scroll animations for each route's DOM.
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const present = (selector: string) => document.querySelector(selector) !== null;

      // Hero intro (plays once on load).
      if (present(g("hero-copy"))) {
        gsap
          .timeline({ defaults: { ease: "power3.out", duration: 0.9 } })
          .from(g("hero-eyebrow"), { autoAlpha: 0, y: 12, duration: 0.6 })
          .from(`${g("hero-copy")} > *`, { autoAlpha: 0, y: 36, stagger: 0.1 }, "-=0.3")
          .from(g("hero-artwork"), { autoAlpha: 0, scale: 0.96, duration: 1.1 }, "-=0.8")
          .from(g("hero-rail"), { autoAlpha: 0, y: 12, duration: 0.6 }, "-=0.5");
      }

      // Page headings on the Studio and Services routes.
      [g("studio-heading"), g("services-heading")].forEach((selector) => {
        if (present(selector)) {
          gsap.fromTo(
            selector,
            { autoAlpha: 0, y: 40 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: {
                trigger: selector,
                start: "top 88%",
                end: "bottom top",
                toggleActions: "play reverse play reverse",
              },
            },
          );
        }
      });

      // Work page giant headline: entrance reveal + subtle scroll scrub parallax
      if (present(g("work-page-heading"))) {
        gsap.fromTo(
          g("work-page-heading"),
          { autoAlpha: 0, y: 60 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.1,
            ease: "power3.out",
          }
        );
        gsap.to(g("work-page-heading"), {
          yPercent: 18,
          ease: "none",
          scrollTrigger: {
            trigger: g("work-page-heading"),
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Grouped scroll reveals (triggers both scrolling down and scrolling back up).
      REVEAL_ITEMS.forEach((name) => {
        const selector = g(name);
        if (!present(selector)) return;
        gsap.set(selector, { autoAlpha: 0, y: 40 });
        ScrollTrigger.batch(selector, {
          start: "top 88%",
          end: "bottom 12%",
          onEnter: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.1,
              overwrite: true,
            }),
          onLeave: (batch) =>
            gsap.to(batch, {
              autoAlpha: 0,
              y: -30,
              duration: 0.6,
              ease: "power3.in",
              stagger: 0.05,
              overwrite: true,
            }),
          onEnterBack: (batch) =>
            gsap.to(batch, {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.1,
              overwrite: true,
            }),
          onLeaveBack: (batch) =>
            gsap.to(batch, {
              autoAlpha: 0,
              y: 40,
              duration: 0.6,
              ease: "power3.in",
              stagger: 0.05,
              overwrite: true,
            }),
        });
      });

      // Project imagery: wipe reveal with an inner parallax drift.
      gsap.utils.toArray<HTMLElement>("[data-project-image]").forEach((frame) => {
        gsap.fromTo(
          frame,
          { clipPath: "inset(0 0 100% 0)" },
          {
            clipPath: "inset(0 0 0% 0)",
            duration: 1.1,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: frame,
              start: "top 88%",
              end: "bottom top",
              toggleActions: "play reverse play reverse",
            },
          },
        );
        const image = frame.querySelector("img");
        if (image) {
          gsap.fromTo(
            image,
            { scale: 1.12, yPercent: -5 },
            {
              yPercent: 5,
              ease: "none",
              scrollTrigger: {
                trigger: frame,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        }
      });

      // Footer wordmark rises into view.
      if (present(g("footer-wordmark"))) {
        gsap.fromTo(
          g("footer-wordmark"),
          { autoAlpha: 0, yPercent: 30 },
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: g("footer-wordmark"),
              start: "top 95%",
              end: "bottom top",
              toggleActions: "play reverse play reverse",
            },
          },
        );
      }
    });

    // Layout shifts once fonts load; recalculate trigger positions.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => mm.revert();
  }, [pathname]);

  return <>{children}</>;
}
