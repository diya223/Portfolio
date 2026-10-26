"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP, MQ } from "@/lib/gsap";

type SectionHeadingProps = {
  /** Two-digit section number shown in the mono eyebrow, e.g. "01". */
  index?: string;
  label: string;
  title: string;
  description?: string;
  className?: string;
};

/**
 * Mono eyebrow + masked line-by-line headline + drawn rule.
 * Everything is visible by default; the motion layer only runs when the
 * user has not asked for reduced motion.
 */
export function SectionHeading({ index, label, title, description, className = "mb-14" }: SectionHeadingProps) {
  const root = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        const trigger = { trigger: root.current, start: "top 85%" };

        gsap.from(q("[data-sh-fade]"), {
          autoAlpha: 0,
          x: -18,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.12,
          scrollTrigger: trigger,
        });

        gsap.fromTo(
          q("[data-sh-rule]"),
          { scaleX: 0 },
          { scaleX: 1, duration: 1.2, ease: "power3.inOut", scrollTrigger: trigger },
        );

        SplitText.create(titleRef.current!, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.lines, {
              yPercent: 110,
              duration: 0.9,
              ease: "power4.out",
              stagger: 0.12,
              scrollTrigger: trigger,
            });
          },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className={className}>
      <p
        data-sh-fade
        className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-signal"
      >
        {index ? `${index} — ${label}` : label}
      </p>
      <h2
        ref={titleRef}
        className="text-4xl font-bold leading-[1.05] tracking-tight text-paper sm:text-6xl"
      >
        {title}
      </h2>
      {description && (
        <p data-sh-fade className="mt-4 max-w-xl text-lg text-paper/55">
          {description}
        </p>
      )}
      <div data-sh-rule className="mt-8 h-px w-full origin-left bg-paper/15" />
    </div>
  );
}
