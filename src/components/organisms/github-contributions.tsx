"use client";

import { fetchGitHubContributions } from "@/server/actions/github.action";
import { motion } from "framer-motion";
import { Github } from "lucide-react";
import { useEffect, useState } from "react";
import { ActivityCalendar, type Activity } from "react-activity-calendar";

const GREEN_THEME = {
  dark: ["#0d1117", "#0e4429", "#006d32", "#26a641", "#39d353"],
  light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
};

interface GitHubContributionsProps {
  username: string;
}

export function GitHubContributions({ username }: GitHubContributionsProps) {
  const [contributions, setContributions] = useState<Activity[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGitHubContributions(username).then(data => {
      setContributions(data);
      setTotalCount(data.reduce((sum, day) => sum + day.count, 0));
      setLoading(false);
    });
  }, [username]);

  if (loading) {
    return (
      <div className="p-6 md:p-8 rounded-2xl bg-[#0d1117] border border-[#1b1f23] animate-pulse">
        <div className="h-[140px] md:h-[160px] rounded bg-[#161b22]" />
      </div>
    );
  }

  if (contributions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="p-5 md:p-8 rounded-2xl bg-[#0a0a0a] border border-[#1b1f23] relative overflow-hidden"
    >
      {/* Subtle green glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#39d353]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#26a641] to-[#39d353] flex items-center justify-center shadow-lg shadow-[#39d353]/20">
            <Github className="w-5 h-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-semibold text-[#e6edf3]">
              GitHub Contributions
            </h3>
            <p className="text-sm text-[#7d8590]">
              {totalCount.toLocaleString()} contributions in the last year
            </p>
          </div>
        </div>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#39d353] hover:text-[#26a641] transition-colors font-medium"
        >
          @{username}
        </a>
      </div>

      <div className="overflow-x-auto -mx-2 px-2 pb-2">
        <ActivityCalendar
          data={contributions}
          theme={GREEN_THEME}
          colorScheme="dark"
          blockSize={11}
          blockMargin={3}
          blockRadius={2}
          fontSize={12}
          showColorLegend
          showMonthLabels
          showTotalCount={false}
          labels={{
            totalCount: "{{count}} contributions in {{year}}",
          }}
          style={{
            color: "#7d8590",
          }}
        />
      </div>
    </motion.div>
  );
}
