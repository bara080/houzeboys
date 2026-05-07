"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileDown, UserCog } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/subscribers", label: "Subscribers", icon: Users },
  { href: "/admin/reports", label: "Reports", icon: FileDown },
  { href: "/admin/team", label: "Team", icon: UserCog },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-56 shrink-0 border-r border-white/[0.06] bg-[#0a0a0a] flex flex-col min-h-screen">
      <div className="px-4 py-5 border-b border-white/[0.06]">
        <span className="text-white font-bold text-sm tracking-wide">Houzeboys Admin</span>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
              pathname === href
                ? "bg-white/10 text-white font-medium"
                : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
