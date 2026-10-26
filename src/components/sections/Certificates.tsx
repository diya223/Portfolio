"use client";

import { useRef } from "react";
import { Award } from "lucide-react";
import { certificates } from "@/data/portfolio";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";

const pad = (n: number) => String(n).padStart(2, "0");

/** "Title (Issuer · Platform)" → { title, issuer } */
function parseCert(cert: string) {
  const m = cert.match(/^(.*?)\s*\((.*)\)\s*$/);
  return m ? { title: m[1], issuer: m[2] } : { title: cert, issuer: "" };
}

export function Certificates() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        const cards = q("[data-cert]");
        gsap.set(cards, { autoAlpha: 0 });

        // Each row of cards gets "stamped" onto the page.
        ScrollTrigger.batch(cards, {
          start: "top 90%",
          once: true,
          onEnter: (batch) => {
            gsap.fromTo(
              batch,
              { autoAlpha: 0, scale: 1.45, rotate: -5 },
              { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.55, ease: "back.out(2.4)", stagger: 0.1 },
            );
            gsap.fromTo(
              batch.map((b) => (b as HTMLElement).querySelector("[data-ring]")),
              { scale: 1, autoAlpha: 0.9 },
              { scale: 2.1, autoAlpha: 0, duration: 0.8, ease: "power2.out", stagger: 0.1, delay: 0.25 },
            );
          },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="certificates" className="relative overflow-x-clip px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          index="06"
          label="Credentials"
          title="Continuous learning"
          description="Professional certifications from IBM, Coursera, and leading universities."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {certificates.map((cert, i) => {
            const { title, issuer } = parseCert(cert);
            return (
              <div
                key={cert}
                data-cert
                className="group relative flex items-start gap-4 border border-paper/10 bg-blueprint/30 p-5 transition-colors hover:border-signal/50"
              >
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center border border-signal/50 text-signal">
                  <span data-ring aria-hidden className="absolute inset-0 border border-signal opacity-0" />
                  <Award size={20} />
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper/35">
                    cert {pad(i + 1)} / {pad(certificates.length)}
                  </p>
                  <p className="mt-1 text-[15px] font-medium leading-snug text-paper">{title}</p>
                  {issuer && <p className="mt-1.5 font-mono text-xs text-verified">{issuer}</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
