"use client";

import { FormEvent, useRef, useState } from "react";
import { Loader2, Mail, MapPin, Phone, Send } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/SocialIcons";
import { siteConfig } from "@/data/portfolio";
import { gsap, SplitText, useGSAP, MQ } from "@/lib/gsap";

const fieldClass =
  "w-full border border-paper/15 bg-blueprint/30 px-4 py-3 text-paper placeholder-paper/25 outline-none transition-colors focus:border-signal focus:bg-blueprint/50";
const labelClass = "mb-1.5 block font-mono text-xs uppercase tracking-[0.18em] text-paper/50";

export function Contact() {
  const root = useRef<HTMLElement>(null);
  const bigRef = useRef<HTMLHeadingElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        // Closing statement: characters rise and the whole block scales up as it reaches the viewport.
        SplitText.create(bigRef.current!, {
          type: "chars,lines",
          mask: "lines",
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.chars, {
              yPercent: 110,
              stagger: 0.02,
              ease: "none",
              scrollTrigger: { trigger: bigRef.current, start: "top 90%", end: "top 40%", scrub: true },
            });
          },
        });

        gsap.fromTo(
          bigRef.current,
          { scale: 0.82, transformOrigin: "left center" },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: bigRef.current, start: "top 95%", end: "top 35%", scrub: true },
          },
        );

        gsap.from(q("[data-contact-info]"), {
          autoAlpha: 0,
          x: -24,
          stagger: 0.1,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: q("[data-contact-info]")[0], start: "top 88%" },
        });

        gsap.from(q("[data-form-field]"), {
          autoAlpha: 0,
          y: 30,
          stagger: 0.12,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: q("[data-form]")[0], start: "top 80%" },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Something went wrong");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Failed to send message");
    }
  }

  return (
    <section ref={root} id="contact" className="relative overflow-hidden px-6 pb-28 pt-32">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="blueprint-grid absolute inset-0 opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink" />
        <div className="absolute -right-40 top-1/3 h-[32rem] w-[32rem] rounded-full bg-signal/[0.06] blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-signal">07 — Contact</p>
        <h2
          ref={bigRef}
          className="text-5xl font-bold leading-[0.98] tracking-tight text-paper sm:text-7xl lg:text-[7rem]"
        >
          Let&apos;s build something together.
        </h2>

        <div className="mt-20 grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <p data-contact-info className="max-w-sm text-lg text-paper/55">
              Have a project in mind or just want to say hi? Drop me a message — I read everything.
            </p>
            <a
              data-contact-info
              href={`mailto:${siteConfig.email}`}
              className="flex items-center gap-3 font-mono text-sm text-paper/80 transition-colors hover:text-signal"
            >
              <Mail size={18} className="text-signal" /> {siteConfig.email}
            </a>
            <a
              data-contact-info
              href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-3 font-mono text-sm text-paper/80 transition-colors hover:text-signal"
            >
              <Phone size={18} className="text-signal" /> {siteConfig.phone}
            </a>
            <p data-contact-info className="flex items-center gap-3 font-mono text-sm text-paper/80">
              <MapPin size={18} className="text-signal" /> {siteConfig.location}
            </p>
            <div data-contact-info className="flex items-center gap-5 pt-2 text-paper/50">
              <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="transition-colors hover:text-signal">
                <GitHubIcon size={22} />
              </a>
              <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="transition-colors hover:text-signal">
                <LinkedInIcon size={22} />
              </a>
            </div>
          </div>

          <form data-form onSubmit={handleSubmit} className="space-y-5">
            <div data-form-field>
              <label htmlFor="name" className={labelClass}>
                {"> name"}
              </label>
              <input id="name" name="name" type="text" required className={fieldClass} placeholder="Your name" />
            </div>
            <div data-form-field>
              <label htmlFor="email" className={labelClass}>
                {"> email"}
              </label>
              <input id="email" name="email" type="email" required className={fieldClass} placeholder="you@example.com" />
            </div>
            <div data-form-field>
              <label htmlFor="message" className={labelClass}>
                {"> message"}
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className={`${fieldClass} resize-none`}
                placeholder="Tell me about your project..."
              />
            </div>

            <button
              data-form-field
              type="submit"
              disabled={status === "loading"}
              className="flex w-full items-center justify-center gap-2 bg-signal px-6 py-3.5 font-mono text-sm font-medium uppercase tracking-wider text-ink transition-colors hover:bg-paper disabled:opacity-60"
            >
              {status === "loading" ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send message
                </>
              )}
            </button>

            {status === "success" && (
              <p className="text-center font-mono text-sm text-verified">
                ✓ Message sent! I&apos;ll get back to you soon.
              </p>
            )}
            {status === "error" && <p className="text-center font-mono text-sm text-red-400">{errorMessage}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
