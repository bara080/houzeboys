"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.replace("/login");
      else setChecking(false);
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]" />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
      <Card className="w-full max-w-sm bg-white/[0.03] border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Set your password</CardTitle>
          <CardDescription className="text-gray-400">
            Create a password to log in to the Houzeboys admin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
            />
            <Input
              type="password"
              placeholder="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              disabled={loading}
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-bold hover:bg-gray-200"
            >
              {loading ? "Saving…" : "Set Password & Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
