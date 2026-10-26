"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Thin progress bar across the top of the viewport plus a mono % readout.
 * Also refreshes ScrollTrigger once fonts and images have settled so pin
 * positions are measured against the final layout.
 */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);
  const readout = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!bar.current) return;
    const setBar = gsap.quickSetter(bar.current, "scaleX");
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        setBar(self.progress);
        if (readout.current) {
          readout.current.textContent = `${String(Math.round(self.progress * 100)).padStart(3, "0")}%`;
        }
      },
    });
    return () => st.kill();
  });

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  return (
    <>
      <div
        ref={bar}
        aria-hidden
        className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left scale-x-0 bg-signal"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed bottom-5 right-6 z-[60] hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-paper/40 md:flex"
      >
        <span>scroll</span>
        <span ref={readout} className="text-signal">
          000%
        </span>
      </div>
    </>
  );
}
