import { GraduationCap } from "lucide-react";
import { education } from "@/data/portfolio";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Education() {
  return (
    <section id="education" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <AnimatedSection>
          <SectionHeading
            label="Education"
            title="Academic Background"
          />
        </AnimatedSection>

        <div className="space-y-6">
          {education.map((item, i) => (
            <AnimatedSection key={item.institution} delay={i * 0.1}>
              <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-violet-500/30">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/20">
                  <GraduationCap className="text-violet-400" size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-violet-400">{item.period}</p>
                  <h3 className="mt-1 text-lg font-semibold text-white">{item.degree}</h3>
                  <p className="text-zinc-400">
                    {item.institution}
                    {"location" in item && item.location ? ` · ${item.location}` : ""}
                  </p>
                  <p className="mt-2 text-sm text-zinc-500">{item.description}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
