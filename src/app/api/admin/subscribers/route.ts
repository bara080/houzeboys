import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { getAllSubscribers } from "@/lib/stats";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || (user.app_metadata as { role?: string })?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const subscribers = await getAllSubscribers();
  return NextResponse.json(subscribers);
}
