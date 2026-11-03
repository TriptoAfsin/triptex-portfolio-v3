import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/posts";
import { Archive } from "@/components/site/archive";
import { Icon } from "@/components/site/icons";

export const metadata: Metadata = {
  title: "Writing",
  description: "How things got built: the architecture, the tradeoffs, and what broke along the way.",
  alternates: { canonical: "/writing" },
};

export default function WritingPage() {
  const posts = getPosts().map(p => ({ slug: p.slug, title: p.title, summary: p.summary, date: p.date, dateLabel: p.dateLabel, minutes: p.minutes, tags: p.tags, external: p.external, source: p.source }));
  return (
    <main id="top" className="archive-page">
      <div className="post-top"><Link className="back" href="/#writing"><Icon id="i-left" />Home</Link><span>{posts.length} posts</span></div>
      <header className="arc-h">
        <h1>Writing</h1>
        <p>How things got built: the architecture, the tradeoffs, and what broke along the way.</p>
      </header>
      <Archive posts={posts} />
    </main>
  );
}
