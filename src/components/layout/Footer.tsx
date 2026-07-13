import Link from "next/link";
import { Mail } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/SocialIcons";
import { siteConfig } from "@/data/portfolio";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#0a0a0f] px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <p className="text-sm text-zinc-500">
          © {year} {siteConfig.name}. Built with Next.js & Supabase.
        </p>
        <div className="flex items-center gap-4">
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 transition hover:text-white"
            aria-label="GitHub"
          >
            <GitHubIcon size={20} />
          </a>
          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 transition hover:text-white"
            aria-label="LinkedIn"
          >
            <LinkedInIcon size={20} />
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-zinc-400 transition hover:text-white"
            aria-label="Email"
          >
            <Mail size={20} />
          </a>
          <Link href="/blog" className="text-sm text-zinc-400 transition hover:text-white">
            Blog
          </Link>
        </div>
      </div>
    </footer>
  );
}
