import { about, siteConfig } from "@/data/portfolio";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function About() {
  return (
    <section id="about" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <AnimatedSection>
          <SectionHeading
            label="About"
            title="Who I Am"
            description="A little about my background and what drives me."
          />
        </AnimatedSection>

        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <AnimatedSection delay={0.1}>
            <div className="relative">
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 blur-xl" />
              <div className="relative flex aspect-square max-w-sm items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-violet-950/50 to-fuchsia-950/50">
                <span className="text-8xl font-bold text-white/10">{siteConfig.initials}</span>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="text-lg leading-relaxed text-zinc-300">{about.bio}</p>
            <ul className="mt-8 space-y-3">
              {about.highlights.map((item) => (
                <li key={item} className="flex items-center gap-3 text-zinc-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                  {item}
                </li>
              ))}
            </ul>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
