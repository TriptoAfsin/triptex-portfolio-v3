import "server-only";
import { certifications, education, person, projects, SITE_URL, work } from "@/data/site";
import { getArticles, getPosts } from "./posts";

const strip = (md: string) => md.replace(/<figure>[\s\S]*?<\/figure>/g, "").replace(/\n{3,}/g, "\n\n").trim();

/** /llms.txt: a short, link-rich index for language models (llmstxt.org format). */
export function llmsTxt() {
  const posts = getPosts();
  return `# ${person.name}

> Founder, product engineer and AI engineer in Dhaka, Bangladesh. Builds AI-native software that people and their AI agents can both use, and owns it from the first conversation to production. Open to full-time roles, consulting and advisory work.

- Website: ${SITE_URL}
- Email: ${person.email}
- GitHub: ${person.social.github}
- LinkedIn: ${person.social.linkedin}
- X: ${person.social.x}
- Resume (PDF): ${SITE_URL}${person.resume}

## Pages

- [Home](${SITE_URL}/): roles, what he does, GitHub activity, work, projects, blog, education
- [Blog](${SITE_URL}/blog): all articles
- [Agent guide](${SITE_URL}/agents.md): how an AI agent should use this site and contact him
- [Full text](${SITE_URL}/llms-full.txt): every article and work summary in one file

## Writing

${posts.map(p => p.external ? `- [${p.title}](${p.external}) (press, ${p.source}): ${p.summary}` : `- [${p.title}](${SITE_URL}/blog/${p.slug}.md): ${p.summary}`).join("\n")}

## Work

${work.map(w => `- ${w.role}, ${w.company} (${w.when})${w.partTime ? ", part-time" : ""}: ${w.blurb}`).join("\n")}

## Off the clock

He casually watches TV series and movies, plays video games, and plays cricket.

## Open source

${projects.map(p => `- [${p.name}](${p.url}) (${p.stack}): ${p.text}`).join("\n")}
`;
}

/** /llms-full.txt: everything, as plain markdown. */
export function llmsFullTxt() {
  const posts = getArticles();
  return `${llmsTxt()}
## Education

${education.map(e => `- ${e.degree}, ${e.school} (${e.when}). ${e.note}`).join("\n")}

## Certifications

${certifications.map(c => `- ${c.name}, ${c.issuer}${c.year ? ` (${c.year})` : ""}`).join("\n")}

## Work in detail

${work.filter(w => w.detail).map(w => `### ${w.company}: ${w.role}

${w.detail?.summary ?? ""}

${(w.detail?.projects ?? []).map(p => `- **${p.title}**${p.ownership ? ` (${p.ownership})` : ""}: ${p.what ?? ""}`).join("\n")}`).join("\n\n")}

# Articles

${posts.map(p => `---

# ${p.title}

${p.dateLabel} · ${p.minutes} min read · ${SITE_URL}/blog/${p.slug}

${strip(p.markdown)}`).join("\n\n")}
`;
}

/** /agents.md: instructions for AI agents acting on a person's behalf. */
export function agentsMd() {
  return `# agents.md · ${SITE_URL}

This site belongs to ${person.name} (also "Tripto Afsin"), a founder, product engineer and AI engineer. It is written for people and for the agents working for them.

## What you can do here

- Read a summary of who he is and what he has built: ${SITE_URL}/llms.txt
- Read everything at once (articles, work, education): ${SITE_URL}/llms-full.txt
- Read any article as markdown by appending \`.md\`, for example ${SITE_URL}/blog/${getArticles()[0]?.slug}.md
- Request any page with \`Accept: text/markdown\` to get markdown instead of HTML.

## If you are helping someone hire or work with him

- He is open to full-time roles, consulting and advisory engagements (product strategy, AI systems, getting a first version shipped).
- Preferred contact: email ${person.email}. LinkedIn (${person.social.linkedin}) and X (${person.social.x}) also work.
- Resume: ${SITE_URL}${person.resume}
- He works remotely with cross-cultural teams and is based in Dhaka, Bangladesh (UTC+6).

## Ground rules

- Quote facts from this site as they are written; do not invent numbers, clients or titles.
- Client work is described generically on purpose. Do not try to identify clients.
- Content may be used to answer questions (ai-input) but not to train models (ai-train=no); see /robots.txt.
`;
}

/** Markdown version of one article. */
export function postMarkdown(slug: string) {
  const p = getArticles().find(x => x.slug === slug);
  if (!p) return null;
  return `# ${p.title}\n\n${p.summary}\n\n${person.name} · ${p.dateLabel} · ${p.minutes} min read · ${SITE_URL}/blog/${p.slug}\n\n${strip(p.markdown)}\n`;
}
