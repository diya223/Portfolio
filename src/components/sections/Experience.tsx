import { Briefcase } from "lucide-react";
import { experience } from "@/data/portfolio";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Experience() {
  return (
    <section id="experience" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <AnimatedSection>
          <SectionHeading
            label="Experience"
            title="Where I've Worked"
            description="My professional journey so far."
          />
        </AnimatedSection>

        <div className="relative space-y-8 before:absolute before:left-[19px] before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-gradient-to-b before:from-violet-500 before:to-fuchsia-500/20 md:before:left-1/2 md:before:-translate-x-px">
          {experience.map((job, i) => (
            <AnimatedSection key={job.company + job.role} delay={i * 0.1}>
              <div
                className={`relative flex flex-col gap-4 md:flex-row md:items-start ${
                  i % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="hidden md:block md:w-1/2" />
                <div className="absolute left-0 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-violet-500/50 bg-[#0a0a0f] md:left-1/2 md:-translate-x-1/2">
                  <Briefcase size={16} className="text-violet-400" />
                </div>
                <div
                  className={`ml-14 md:ml-0 md:w-1/2 ${
                    i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                  }`}
                >
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-violet-500/30">
                    <p className="text-sm font-medium text-violet-400">{job.period}</p>
                    <h3 className="mt-1 text-lg font-semibold text-white">{job.role}</h3>
                    <p className="text-zinc-400">
                      {job.company}
                      {"location" in job && job.location ? ` · ${job.location}` : ""}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                      {job.description}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
