"use client";

import { useRef } from "react";
import { ArrowDown, Download, Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/SocialIcons";
import { CornerFrame } from "@/components/ui/CornerFrame";
import { siteConfig } from "@/data/portfolio";
import { gsap, SplitText, useGSAP, MQ, scrollToHash } from "@/lib/gsap";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      // 1. Boot sequence — plays once on load.
      mm.add(MQ.motion, () => {
        const conf = { v: 0 };
        const writeConf = () => {
          if (labelRef.current) {
            labelRef.current.textContent = `software_engineer · ${conf.v.toFixed(2)}`;
          }
        };

        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(q("[data-hero-grid-in]"), { autoAlpha: 0, scale: 1.12, duration: 1.6, ease: "power2.out" }, 0)
          .from(q("[data-hero-pill]"), { autoAlpha: 0, y: 14, duration: 0.6 }, 0.25)
          .from(q("[data-hero-eyebrow]"), { autoAlpha: 0, x: -18, duration: 0.6 }, 0.35)
          // the "detection" box locks on after the name has landed
          .from(q("[data-corner]"), { autoAlpha: 0, scale: 2.4, duration: 0.7, stagger: 0.07, ease: "back.out(2)" }, 0.9)
          .from(q("[data-hero-label]"), { autoAlpha: 0, y: 8, duration: 0.4 }, 1.15)
          .to(conf, { v: 0.98, duration: 1.1, ease: "power1.out", onUpdate: writeConf }, 1.15)
          .from(q("[data-hero-rest]"), { autoAlpha: 0, y: 26, stagger: 0.1, duration: 0.7 }, 1.1)
          .from(q("[data-hero-hud]"), { autoAlpha: 0, duration: 0.8 }, 1.6);

        SplitText.create(nameRef.current!, {
          type: "chars,lines",
          mask: "lines",
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.chars, {
              yPercent: 115,
              duration: 1,
              stagger: 0.035,
              ease: "power4.out",
              delay: 0.35,
            });
          },
        });
      });

      // 2a. Wide screens — pin the hero and let scroll zoom the grid while the content recedes.
      mm.add(MQ.desktopMotion, () => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "+=90%",
              scrub: true,
              pin: true,
              anticipatePin: 1,
            },
          })
          .to(q("[data-hero-grid]"), { scale: 1.5, yPercent: -10, duration: 1, ease: "none" }, 0)
          .to(q("[data-hero-glow]"), { scale: 1.8, autoAlpha: 0.4, duration: 1, ease: "none" }, 0)
          .to(q("[data-hero-content]"), { scale: 0.82, autoAlpha: 0, yPercent: -6, duration: 0.8, ease: "none" }, 0.15)
          .to(q("[data-hero-hud]"), { autoAlpha: 0, duration: 0.3, ease: "none" }, 0);
      });

      // 2b. Phones — no pinning, just a gentle grid parallax.
      mm.add(MQ.mobileMotion, () => {
        gsap.to(q("[data-hero-grid]"), {
          yPercent: -15,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="top"
      className="grain relative h-screen min-h-[640px] overflow-hidden"
    >
      {/* Layer 1: blueprint grid (outer = scroll target, inner = intro target) */}
      <div data-hero-grid aria-hidden className="pointer-events-none absolute inset-[-10%]">
        <div
          data-hero-grid-in
          className="blueprint-grid h-full w-full"
          style={{
            maskImage: "radial-gradient(ellipse at center, black 25%, transparent 72%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 25%, transparent 72%)",
          }}
        />
      </div>
      <div
        data-hero-glow
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/[0.07] blur-[140px]"
      />

      {/* Layer 2: content */}
      <div
        data-hero-content
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 pt-16 text-center"
      >
        <div
          data-hero-pill
          className="mb-8 inline-flex items-center gap-2 border border-paper/15 bg-paper/5 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/70"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-verified" />
          Available for opportunities
        </div>

        <p data-hero-eyebrow className="mb-10 font-mono text-sm text-signal">
          {"> hello, world — I'm"}
        </p>

        {/* "Detected" name: bounding box + class label + confidence */}
        <div className="relative px-5 py-4 sm:px-10 sm:py-6">
          <CornerFrame offset={6} />
          <span
            ref={labelRef}
            data-hero-label
            className="absolute -top-2 left-0 -translate-y-full bg-signal px-2 py-0.5 font-mono text-[11px] font-medium text-ink"
          >
            software_engineer · 0.98
          </span>
          <h1 ref={nameRef} className="text-5xl font-bold leading-[0.95] tracking-tight text-paper sm:text-7xl lg:text-8xl">
            {siteConfig.name}
          </h1>
        </div>

        <p
          data-hero-rest
          className="mt-8 font-mono text-xs uppercase tracking-[0.2em] text-paper/70 sm:text-sm"
        >
          {siteConfig.title}
        </p>
        <p data-hero-rest className="mt-5 max-w-2xl text-base text-paper/55 sm:text-lg">
          {siteConfig.tagline}
        </p>

        <div data-hero-rest className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#projects"
            onClick={(e) => {
              if (scrollToHash("#projects")) e.preventDefault();
            }}
            className="bg-signal px-7 py-3 font-mono text-sm font-medium uppercase tracking-wider text-ink transition-colors hover:bg-paper"
          >
            View my work →
          </a>
          <a
            href={siteConfig.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-paper/25 px-7 py-3 font-mono text-sm uppercase tracking-wider text-paper transition-colors hover:border-signal hover:text-signal"
          >
            <Download size={16} />
            Resume
          </a>
        </div>

        <div data-hero-rest className="mt-10 flex items-center gap-6 text-paper/50">
          <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="transition-colors hover:text-signal">
            <GitHubIcon size={20} />
          </a>
          <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="transition-colors hover:text-signal">
            <LinkedInIcon size={20} />
          </a>
          <a href={`mailto:${siteConfig.email}`} aria-label="Email" className="transition-colors hover:text-signal">
            <Mail size={20} />
          </a>
        </div>
      </div>

      {/* HUD readouts */}
      <div
        data-hero-hud
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between px-6 pb-7 font-mono text-[10px] uppercase tracking-[0.18em] text-paper/40 sm:px-10 sm:text-[11px]"
      >
        <span>{siteConfig.location} · 23.02°N 72.57°E</span>
        <span className="flex items-center gap-2 md:invisible">
          scroll
          <ArrowDown size={14} className="animate-bounce" />
        </span>
      </div>
    </section>
  );
}
