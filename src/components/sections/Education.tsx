"use client";

import { useRef } from "react";
import { education } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

const pad = (n: number) => String(n).padStart(2, "0");

/** "Sep 2022 – May 2025" → "2022–25" */
function yearSpan(period: string) {
  const years = period.match(/\d{4}/g);
  if (!years) return period;
  const first = years[0];
  const last = years[years.length - 1];
  return first === last ? first : `${first}–${last.slice(2)}`;
}

export function Education() {
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const stack = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      // Tablet/desktop: pin the section and stack the cards on top of each other as you scroll.
      mm.add(MQ.desktopMotion, () => {
        const cards = q("[data-edu-card]");
        if (!stack.current || cards.length === 0) return;

        gsap.set(stack.current, { height: "21rem" });
        gsap.set(cards, { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" });
        gsap.set(cards.slice(1), { yPercent: 115 });

        const tl = gsap.timeline({
          defaults: { ease: "none", duration: 1 },
          scrollTrigger: {
            trigger: panel.current,
            start: "top top",
            end: () => `+=${(cards.length - 1) * 70}%`,
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
          },
        });

        cards.slice(1).forEach((card, i) => {
          tl.to(card, { yPercent: 0 }, i)
            .to(cards[i], { scale: 0.93, yPercent: -4, opacity: 0.45 }, i);
        });
      });

      // Phones: normal stacked list, each card slides up.
      mm.add(MQ.mobileMotion, () => {
        q("[data-edu-card]").forEach((card) => {
          gsap.from(card, {
            autoAlpha: 0,
            y: 36,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: card, start: "top 88%" },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="education" className="relative">
      <div ref={panel} className="flex flex-col justify-center px-6 py-28 md:min-h-screen md:py-16">
        <div className="mx-auto w-full max-w-6xl">
          <SectionHeading index="05" label="Education" title="Academic background" className="mb-12" />

          <div ref={stack} className="relative space-y-4 md:space-y-0">
            {education.map((item, i) => (
              <article
                key={item.institution + item.degree}
                data-edu-card
                className="relative flex flex-col justify-between gap-6 overflow-hidden border border-paper/10 bg-blueprint p-6 sm:p-8 md:flex-row md:items-center md:gap-10"
              >
                <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden />
                <span
                  aria-hidden
                  className="text-outline relative text-6xl font-bold leading-none tracking-tight sm:text-7xl md:text-[6.5rem]"
                >
                  {yearSpan(item.period)}
                </span>
                <div className="relative md:max-w-md md:flex-1">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
                    edu {pad(i + 1)} / {pad(education.length)} · {item.period}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold leading-snug text-paper">{item.degree}</h3>
                  <p className="mt-1 text-paper/60">
                    {item.institution}
                    {"location" in item && item.location ? ` · ${item.location}` : ""}
                  </p>
                  <p className="mt-4 inline-block border border-verified/40 bg-verified/10 px-2.5 py-1 font-mono text-xs text-verified">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
