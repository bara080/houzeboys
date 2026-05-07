import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getTotalSubscribers,
  getNewSubscribersCount,
  getGrowthRate,
} from "@/lib/stats";
import { getVisitorStats } from "@/lib/analytics";

export default async function StatCards() {
  const [total, newThisWeek, growthRate, visitors] = await Promise.all([
    getTotalSubscribers(),
    getNewSubscribersCount(7),
    getGrowthRate(),
    getVisitorStats(),
  ]);

  const cards = [
    {
      title: "Total Subscribers",
      value: total.toLocaleString(),
      sub: `+${newThisWeek} this week`,
      positive: newThisWeek > 0,
    },
    {
      title: "New This Week",
      value: newThisWeek.toLocaleString(),
      sub: "last 7 days",
      positive: newThisWeek > 0,
    },
    {
      title: "Page Visitors",
      value: visitors.last30Days.toLocaleString(),
      sub: `${visitors.lastWeek} last week · ${visitors.lastMonth} last month`,
      positive: visitors.last30Days > 0,
    },
    {
      title: "Growth Rate",
      value: `${growthRate > 0 ? "+" : ""}${growthRate}%`,
      sub: "month over month",
      positive: growthRate >= 0,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title} className="bg-white/[0.03] border-white/10">
          <CardHeader className="pb-1">
            <CardTitle className="text-xs uppercase tracking-widest text-gray-500 font-medium">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <p className={`text-xs mt-1 ${card.positive ? "text-green-400" : "text-gray-500"}`}>
              {card.sub}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
