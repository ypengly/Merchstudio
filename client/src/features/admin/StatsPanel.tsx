import { useEffect, useState } from "react";
import { api } from "@/services/api";
import type { AdminStats } from "@/types";

export default function StatsPanel() {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    api.get<AdminStats>("/admin/stats").then(setStats);
  }, []);

  const cards = stats
    ? [
        { label: "Total users", value: stats.totalUsers },
        { label: "Designs created", value: stats.designsCreated },
        { label: "Saved versions / exports", value: stats.exportsCount },
        { label: "Pro subscribers", value: stats.proSubscribers },
        { label: "Business subscribers", value: stats.businessSubscribers },
      ]
    : [];

  return (
    <div>
      <h2 className="font-display text-xl font-semibold">Statistics</h2>
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="border border-line rounded-panel p-5">
            <p className="text-xs text-steel">{c.label}</p>
            <p className="mt-2 font-display text-3xl font-semibold">{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
