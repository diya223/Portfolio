"use client";

import { useRef } from "react";
import { about, certificates, experience, projects, siteConfig } from "@/data/portfolio";
import { CornerFrame } from "@/components/ui/CornerFrame";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { gsap, SplitText, useGSAP, MQ } from "@/lib/gsap";

const stats = [
  { label: "Builds logged", value: projects.length },
  { label: "Roles held", value: experience.length },
  { label: "Certificates", value: certificates.length },
];

const pad = (n: number) => String(n).padStart(2, "0");

export function About() {
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const bio = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      // Large screens: pin the section; scroll "reads" the bio word by word, then logs the highlights.
      mm.add(MQ.wideMotion, () => {
        const split = SplitText.create(bio.current!, { type: "words" });
        gsap.set(split.words, { opacity: 0.14 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel.current,
            start: "top top",
            end: "+=150%",
            scrub: 0.6,
            pin: true,
            anticipatePin: 1,
          },
        });

        tl.from(q("[data-about-card]"), { autoAlpha: 0, y: 40, duration: 0.5, ease: "power2.out" }, 0);

        q("[data-count]").forEach((el) => {
          const target = Number((el as HTMLElement).dataset.count);
          const o = { v: 0 };
          tl.to(
            o,
            {
              v: target,
              duration: 1.4,
              ease: "none",
              onUpdate: () => {
                el.textContent = pad(Math.round(o.v));
              },
            },
            0.3,
          );
        });

        tl.to(split.words, { opacity: 1, stagger: 0.05, duration: 0.2, ease: "none" }, 0.2).from(
          q("[data-log]"),
          { autoAlpha: 0, x: -28, stagger: 0.35, duration: 0.5, ease: "power2.out" },
          ">-0.3",
        );

        return () => split.revert();
      });

      // Smaller screens: no pin, same word-by-word reading effect tied to the paragraph's travel.
      mm.add(MQ.narrowMotion, () => {
        const split = SplitText.create(bio.current!, { type: "words" });
        gsap.set(split.words, { opacity: 0.14 });
        gsap.to(split.words, {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: { trigger: bio.current, start: "top 85%", end: "bottom 55%", scrub: true },
        });
        gsap.from(q("[data-log]"), {
          autoAlpha: 0,
          x: -20,
          stagger: 0.12,
          duration: 0.5,
          scrollTrigger: { trigger: q("[data-log]")[0], start: "top 90%" },
        });
        gsap.from(q("[data-about-card]"), {
          autoAlpha: 0,
          y: 30,
          duration: 0.7,
          scrollTrigger: { trigger: q("[data-about-card]")[0], start: "top 88%" },
        });
        return () => split.revert();
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" className="relative">
      <div ref={panel} className="relative flex items-center px-6 py-24 lg:min-h-screen">
        <div className="mx-auto w-full max-w-6xl">
          <SectionHeading
            index="01"
            label="About"
            title="Who I Am"
            description="A little about my background and what drives me."
            className="mb-12"
          />

          <div className="grid gap-14 lg:grid-cols-[1fr_1.45fr] lg:items-start lg:gap-16">
            <div data-about-card className="mx-auto w-full max-w-sm">
              <div className="relative aspect-square border border-paper/10 bg-blueprint/40">
                <CornerFrame />
                <div className="absolute inset-0 blueprint-grid opacity-60" />
                <span className="text-outline absolute inset-0 flex items-center justify-center text-[8rem] font-bold leading-none">
                  {siteConfig.initials}
                </span>
                <span className="absolute left-3 top-3 bg-signal px-1.5 py-0.5 font-mono text-[10px] font-medium text-ink">
                  id: {siteConfig.name.split(" ")[0].toLowerCase()}
                </span>
                <span className="absolute bottom-3 right-3 font-mono text-[10px] uppercase tracking-widest text-paper/40">
                  {siteConfig.location}
                </span>
              </div>

              <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-paper/10 pt-6">
                {stats.map((s) => (
                  <div key={s.label}>
                    <dt className="font-mono text-[10px] uppercase tracking-widest text-paper/40">{s.label}</dt>
                    <dd data-count={s.value} className="mt-1 font-mono text-3xl font-bold text-signal">
                      {pad(s.value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <p ref={bio} className="text-xl leading-relaxed text-paper sm:text-2xl">
                {about.bio}
              </p>
              <ul className="mt-10 space-y-3 font-mono text-sm">
                {about.highlights.map((item) => (
                  <li key={item} data-log className="flex gap-3 text-paper/70">
                    <span className="text-verified">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
