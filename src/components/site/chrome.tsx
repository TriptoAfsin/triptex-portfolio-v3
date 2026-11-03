import Link from "next/link";
import { person } from "@/data/site";
import { getPosts, postHref } from "@/lib/posts";
import { Icon } from "./icons";
import { SiteHeader, type SearchItem } from "./site-header";

/** Header (with search index) shared by every page. */
export function Header() {
  const sections: [string, string][] = [["What I do", "/#focus"], ["Activity", "/#activity"], ["Work", "/#work"], ["Projects", "/#projects"], ["Blog", "/#blog"], ["Log", "/#log"], ["Education", "/#education"], ["Certifications", "/#certifications"], ["Contact", "/#contact"]];
  const items: SearchItem[] = [
    ...sections.map(([label, href]) => ({ label, hint: "Section", icon: "i-right" as const, href })),
    { label: "All posts", hint: "Page", icon: "i-pen", href: "/blog" },
    ...getPosts().map(p => ({ label: p.title, hint: p.external ? `Press · ${p.source}` : "Article", icon: "i-pen" as const, href: postHref(p), external: Boolean(p.external), keywords: `${p.slug.replace(/-/g, " ")} ${p.tags.join(" ")}` })),
    { label: "Download resume", hint: "PDF", icon: "i-filedown", href: person.resume, external: true },
    { label: "Email me", hint: person.email, icon: "i-mail", href: person.mailto },
    { label: "Open LinkedIn", hint: "triptoafsin", icon: "i-in", href: person.social.linkedin, external: true },
    { label: "Open GitHub", hint: "TriptoAfsin", icon: "i-gh", href: person.social.github, external: true },
    { label: "Follow on X", hint: "@Tripto_Afsin", icon: "i-x-logo", href: person.social.x, external: true },
  ];
  return <SiteHeader items={items} />;
}

export function Footer() {
  return (
    <footer>
      <span>© {new Date().getFullYear()} {person.name}</span>
      <span style={{ display: "flex", gap: 16 }}>
        <a href={person.social.github} target="_blank" rel="noopener"><Icon id="i-gh" fill />GitHub</a>
        <a href={person.social.linkedin} target="_blank" rel="noopener"><Icon id="i-in" fill />LinkedIn</a>
        <a href={person.social.x} target="_blank" rel="noopener"><Icon id="i-x-logo" fill />X</a>
        <Link href="/blog">Blog</Link>
      </span>
    </footer>
  );
}
