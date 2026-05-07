"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function InviteModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const res = await fetch("/api/admin/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setStatus("success");
      setEmail("");
    } else {
      const data = await res.json();
      setErrorMsg(data.error ?? "Failed to send invite");
      setStatus("error");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); setStatus("idle"); }}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-white/10 text-white hover:bg-white/10 text-xs"
        >
          Invite User
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#111] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Invite Admin</DialogTitle>
        </DialogHeader>
        {status === "success" ? (
          <p className="text-green-400 text-sm">Invite sent! They&apos;ll receive an email.</p>
        ) : (
          <form onSubmit={handleInvite} className="space-y-4">
            <Input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
            />
            {status === "error" && (
              <p className="text-sm text-red-400">{errorMsg}</p>
            )}
            <Button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-white text-black font-bold hover:bg-gray-200"
            >
              {status === "loading" ? "Sending…" : "Send Invite"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
