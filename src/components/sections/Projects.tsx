"use client";

import { useRef } from "react";
import { ExternalLink } from "lucide-react";
import { GitHubIcon } from "@/components/ui/SocialIcons";
import { CornerFrame } from "@/components/ui/CornerFrame";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { projects } from "@/data/portfolio";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

const pad = (n: number) => String(n).padStart(2, "0");

export function Projects() {
  const root = useRef<HTMLElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  const indexed = projects.map((p, i) => ({ ...p, index: i + 1 }));
  const featured = indexed.filter((p) => p.featured);
  const rest = indexed.filter((p) => !p.featured);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      // Secondary grid: simple reveal at every size (when motion is allowed).
      mm.add(MQ.motion, () => {
        gsap.from(q("[data-rest-card]"), {
          autoAlpha: 0,
          y: 28,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: { trigger: q("[data-rest-grid]")[0], start: "top 85%" },
        });
      });

      // Tablet/desktop: pin the panel, scroll drives the cards sideways.
      mm.add(MQ.desktopMotion, () => {
        const t = track.current!;
        const p = panel.current!;
        gsap.set(p, { overflow: "hidden" });
        gsap.set(t, { overflowX: "visible" });

        const distance = () => Math.max(0, t.scrollWidth - window.innerWidth);

        const rail = gsap.to(t, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: p,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (fill.current) fill.current.style.transform = `scaleX(${self.progress})`;
              if (counter.current) {
                const n = Math.round(self.progress * (featured.length - 1)) + 1;
                counter.current.textContent = `${pad(n)} / ${pad(featured.length)}`;
              }
            },
          },
        });

        q("[data-feat-card]").forEach((card, i) => {
          // card tilts in as it enters from the right
          gsap.from(card, {
            autoAlpha: 0,
            y: 50,
            rotateZ: i % 2 === 0 ? -1.5 : 1.5,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: rail,
              start: "left 92%",
              end: "left 55%",
              scrub: true,
            },
          });
          // oversized index numeral drifts against the scroll direction (parallax)
          gsap.fromTo(
            card.querySelector("[data-feat-num]"),
            { xPercent: 25 },
            {
              xPercent: -25,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                containerAnimation: rail,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });
      });

      // Phones: native horizontal swipe row, cards just fade up.
      mm.add(MQ.mobileMotion, () => {
        gsap.from(q("[data-feat-card]"), {
          autoAlpha: 0,
          y: 30,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: { trigger: track.current, start: "top 85%" },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="projects" ref={root} className="relative bg-ink">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blueprint-grid absolute inset-0 opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink" />
      </div>

      {/* Pinned panel: heading + rail */}
      <div ref={panel} className="relative z-10 flex min-h-screen flex-col justify-center py-24 md:py-12">
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              index="02"
              label="Build log"
              title="Things I've shipped"
              description="Selected builds, logged and tagged. Keep scrolling — the rail moves with you."
              className="mb-10 flex-1"
            />
            <div className="mb-10 hidden items-center gap-3 font-mono text-xs text-paper/50 md:flex">
              <span ref={counter} className="text-signal">
                01 / {pad(featured.length)}
              </span>
              <span className="h-px w-12 bg-paper/20" />
              <span>scroll</span>
            </div>
          </div>
        </div>

        <div
          ref={track}
          className="flex gap-6 overflow-x-auto px-6 pb-4 will-change-transform [scrollbar-width:none] md:overflow-x-auto md:px-[10vw]"
        >
          {featured.map((project) => (
            <article
              key={project.title}
              data-feat-card
              className="relative flex h-[26rem] w-[85vw] shrink-0 flex-col justify-between overflow-visible border border-paper/10 bg-blueprint/60 p-7 backdrop-blur-sm transition-colors hover:border-signal/50 sm:w-[60vw] md:h-[min(26rem,52vh)] md:w-[62vw] lg:w-[44vw]"
            >
              <CornerFrame />
              <span
                data-feat-num
                aria-hidden
                className="text-outline pointer-events-none absolute -top-4 right-4 select-none text-[7rem] font-bold leading-none"
              >
                {pad(project.index)}
              </span>

              <div className="relative">
                <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-verified">
                  <span className="h-1.5 w-1.5 rounded-full bg-verified" />
                  Shipped
                </span>
                <h3 className="mt-14 text-2xl font-bold leading-snug text-paper sm:text-[1.7rem]">
                  {project.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-paper/60">{project.description}</p>
              </div>

              <div className="relative">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-paper/15 bg-paper/5 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-paper/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {(project.github || project.live) && (
                  <div className="mt-5 flex gap-5">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-paper/70 transition-colors hover:text-signal"
                      >
                        <GitHubIcon size={16} /> Code
                      </a>
                    )}
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm text-paper/70 transition-colors hover:text-signal"
                      >
                        <ExternalLink size={16} /> Live
                      </a>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
          <div aria-hidden className="hidden w-[6vw] shrink-0 md:block" />
        </div>

        <div className="mx-auto mt-6 hidden w-full max-w-6xl px-6 md:block">
          <div className="h-px w-full bg-paper/10">
            <div ref={fill} className="h-px w-full origin-left scale-x-0 bg-signal" />
          </div>
        </div>
      </div>

      {/* Remaining builds */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-28 pt-16">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-paper/40">{"// more builds"}</p>
        <div data-rest-grid className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((project) => (
            <article
              key={project.title}
              data-rest-card
              className="group relative flex flex-col border border-paper/10 bg-blueprint/20 p-5 transition-colors hover:border-signal/50 hover:bg-blueprint/40"
            >
              <span className="font-mono text-[11px] text-signal">P{pad(project.index)}</span>
              <h4 className="mt-3 font-semibold text-paper transition-colors group-hover:text-signal">
                {project.title}
              </h4>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-paper/50">{project.description}</p>
              <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
                {project.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="font-mono text-[10px] uppercase tracking-wide text-paper/40">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
