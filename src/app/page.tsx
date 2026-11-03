import Link from "next/link";
import { bio, certifications, education, facts, headlines, log, person, projects, scale, work } from "@/data/site";
import { getCalendars } from "@/lib/github";
import { getPosts, postHref } from "@/lib/posts";
import { Icon, type IconId } from "@/components/site/icons";
import { Rain } from "@/components/site/rain";
import { Headline } from "@/components/site/headline";
import { Photo } from "@/components/site/photo";
import { Activity } from "@/components/site/activity";
import { Work } from "@/components/site/work";
import { Effects, Log } from "@/components/site/effects";

export const revalidate = 21600;

function Head({ id, icon, title, aside }: { id: string; icon: IconId; title: string; aside?: React.ReactNode }) {
  return <div className="sh"><h2 id={id}><Icon id={icon} />{title}</h2>{aside && <small>{aside}</small>}</div>;
}

export default async function Home() {
  const [calendars, posts] = await Promise.all([getCalendars(), Promise.resolve(getPosts())]);
  const today = new Date().toISOString().slice(0, 10);
  const cards = work.map(({ detail, ...w }) => ({ ...w, hasDetail: Boolean(detail) }));

  return (
    <main id="top">
      <Effects />
      <section className="intro" aria-label="Introduction">
        <Rain />
        <div className="who">
          <Photo src={person.photo} name={person.name} />
          <div>
            <h1>{person.name}</h1>
            <p className="role">{person.roles.map((r, i, all) => <span className="r" key={r}>{r}{i < all.length - 1 && <span className="sep" aria-hidden="true">·</span>}</span>)}</p>
          </div>
        </div>
        <Headline lines={headlines} />
        {bio.map(p => <p className="bio" key={p.slice(0, 20)}>{p}</p>)}
        <ul className="facts">{facts.map(f => <li key={f.text}><Icon id={f.icon as IconId} />{f.text}</li>)}</ul>
        <div className="actions">
          <a className="chip pri" href={person.resume} target="_blank" rel="noopener"><Icon id="i-filedown" />Resume</a>
          <a className="chip" href={person.mailto}><Icon id="i-mail" />Email me</a>
          <span className="soc" role="group" aria-label="Profiles">
            <a className="soc-i" href={person.social.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn" data-tip="LinkedIn"><Icon id="i-in" fill /></a>
            <a className="soc-i" href={person.social.github} target="_blank" rel="noopener" aria-label="GitHub" data-tip="GitHub"><Icon id="i-gh" fill /></a>
            <a className="soc-i" href={person.social.x} target="_blank" rel="noopener" aria-label="X (Twitter)" data-tip="X"><Icon id="i-x-logo" fill /></a>
          </span>
        </div>
        <p className="consult2"><span className="pulse" aria-hidden="true" />Open for consulting and advisory work. <Link href="/#contact">Get in touch<Icon id="i-right" /></Link></p>
      </section>

      <div className="stack">
        <Activity calendars={calendars} today={today} />

        <section id="focus" aria-labelledby="h-focus">
          <Head id="h-focus" icon="i-target" title="What I do" />
          <div className="bento" id="bento">
            <article className="bx bx-founder">
              <svg className="bx-bg" aria-hidden="true"><use href="#i-flag" /></svg>
              <div className="bx-top"><span className="bx-ic big sq"><Icon id="i-flag" /></span><span className="bx-badge"><span className="a">since 2018</span><span className="b">8 years running</span></span></div>
              <h3>Founder and product owner</h3>
              <p>Started BUTEX NoteBot in 2018 and still run it. I take products from the first conversation to launch, and keep owning them.</p>
              <div className="bx-scale">{scale.map(x => <span key={x.label}><b>{x.value}</b>{x.label}</span>)}</div>
            </article>
            <article className="bx bx-pe"><span className="bx-ic round"><Icon id="i-target" /></span><h3>Product engineering</h3><p>Scope with the team, cut to what matters, ship what people use.</p><span className="bx-steps" aria-hidden="true"><b>scope</b><b>cut</b><b>ship</b></span></article>
            <article className="bx bx-ai"><span className="bx-ic plain"><Icon id="i-cpu" /></span><h3>AI-native software</h3><p>Built for people and agents. Routed and cached to stay fast and cheap.</p><span className="bx-who" aria-hidden="true"><b>Human</b><b>Agent</b><b>MCP</b></span><span className="bx-dots" aria-hidden="true"><i /><i /><i /></span></article>
            <article className="bx bx-fs"><span className="bx-ic round"><Icon id="i-layers" /></span><h3>Full-stack</h3><p className="bx-stack">{["Next.js", "React", "Node", "Bun", "Go", "Python", "Postgres", "Redis"].map(t => <span key={t}>{t}</span>)}</p></article>
            <article className="bx bx-prod"><svg className="bx-bg sm" aria-hidden="true"><use href="#i-server" /></svg><span className="bx-ic plain"><Icon id="i-server" /></span><h3>Built to scale</h3><p>Queues, caching and graceful fallbacks for millions of requests. Deploys, monitoring and patches too: I&apos;m the one who gets paged.</p><span className="bx-up" aria-hidden="true"><span className="st"><i />all systems normal</span><span className="bars">{Array.from({ length: 24 }, (_, i) => <i key={i} />)}</span></span></article>
            <article className="bx bx-auto">
              <svg className="bx-bg" aria-hidden="true"><use href="#i-zap" /></svg>
              <div className="bx-top"><span className="bx-ic big sq"><Icon id="i-zap" /></span><span className="bx-flow" aria-hidden="true"><b>Form</b><i /><b>n8n</b><i /><b>Slack</b></span></div>
              <h3>Automation</h3>
              <p>Slack bots, n8n workflows and Apps Script that take repetitive work off a team.</p>
            </article>
          </div>
        </section>

        <section id="work" aria-labelledby="h-work">
          <Head id="h-work" icon="i-brief" title="Work" aside="5+ years" />
          <Work cards={cards} />
        </section>

        <section id="projects" aria-labelledby="h-projects">
          <Head id="h-projects" icon="i-layers" title="Projects" aside="open source and side projects" />
          <div className="pgrid">
            {projects.map(p => (
              <a className="pcard" href={p.url} target="_blank" rel="noopener" key={p.name}>
                <span className="pc-top"><b>{p.name}</b><span className="star"><Icon id="i-star" fill />{p.stars}</span></span>
                <span className="pc-d">{p.text}</span>
                <span className="pc-k">{p.stack}<Icon id="i-arrow" className="go" /></span>
              </a>
            ))}
          </div>
          <a className="viewall" href={`${person.social.github}?tab=repositories`} target="_blank" rel="noopener"><Icon id="i-gh" fill />View all repositories on GitHub<Icon id="i-arrow" /></a>
        </section>

        <section id="writing" aria-labelledby="h-writing">
          <Head id="h-writing" icon="i-pen" title="Writing" aside="how things got built" />
          <div className="wlist">
            {posts.slice(0, 3).map(p => {
              const [mon, yr] = p.dateLabel.split(" ");
              return (
                <Link className="wpost" href={postHref(p)} key={p.slug} {...(p.external ? { target: "_blank", rel: "noopener" } : {})}>
                  <span className="wp-date"><b>{mon}</b><span>{yr} · {p.minutes} min</span></span>
                  <span className="wp-body">
                    {p.external && <span className="press">Press · {p.source}</span>}
                    <span className="wp-t">{p.title}</span>
                    <span className="wp-s">{p.summary}</span>
                  </span>
                </Link>
              );
            })}
          </div>
          <Link className="viewall" href="/writing"><Icon id="i-pen" />All writing <span className="vc">({posts.length})</span><Icon id="i-right" /></Link>
        </section>

        <section id="log" aria-labelledby="h-log">
          <Head id="h-log" icon="i-history" title="Log" aside="newest first" />
          <Log entries={log} />
        </section>

        <section id="education" aria-labelledby="h-edu">
          <Head id="h-edu" icon="i-cap" title="Education" />
          <div className="rows">
            {education.map(e => <div className="row" key={e.degree}><span className="n">{e.degree} <small>{e.school}</small></span><span className="t">{e.when}</span><span className="d">{e.note}</span></div>)}
          </div>
        </section>

        <section id="certifications" aria-labelledby="h-cert">
          <Head id="h-cert" icon="i-award" title="Certifications" />
          <div className="rows">
            {certifications.map(c => <div className="row" key={c.name}><span className="n">{c.name} <small>{c.issuer}</small></span><span className="t">{c.year}</span></div>)}
          </div>
        </section>
        <section id="offclock" aria-labelledby="h-off">
          <Head id="h-off" icon="i-game" title="Off the clock" />
          <div className="off">
            <p>When I&apos;m not shipping, I&apos;m usually halfway through a TV series, catching a movie or playing a video game, all very casually. And I&apos;ll never say no to a game of cricket.</p>
            <ul className="off-tags" aria-label="Interests">
              <li><Icon id="i-tv" />TV series</li>
              <li><Icon id="i-film" />Movies</li>
              <li><Icon id="i-game" />Video games</li>
              <li><Icon id="i-cricket" />Cricket</li>
            </ul>
          </div>
        </section>
      </div>

      <section className="contact-cta" id="contact" aria-labelledby="h-contact">
        <div className="cc-glow" aria-hidden="true" />
        <p className="cc-k">Hiring, or have a product that needs building?</p>
        <h2 id="h-contact">Let&apos;s work together.</h2>
        <p className="cc-d">Full-time roles, consulting and advisory work. I usually reply within a day.</p>
        <div className="cc-a">
          <a className="chip pri" href={person.mailto}><Icon id="i-mail" />Email me</a>
          <a className="chip" href={person.social.linkedin} target="_blank" rel="noopener"><Icon id="i-in" fill />Message on LinkedIn</a>
          <a className="chip" href={person.social.x} target="_blank" rel="noopener"><Icon id="i-x-logo" fill />Follow on X</a>
          <a className="chip" href={person.resume} target="_blank" rel="noopener"><Icon id="i-filedown" />Resume</a>
        </div>
        <p className="cc-mail">{person.email} · <a href={person.social.x} target="_blank" rel="noopener">@Tripto_Afsin</a></p>
      </section>
    </main>
  );
}
