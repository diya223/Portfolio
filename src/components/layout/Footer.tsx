"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUp, Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/SocialIcons";
import { siteConfig } from "@/data/portfolio";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

export function Footer() {
  const root = useRef<HTMLElement>(null);
  const year = new Date().getFullYear();

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        // Giant outlined name slides sideways as the footer scrolls into view.
        gsap.fromTo(
          q("[data-footer-name]"),
          { xPercent: 12 },
          {
            xPercent: -12,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: true },
          },
        );
        gsap.from(q("[data-footer-bar]"), {
          autoAlpha: 0,
          y: 20,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: root.current, start: "top 85%" },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="relative overflow-hidden border-t border-paper/10 bg-ink pt-16">
      <div aria-hidden className="pointer-events-none select-none overflow-hidden">
        <p
          data-footer-name
          className="text-outline whitespace-nowrap text-center text-[18vw] font-bold uppercase leading-[0.85] tracking-tighter"
        >
          {siteConfig.name}
        </p>
      </div>

      <div
        data-footer-bar
        className="relative mx-auto mt-10 flex max-w-6xl flex-col items-center justify-between gap-6 px-6 pb-10 sm:flex-row"
      >
        <div className="text-center sm:text-left">
          <p className="flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-verified sm:justify-start">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-verified" />
            connection established
          </p>
          <p className="mt-2 text-sm text-paper/45">
            © {year} {siteConfig.name}. Built with Next.js, GSAP &amp; Supabase.
          </p>
        </div>

        <div className="flex items-center gap-5">
          <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-paper/50 transition-colors hover:text-signal">
            <GitHubIcon size={20} />
          </a>
          <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-paper/50 transition-colors hover:text-signal">
            <LinkedInIcon size={20} />
          </a>
          <a href={`mailto:${siteConfig.email}`} aria-label="Email" className="text-paper/50 transition-colors hover:text-signal">
            <Mail size={20} />
          </a>
          <Link href="/blog" className="font-mono text-xs uppercase tracking-wider text-paper/50 transition-colors hover:text-signal">
            Blog
          </Link>
          <button
            type="button"
            aria-label="Back to top"
            onClick={() => gsap.to(window, { scrollTo: 0, duration: 1.6, ease: "power3.inOut" })}
            className="flex h-9 w-9 items-center justify-center border border-paper/20 text-paper/60 transition-colors hover:border-signal hover:text-signal"
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
}
