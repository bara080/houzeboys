import { createAdminClient } from "@/lib/supabase-admin";

export interface Subscriber {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}

export interface DailyCount {
  date: string;
  count: number;
}

export async function getTotalSubscribers(): Promise<number> {
  const supabase = createAdminClient();
  const { count } = await supabase
    .from("subscribers")
    .select("*", { count: "exact", head: true });
  return count ?? 0;
}

export async function getNewSubscribersCount(days: number): Promise<number> {
  const supabase = createAdminClient();
  const since = new Date();
  since.setDate(since.getDate() - days);
  const { count } = await supabase
    .from("subscribers")
    .select("*", { count: "exact", head: true })
    .gte("created_at", since.toISOString());
  return count ?? 0;
}

export async function getGrowthRate(): Promise<number> {
  const supabase = createAdminClient();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [{ count: thisMonth }, { count: lastMonth }] = await Promise.all([
    supabase
      .from("subscribers")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfMonth.toISOString()),
    supabase
      .from("subscribers")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfLastMonth.toISOString())
      .lt("created_at", startOfMonth.toISOString()),
  ]);

  if (!lastMonth || lastMonth === 0) return thisMonth ? 100 : 0;
  return Math.round(((thisMonth! - lastMonth) / lastMonth) * 100);
}

export async function getDailySignups(days: number): Promise<DailyCount[]> {
  const supabase = createAdminClient();
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data } = await supabase
    .from("subscribers")
    .select("created_at")
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: true });

  if (!data) return [];

  const counts: Record<string, number> = {};
  data.forEach(({ created_at }) => {
    const date = created_at.slice(0, 10);
    counts[date] = (counts[date] ?? 0) + 1;
  });

  const result: DailyCount[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const date = d.toISOString().slice(0, 10);
    result.push({ date, count: counts[date] ?? 0 });
  }
  return result;
}

export async function getAllSubscribers(): Promise<Subscriber[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("subscribers")
    .select("id, name, email, phone, created_at")
    .order("created_at", { ascending: false });
  return data ?? [];
}
