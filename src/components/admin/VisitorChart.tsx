"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DailyVisitors } from "@/lib/analytics";

export default function VisitorChart({ data }: { data: DailyVisitors[] }) {
  const formatted = data.map((d) => ({
    date: d.date.slice(5),
    visitors: d.visitors,
  }));

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
      <p className="text-sm font-semibold text-white mb-4">Visitor Trend (30 days)</p>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={formatted}>
          <XAxis
            dataKey="date"
            tick={{ fill: "#6b7280", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            interval={6}
          />
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{ background: "#1a1a1a", border: "1px solid #333", color: "#fff" }}
          />
          <Line
            dataKey="visitors"
            stroke="#ffffff"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
