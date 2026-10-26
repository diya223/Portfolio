"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText, useGSAP);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/** Media queries shared by every section so motion rules stay consistent. */
export const MQ = {
  /** Any size, user has not asked for reduced motion. */
  motion: "(prefers-reduced-motion: no-preference)",
  /** Tablets and up: horizontal rail, card stack. */
  desktopMotion: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
  /** Large screens only: sections tall enough to pin comfortably. */
  wideMotion: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  /** Phones and small tablets: lighter reveals, nothing pinned. */
  narrowMotion: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
  /** Phones only. */
  mobileMotion: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
} as const;

/** Smooth-scroll to a `#hash` target. Returns false when the target is not on this page. */
export function scrollToHash(hash: string): boolean {
  const target = document.querySelector(hash);
  if (!target) return false;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  gsap.to(window, {
    scrollTo: { y: target, autoKill: true },
    duration: reduce ? 0 : 1.4,
    ease: "power3.inOut",
  });
  return true;
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
