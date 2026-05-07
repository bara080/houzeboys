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
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
    redirectTo: "https://www.houzeboys.com/auth/callback",
  });

  if (error) {
    console.error("[invite]", error.code);
    return NextResponse.json({ error: "Failed to send invite" }, { status: 500 });
  }

  // Use the returned user ID directly — no listUsers() needed
  const { error: updateError } = await admin.auth.admin.updateUserById(data.user.id, {
    app_metadata: { role: "admin" },
  });

  if (updateError) {
    console.error("[invite] failed to set admin role", updateError.code);
    return NextResponse.json({ error: "Invite sent but failed to set admin role" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
