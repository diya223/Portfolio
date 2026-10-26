"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { navLinks, siteConfig } from "@/data/portfolio";
import { gsap, ScrollTrigger, useGSAP, MQ, scrollToHash } from "@/lib/gsap";

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const header = useRef<HTMLElement>(null);
  const mobileList = useRef<HTMLUListElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Scroll-linked state: solid background, active section, hide/show on direction.
  useGSAP(
    () => {
      const el = header.current;
      if (!el) return;

      const targets = isHome
        ? navLinks
            .filter((l) => l.href.startsWith("#"))
            .map((l) => ({ href: l.href, node: document.querySelector(l.href) }))
        : [];

      // Reads live layout, so it stays correct even with pin spacers above it.
      const sync = () => {
        setScrolled(window.scrollY > 20);
        const mid = window.innerHeight * 0.55;
        let current = "";
        for (const t of targets) {
          if (!t.node) continue;
          const r = t.node.getBoundingClientRect();
          if (r.top <= mid && r.bottom > mid) current = t.href;
        }
        setActive(current);
      };

      const base = ScrollTrigger.create({ start: 0, end: "max", onUpdate: sync, onRefresh: sync });

      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from(el, { yPercent: -100, autoAlpha: 0, duration: 0.8, delay: isHome ? 1.2 : 0.1, ease: "power3.out" });

        const hide = gsap.to(el, { yPercent: -100, duration: 0.35, ease: "power2.out", paused: true });
        const dir = ScrollTrigger.create({
          start: 0,
          end: "max",
          onUpdate: (self) => {
            const open = el.dataset.open === "true";
            if (self.direction === 1 && self.scroll() > 240 && !open) hide.play();
            else hide.reverse();
          },
        });
        return () => {
          dir.kill();
          hide.kill();
        };
      });

      return () => {
        base.kill();
        mm.revert();
      };
    },
    { scope: header, dependencies: [isHome] },
  );

  // Stagger the mobile menu items in.
  useGSAP(
    () => {
      if (!mobileOpen || !mobileList.current) return;
      gsap.from(mobileList.current.children, {
        autoAlpha: 0,
        x: -24,
        stagger: 0.06,
        duration: 0.45,
        ease: "power3.out",
      });
    },
    { dependencies: [mobileOpen] },
  );

  const hrefFor = (href: string) => (href.startsWith("#") && !isHome ? `/${href}` : href);

  const onNav = (e: React.MouseEvent, href: string) => {
    setMobileOpen(false);
    if (href.startsWith("#") && isHome && scrollToHash(href)) e.preventDefault();
  };

  return (
    <header
      ref={header}
      data-open={mobileOpen}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || mobileOpen
          ? "border-b border-paper/10 bg-ink/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          onClick={(e) => {
            setMobileOpen(false);
            if (isHome) {
              e.preventDefault();
              gsap.to(window, { scrollTo: 0, duration: 1.2, ease: "power3.inOut" });
            }
          }}
          className="group flex items-center gap-2 font-mono text-sm text-paper"
        >
          <span className="text-signal">~/</span>
          {siteConfig.name.split(" ")[0].toLowerCase()}
          <span className="h-4 w-2 animate-pulse bg-signal" />
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {navLinks.map((link, i) => {
            const isActive = active === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={hrefFor(link.href)}
                  onClick={(e) => onNav(e, link.href)}
                  className={`group flex items-baseline gap-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                    isActive ? "text-signal" : "text-paper/55 hover:text-paper"
                  }`}
                >
                  <span className={`text-[10px] ${isActive ? "text-signal" : "text-paper/30"}`}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {link.label}
                </Link>
              </li>
            );
          })}
          <li>
            <a
              href={siteConfig.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-signal px-4 py-2 font-mono text-xs uppercase tracking-wider text-signal transition-colors hover:bg-signal hover:text-ink"
            >
              Resume
            </a>
          </li>
        </ul>

        <button
          type="button"
          className="text-paper md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-paper/10 px-6 py-6 md:hidden">
          <ul ref={mobileList} className="flex flex-col gap-5">
            {navLinks.map((link, i) => (
              <li key={link.href}>
                <Link
                  href={hrefFor(link.href)}
                  onClick={(e) => onNav(e, link.href)}
                  className="flex items-baseline gap-3 font-mono text-lg uppercase tracking-wider text-paper"
                >
                  <span className="text-xs text-signal">{String(i + 1).padStart(2, "0")}</span>
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={siteConfig.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-signal px-5 py-2 font-mono text-sm uppercase tracking-wider text-signal"
              >
                Resume
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
