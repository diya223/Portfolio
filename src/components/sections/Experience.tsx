"use client";

import { useRef } from "react";
import { experience } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";

const pad = (n: number) => String(n).padStart(2, "0");
const isCurrent = (period: string) => /present/i.test(period);

export function Experience() {
  const root = useRef<HTMLElement>(null);
  const pipeline = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        const line = q("[data-pipe-fill]");
        const head = q("[data-pipe-head]");
        const nodes = q("[data-pipe-node]");

        // Nodes start "idle"; the pipeline lights them as the line reaches them.
        gsap.set(nodes, { backgroundColor: "#0b0f14", scale: 1 });
        gsap.set(head, { top: "0%" });

        // The line draws itself as you scroll through the section.
        gsap.fromTo(
          line,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: pipeline.current,
              start: "top 60%",
              end: "bottom 60%",
              scrub: 0.5,
              onUpdate: (self) => {
                gsap.set(head, { top: `${self.progress * 100}%` });
              },
            },
          },
        );

        nodes.forEach((node) => {
          ScrollTrigger.create({
            trigger: node,
            start: "top 60%",
            onEnter: () => void gsap.to(node, { backgroundColor: "#ff7a3d", scale: 1.3, duration: 0.35, ease: "back.out(2)" }),
            onLeaveBack: () => void gsap.to(node, { backgroundColor: "#0b0f14", scale: 1, duration: 0.3 }),
          });
        });

        // Cards slide in from alternating sides on wide screens, from the right on narrow ones.
        const wide = window.matchMedia("(min-width: 768px)").matches;
        q("[data-job-card]").forEach((card, i) => {
          gsap.from(card, {
            autoAlpha: 0,
            x: wide ? (i % 2 === 0 ? -70 : 70) : 40,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 82%", toggleActions: "play none none reverse" },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="experience" className="relative overflow-x-clip px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="04"
          label="Pipeline"
          title="Where I've worked"
          description="Every role is a stage; the line fills as you move through them."
        />

        <div ref={pipeline} className="relative">
          {/* Spine */}
          <div aria-hidden className="absolute bottom-0 left-5 top-0 w-px bg-paper/10 md:left-1/2">
            <div data-pipe-fill className="absolute inset-0 origin-top bg-signal" />
          </div>
          <div
            aria-hidden
            data-pipe-head
            className="absolute left-5 z-20 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal shadow-[0_0_22px_5px_rgba(255,122,61,0.55)] md:left-1/2"
            style={{ top: "100%" }}
          />

          {experience.map((job, i) => {
            const current = isCurrent(job.period);
            return (
              <div key={job.company + job.role} className="relative grid pb-16 last:pb-0 md:grid-cols-2">
                {/* Node */}
                <span
                  aria-hidden
                  data-pipe-node
                  className="absolute left-5 top-8 z-10 h-4 w-4 -translate-x-1/2 rotate-45 border-2 border-signal bg-signal md:left-1/2"
                />

                <div
                  data-job-card
                  className={`ml-14 md:ml-0 ${i % 2 === 0 ? "md:col-start-1 md:pr-14" : "md:col-start-2 md:pl-14"}`}
                >
                  <div className="border border-paper/10 bg-blueprint/40 p-6 transition-colors hover:border-signal/40">
                    <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em]">
                      <span className="text-paper/40">stage {pad(experience.length - i)}</span>
                      {current ? (
                        <span className="flex items-center gap-1.5 text-verified">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-verified" />
                          running
                        </span>
                      ) : (
                        <span className="text-paper/50">✓ passed</span>
                      )}
                    </div>
                    <p className="mt-4 font-mono text-sm text-signal">{job.period}</p>
                    <h3 className="mt-1 text-xl font-semibold text-paper">{job.role}</h3>
                    <p className="text-paper/60">
                      {job.company}
                      {"location" in job && job.location ? ` · ${job.location}` : ""}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-paper/50">{job.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
