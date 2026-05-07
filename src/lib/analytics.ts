export interface VisitorStats {
  totalVisitors: number;
  lastWeek: number;
  lastMonth: number;
  last30Days: number;
}

export interface DailyVisitors {
  date: string;
  visitors: number;
}

async function fetchVercelAnalytics(from: string, to: string) {
  const params = new URLSearchParams({
    projectId: process.env.VERCEL_PROJECT_ID!,
    teamId: process.env.VERCEL_TEAM_ID!,
    from,
    to,
    granularity: "day",
    environment: "production",
  });

  const res = await fetch(
    `https://vercel.com/api/web/insights/stats/visitors?${params}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
      },
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) return null;
  return res.json();
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function sumVisitors(data: { data: { key: string; total: number }[] } | null): number {
  if (!data?.data) return 0;
  return data.data.reduce((sum, d) => sum + (d.total ?? 0), 0);
}

export async function getVisitorStats(): Promise<VisitorStats> {
  const today = new Date().toISOString().slice(0, 10);

  const [week, month, thirty] = await Promise.all([
    fetchVercelAnalytics(daysAgo(7), today),
    fetchVercelAnalytics(daysAgo(30), today),
    fetchVercelAnalytics(daysAgo(30), today),
  ]);

  return {
    totalVisitors: sumVisitors(month),
    lastWeek: sumVisitors(week),
    lastMonth: sumVisitors(month),
    last30Days: sumVisitors(thirty),
  };
}

export async function getDailyVisitors(days: number): Promise<DailyVisitors[]> {
  const today = new Date().toISOString().slice(0, 10);
  const data = await fetchVercelAnalytics(daysAgo(days), today);
  if (!data?.data) return [];
  return data.data.map((d: { key: string; total: number }) => ({
    date: d.key,
    visitors: d.total,
  }));
}
