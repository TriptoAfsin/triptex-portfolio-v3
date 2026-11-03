import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticles, getPost, getPosts, postHref, renderPost } from "@/lib/posts";
import { person, SITE_URL } from "@/data/site";
import { Icon } from "@/components/site/icons";
import { ArticleFx } from "@/components/site/article-fx";

export const dynamicParams = false;

export function generateStaticParams() {
  return getArticles().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/blog/${post.slug}`, types: { "text/markdown": `/blog/${post.slug}.md` } },
    openGraph: { type: "article", url: `${SITE_URL}/blog/${post.slug}`, siteName: person.name, locale: "en_US", title: post.title, description: post.summary, publishedTime: post.date, authors: [person.name], tags: post.tags },
    twitter: { card: "summary_large_image", title: post.title, description: post.summary, creator: "@Tripto_Afsin", site: "@Tripto_Afsin" },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const others = getPosts().filter(p => p.slug !== post.slug).slice(0, 3);
  const ld = {
    "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.summary,
    datePublished: post.date, author: { "@type": "Person", name: person.name, url: SITE_URL },
    url: `${SITE_URL}/blog/${post.slug}`, keywords: post.tags.join(", "), image: post.cover ? `${SITE_URL}${post.cover}` : undefined,
  };

  return (
    <main id="top" className="post-page">
      <div className="post-top"><Link className="back" href="/blog"><Icon id="i-left" />All posts</Link><span>{post.dateLabel} · {post.minutes} min read</span></div>
      <article className="md">
        <h1>{post.title}</h1>
        <p className="lead">{post.summary}</p>
        <div className="byline">
          <Image src={person.photo} alt="" width={32} height={32} sizes="32px" />
          <span><b>{person.name}</b><small><time dateTime={post.date}>{post.dateLabel}</time> · {post.minutes} min read</small></span>
        </div>
        <div className="tags">{post.tags.map(t => <span className="tag" key={t}>{t}</span>)}</div>
        <div className="md-body" dangerouslySetInnerHTML={{ __html: await renderPost(post) }} />
        <ArticleFx />
      </article>
      <nav className="post-next" aria-label="More posts">
        <h2>Keep reading</h2>
        <div className="posts">
          {others.map(o => (
            <Link className="post" href={postHref(o)} key={o.slug} {...(o.external ? { target: "_blank", rel: "noopener" } : {})}>
              <time dateTime={o.date}>{o.dateLabel}</time><div><h3>{o.title}</h3><p>{o.summary}</p></div><span className="m">{o.minutes} min</span>
            </Link>
          ))}
        </div>
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </main>
  );
}
