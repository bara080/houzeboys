import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || (user.app_metadata as { role?: string })?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email } = await req.json();
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { role: "admin" },
  });

  if (error) {
    console.error("[invite]", error.code);
    return NextResponse.json({ error: "Failed to send invite" }, { status: 500 });
  }

  const { data: invited } = await admin.auth.admin.listUsers();
  const invitedUser = invited?.users.find((u) => u.email === email);
  if (invitedUser) {
    await admin.auth.admin.updateUserById(invitedUser.id, {
      app_metadata: { role: "admin" },
    });
  }

  return NextResponse.json({ success: true });
}
