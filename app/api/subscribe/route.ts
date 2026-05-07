import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

// ─── Sanitize / normalize ─────────────────────────────────────────────────────

function sanitize(value: string): string {
  return value.trim().replace(/<[^>]*>/g, "");
}

function normalizePhone(value: string): string {
  const trimmed = value.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  return hasPlus ? `+${digits}` : digits;
}

// ─── Server-side validators (mirrors client validators) ───────────────────────

function validateName(v: string): string | undefined {
  const val = v.trim();
  if (!val) return "Full name is required";
  if (val.length < 2) return "Must be at least 2 characters";
  if (val.length > 100) return "Must be under 100 characters";
  if (!/^[\p{L}\s'\-.]+$/u.test(val)) return "Name contains invalid characters";
}

function validateEmail(v: string): string | undefined {
  const val = v.trim();
  if (!val) return "Email address is required";
  if (val.length > 254) return "Email address is too long";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) return "Enter a valid email address";
  if (/[<>"'`]/.test(val)) return "Email contains invalid characters";
}

function validatePhone(v: string): string | undefined {
  const val = v.trim();
  if (!val) return "Phone number is required";
  const digits = val.replace(/\D/g, "");
  if (digits.length < 7) return "Phone number is too short";
  if (digits.length > 15) return "Phone number exceeds E.164 limit";
  if (!/^\+?[\d\s\-().]{7,20}$/.test(val)) return "Use international format: +1 555 000 0000";
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Reject non-JSON requests
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "Invalid content type" }, { status: 415 });
  }

  // Reject oversized payloads before parsing
  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > 4_096) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, email, phone } = body as Record<string, unknown>;

  // Reject wrong types — don't coerce
  if (typeof name !== "string" || typeof email !== "string" || typeof phone !== "string") {
    return NextResponse.json({ error: "Invalid field types" }, { status: 400 });
  }

  // Server-side validation (independent of client)
  const fieldError =
    validateName(name) ?? validateEmail(email) ?? validatePhone(phone);

  if (fieldError) {
    return NextResponse.json({ error: fieldError }, { status: 422 });
  }

  // Sanitize and normalize before storage
  const cleanName = sanitize(name);
  const cleanEmail = sanitize(email).toLowerCase();
  const cleanPhone = normalizePhone(sanitize(phone));

  // Supabase JS uses parameterized PostgREST queries — no raw SQL, no injection risk
  const { error } = await supabase
    .from("subscribers")
    .insert({ name: cleanName, email: cleanEmail, phone: cleanPhone });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Already subscribed" }, { status: 409 });
    }
    // Log internally but never expose Supabase error details to the client
    console.error("[subscribe] insert failed:", error.code);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
