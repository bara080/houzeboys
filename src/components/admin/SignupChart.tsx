"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DailyCount } from "@/lib/stats";

export default function SignupChart({ data }: { data: DailyCount[] }) {
  const formatted = data.map((d) => ({
    date: d.date.slice(5),
    count: d.count,
  }));

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
      <p className="text-sm font-semibold text-white mb-4">Signup Growth (30 days)</p>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={formatted}>
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
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
          />
          <Bar dataKey="count" fill="#ffffff" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
