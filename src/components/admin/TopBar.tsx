import { createClient } from "@/lib/supabase-server";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import InviteModal from "@/components/admin/InviteModal";

export default async function TopBar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const initials = (user?.email ?? "A")
    .split("@")[0]
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="h-14 border-b border-white/[0.06] bg-[#0a0a0a] flex items-center justify-between px-6 shrink-0">
      <span className="text-white font-semibold text-sm">Dashboard</span>
      <div className="flex items-center gap-3">
        <InviteModal />
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-white/10 text-white text-xs font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
