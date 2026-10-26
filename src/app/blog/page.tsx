import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { createServerClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import type { BlogPost } from "@/types/database";

export const metadata = {
  title: "Blog | Portfolio",
  description: "Articles and notes on web development.",
};

export default async function BlogPage() {
  const supabase = createServerClient();
  let posts: BlogPost[] = [];

  if (supabase) {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });
    posts = (data as BlogPost[]) ?? [];
  }

  return (
    <div className="min-h-screen bg-ink text-paper">
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 pb-24 pt-28">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-paper/55 transition hover:text-paper"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-signal">{"// writing"}</p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Blog</h1>
        <p className="mt-2 text-paper/55">Thoughts on development, tools, and building things.</p>

        {!supabase && (
          <div className="mt-8 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
            Supabase is not configured yet. Add your environment variables and run the SQL schema
            to enable the blog.
          </div>
        )}

        <div className="mt-12 space-y-6">
          {posts.length === 0 && supabase && (
            <p className="text-paper/40">No posts yet. Check back soon!</p>
          )}
          {posts.map((post) => (
            <article
              key={post.id}
              className="group border border-paper/10 bg-blueprint/30 p-6 transition hover:border-signal/50"
            >
              <div className="mb-2 flex items-center gap-2 text-sm text-paper/40">
                <Calendar size={14} />
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-xl font-semibold text-paper group-hover:text-signal transition">
                  {post.title}
                </h2>
              </Link>
              <p className="mt-2 text-paper/55">{post.excerpt}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-4 inline-block text-sm font-medium text-signal transition hover:text-paper"
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
