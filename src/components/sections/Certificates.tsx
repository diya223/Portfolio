import { Award } from "lucide-react";
import { certificates } from "@/data/portfolio";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Certificates() {
  return (
    <section id="certificates" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <AnimatedSection>
          <SectionHeading
            label="Certificates"
            title="Continuous Learning"
            description="Professional certifications from IBM, Coursera, and leading universities."
          />
        </AnimatedSection>

        <div className="grid gap-3 sm:grid-cols-2">
          {certificates.map((cert, i) => (
            <AnimatedSection key={cert} delay={i * 0.05}>
              <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-violet-500/30">
                <Award size={18} className="mt-0.5 shrink-0 text-violet-400" />
                <p className="text-sm text-zinc-300">{cert}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
