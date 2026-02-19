"use server";

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface GitHubContributionsResponse {
  total: Record<string, number>;
  contributions: Array<{
    date: string;
    count: number;
    level: number;
  }>;
}

export async function fetchGitHubContributions(
  username: string
): Promise<ContributionDay[]> {
  try {
    const response = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch contributions: ${response.status}`);
    }

    const data: GitHubContributionsResponse = await response.json();

    return data.contributions.map((day) => ({
      date: day.date,
      count: day.count,
      level: Math.min(day.level, 4) as 0 | 1 | 2 | 3 | 4,
    }));
  } catch (error) {
    console.error("Error fetching GitHub contributions:", error);
    return [];
  }
}
