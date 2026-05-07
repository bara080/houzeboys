import { createAdminClient } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import InviteModal from "@/components/admin/InviteModal";

export default async function TeamPage() {
  const supabase = await createClient();
  const { data: { user: caller } } = await supabase.auth.getUser();
  if (!caller || (caller.app_metadata as { role?: string })?.role !== "admin") {
    return <p className="text-red-400">Unauthorized</p>;
  }

  const admin = createAdminClient();
  const { data } = await admin.auth.admin.listUsers();
  const admins = (data?.users ?? []).filter(
    (u) => (u.app_metadata as { role?: string })?.role === "admin"
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Team</h1>
          <p className="text-sm text-gray-500 mt-1">{admins.length} admin{admins.length !== 1 ? "s" : ""}</p>
        </div>
        <InviteModal />
      </div>

      <div className="rounded-xl border border-white/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-gray-500">Email</TableHead>
              <TableHead className="text-gray-500">Status</TableHead>
              <TableHead className="text-gray-500">Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((u) => (
              <TableRow key={u.id} className="border-white/[0.06] hover:bg-white/[0.02]">
                <TableCell className="text-white">{u.email}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={u.confirmed_at ? "border-green-500/30 text-green-400" : "border-yellow-500/30 text-yellow-400"}
                  >
                    {u.confirmed_at ? "Active" : "Invited"}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-500">
                  {u.created_at ? new Date(u.created_at).toLocaleDateString("en-US") : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
