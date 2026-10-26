"use client";

import { useRef } from "react";
import { skills } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";

const pad = (n: number) => String(n).padStart(2, "0");

const allSkills = skills.flatMap((g) => g.items);
const half = Math.ceil(allSkills.length / 2);
const rows = [allSkills.slice(0, half), allSkills.slice(half)];

export function Skills() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        // --- Marquee: two rows in opposite directions; scroll velocity speeds them up and skews them ---
        const rowEls = q("[data-marquee-row]");
        const loops = rowEls.map((row, i) => {
          const inner = row.querySelector("[data-marquee-inner]");
          const reverse = i % 2 === 1;
          return gsap.fromTo(
            inner,
            { xPercent: reverse ? -50 : 0 },
            { xPercent: reverse ? 0 : -50, duration: 45, ease: "none", repeat: -1 },
          );
        });

        const skew = { v: 0 };
        const setSkew = gsap.quickSetter(rowEls, "skewX", "deg");
        const clampSkew = gsap.utils.clamp(-8, 8);
        const velocityST = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const v = self.getVelocity();
            const target = clampSkew(v / -300);
            if (Math.abs(target) > Math.abs(skew.v)) {
              skew.v = target;
              gsap.to(skew, { v: 0, duration: 0.8, ease: "power3", overwrite: true, onUpdate: () => setSkew(skew.v) });
            }
            const boost = 1 + Math.min(Math.abs(v) / 400, 5);
            loops.forEach((l) => {
              gsap.to(l, { timeScale: boost, duration: 0.2, overwrite: true, onComplete: () => void gsap.to(l, { timeScale: 1, duration: 1.2 }) });
            });
          },
        });

        // --- Category cards: clip-path wipe, then chips pop in ---
        q("[data-skill-card]").forEach((card) => {
          const chips = card.querySelectorAll("[data-chip]");
          const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: "top 88%" } });
          tl.fromTo(
            card,
            { clipPath: "inset(0 100% 0 0)" },
            { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power3.inOut" },
          ).from(chips, { autoAlpha: 0, scale: 0.6, y: 10, stagger: 0.03, duration: 0.4, ease: "back.out(2)" }, 0.45);
        });

        return () => {
          velocityST.kill();
          loops.forEach((l) => l.kill());
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="skills" className="relative overflow-hidden py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          index="03"
          label="Stack"
          title="Technologies I work with"
          description="Tools and languages I use to bring ideas to life."
        />
      </div>

      {/* Marquee band (decorative: the same skills are listed below) */}
      <div aria-hidden className="my-4 space-y-2 border-y border-paper/10 py-5">
        {rows.map((items, r) => (
          <div key={r} data-marquee-row className="overflow-hidden">
            <div data-marquee-inner className="flex w-max">
              {[...items, ...items].map((item, i) => (
                <span
                  key={`${item}-${i}`}
                  className={`flex items-center gap-8 pr-8 text-5xl font-bold uppercase tracking-tight sm:text-7xl ${
                    r === 0 ? "text-outline" : "text-paper/80"
                  }`}
                >
                  {item}
                  <span className="text-2xl text-signal sm:text-4xl">✦</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-16 max-w-6xl px-6">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {skills.map((group, i) => (
            <div
              key={group.category}
              data-skill-card
              className="border border-paper/10 bg-blueprint/30 p-6 transition-colors hover:border-signal/40"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
                [{pad(i + 1)}] · {pad(group.items.length)} tools
              </p>
              <h3 className="mb-5 mt-2 text-lg font-semibold text-paper">{group.category}</h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <span
                    key={skill}
                    data-chip
                    className="border border-paper/10 bg-paper/5 px-2.5 py-1 font-mono text-xs text-paper/75 transition-colors hover:border-signal/50 hover:text-signal"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
