"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // Implicit flow: tokens arrive as hash fragment (invite emails)
    const hash = window.location.hash.slice(1);
    if (hash) {
      const params = new URLSearchParams(hash);
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      const type = params.get("type");

      if (accessToken && refreshToken) {
        supabase.auth
          .setSession({ access_token: accessToken, refresh_token: refreshToken })
          .then(({ error }) => {
            if (error) {
              router.replace("/login?error=callback");
            } else if (type === "invite") {
              router.replace("/set-password");
            } else {
              router.replace("/admin");
            }
          });
        return;
      }
    }

    // PKCE flow: code arrives as query param
    const code = new URL(window.location.href).searchParams.get("code");
    if (code) {
      const type = new URL(window.location.href).searchParams.get("type");
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          router.replace("/login?error=callback");
        } else if (type === "invite") {
          router.replace("/set-password");
        } else {
          router.replace("/admin");
        }
      });
      return;
    }

    router.replace("/login?error=callback");
  }, [router]);

  return <div className="min-h-screen bg-[#0f0f0f]" />;
}
