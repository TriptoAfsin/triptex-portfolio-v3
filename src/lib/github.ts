import "server-only";
import snapshot from "@/data/github-snapshot.json";

/** One week of [date, count, level 0-4] days. */
export type CalWeek = [string, number, number][];
export type Calendars = Record<string, CalWeek[]>;

const LEVEL: Record<string, number> = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };
const YEARS = ["2026", "2025", "2024"];

type GqlCal = { contributionCalendar: { weeks: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }[] } };

function toWeeks(c: GqlCal): CalWeek[] {
  return c.contributionCalendar.weeks.map(w => w.contributionDays.map(d => [d.date, d.contributionCount, LEVEL[d.contributionLevel] ?? 0]));
}

/**
 * Contribution calendars for the last 12 months and each recent year.
 * Uses the GitHub GraphQL API when a token is set (it includes private-repo counts), refreshed every
 * 6 hours. Falls back to the bundled snapshot so the page never waits on, or breaks because of, GitHub.
 */
export async function getCalendars(): Promise<Calendars> {
  const token = process.env.GITHUB_PAT_TOKEN || process.env.GITHUB_TOKEN;
  const fallback = snapshot.ranges as unknown as Calendars;
  if (!token) return fallback;
  const fields = "contributionCalendar{weeks{contributionDays{date contributionCount contributionLevel}}}";
  const query = `{viewer{last:contributionsCollection{${fields}} ${YEARS.map(y =>
    `y${y}:contributionsCollection(from:"${y}-01-01T00:00:00Z",to:"${y}-12-31T23:59:59Z"){${fields}}`).join(" ")}}}`;
  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json", "User-Agent": "triptex.me" },
      body: JSON.stringify({ query }),
      next: { revalidate: 21600 },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return fallback;
    const json = await res.json();
    const v = json?.data?.viewer;
    if (!v?.last) return fallback;
    const out: Calendars = { "12m": toWeeks(v.last) };
    for (const y of YEARS) if (v[`y${y}`]) out[y] = toWeeks(v[`y${y}`]);
    return out;
  } catch {
    return fallback;
  }
}
