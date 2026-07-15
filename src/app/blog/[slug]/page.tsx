import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import { createServerClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import type { BlogPost } from "@/types/database";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const supabase = createServerClient();

  if (!supabase) return { title: "Blog Post" };

  const { data } = await supabase
    .from("blog_posts")
    .select("title, excerpt")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!data) return { title: "Not Found" };

  return {
    title: `${data.title} | Blog`,
    description: data.excerpt,
  };
}

function renderMarkdown(content: string) {
  return content.split("\n").map((line, i) => {
    if (line.startsWith("# ")) {
      return (
        <h1 key={i} className="mb-4 mt-8 text-3xl font-bold text-white">
          {line.slice(2)}
        </h1>
      );
    }
    if (line.startsWith("## ")) {
      return (
        <h2 key={i} className="mb-3 mt-6 text-2xl font-semibold text-white">
          {line.slice(3)}
        </h2>
      );
    }
    if (line.trim() === "") {
      return <br key={i} />;
    }
    return (
      <p key={i} className="mb-4 leading-relaxed text-zinc-300">
        {line}
      </p>
    );
  });
}

// export default async function BlogPostPage({ params }: Props) {
//   const { slug } = await params;
//   const supabase = createServerClient();

//   if (!supabase) notFound();

//   const { data } = await supabase
//     .from("blog_posts")
//     .select("*")
//     .eq("slug", slug)
//     .eq("published", true)
//     .single();

//   if (!data) notFound();

//   const post = data as BlogPost;

//   return (
//     <div className="min-h-screen bg-[#0a0a0f] text-white">
//       <Navbar />
//       <main className="mx-auto max-w-3xl px-6 pb-24 pt-28">
//         <Link
//           href="/blog"
//           className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
//         >
//           <ArrowLeft size={16} />
//           Back to blog
//         </Link>

//         <div className="mb-2 flex items-center gap-2 text-sm text-zinc-500">
//           <Calendar size={14} />
//           {new Date(post.created_at).toLocaleDateString("en-US", {
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//           })}
//         </div>

//         <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
//         <p className="mt-4 text-lg text-zinc-400">{post.excerpt}</p>

//         <article className="prose-invert mt-12">{renderMarkdown(post.content)}</article>
//       </main>
//       <Footer />
//     </div>
//   );
// }
