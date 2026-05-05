"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SubscribePayload {
  name: string;
  email: string;
  phone: string;
}

type FieldName = keyof SubscribePayload;
type Errors = Partial<Record<FieldName, string>>;

// ─── Security helpers ─────────────────────────────────────────────────────────

/** Strip HTML/script tags to prevent XSS in stored data */
function sanitize(value: string): string {
  return value.trim().replace(/<[^>]*>/g, "");
}

/** Normalize phone: keep leading + and digits only for storage */
function normalizePhone(value: string): string {
  const trimmed = value.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  return hasPlus ? `+${digits}` : digits;
}

// ─── Validators ───────────────────────────────────────────────────────────────

function validateName(v: string): string | undefined {
  const val = v.trim();
  if (!val) return "Full name is required";
  if (val.length < 2) return "Must be at least 2 characters";
  if (val.length > 100) return "Must be under 100 characters";
  // Unicode letters, spaces, hyphens, apostrophes, dots — handles international names
  if (!/^[\p{L}\s'\-.]+$/u.test(val)) return "Name contains invalid characters";
}

function validateEmail(v: string): string | undefined {
  const val = v.trim();
  if (!val) return "Email address is required";
  if (val.length > 254) return "Email address is too long"; // RFC 5321 limit
  // Reject double dots, leading/trailing dots in local part
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) return "Enter a valid email address";
  if (/[<>"'`]/.test(val)) return "Email contains invalid characters";
}

function validatePhone(v: string): string | undefined {
  const val = v.trim();
  if (!val) return "Phone number is required";
  const digits = val.replace(/\D/g, "");
  if (digits.length < 7) return "Phone number is too short";
  if (digits.length > 15) return "Phone number exceeds E.164 limit"; // ITU-T E.164
  if (!/^\+?[\d\s\-().]{7,20}$/.test(val))
    return "Use international format: +1 555 000 0000";
}

const validators: Record<FieldName, (v: string) => string | undefined> = {
  name: validateName,
  email: validateEmail,
  phone: validatePhone,
};

// ─── API ──────────────────────────────────────────────────────────────────────

async function subscribeUser(data: SubscribePayload): Promise<void> {
  // Replace with real endpoint, e.g.:
  // const res = await fetch("/api/subscribe", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(data),
  // });
  // if (!res.ok) throw new Error("Subscription failed");
  await new Promise((r) => setTimeout(r, 1200));
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SubscriptionForm() {
  const [values, setValues] = useState<SubscribePayload>({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});

  const { mutate, isPending, isSuccess, isError, reset } = useMutation({
    mutationFn: subscribeUser,
  });

  function validateAll(): Errors {
    return Object.fromEntries(
      (Object.keys(validators) as FieldName[])
        .map((f) => [f, validators[f](values[f])])
        .filter(([, err]) => Boolean(err))
    );
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const field = name as FieldName;
    setValues((v) => ({ ...v, [field]: value }));
    // Re-validate in real-time only after the field has been blurred once
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validators[field](value) }));
    }
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    const field = name as FieldName;
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validators[field](value) }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const allErrors = validateAll();
    setErrors(allErrors);
    setTouched({ name: true, email: true, phone: true });
    if (Object.keys(allErrors).length > 0) return;

    mutate({
      name: sanitize(values.name),
      email: sanitize(values.email).toLowerCase(),
      phone: normalizePhone(sanitize(values.phone)),
    });
  }

  function handleReset() {
    reset();
    setValues({ name: "", email: "", phone: "" });
    setErrors({});
    setTouched({});
  }

  if (isSuccess) {
    return (
      <div className="bg-white/[0.03] backdrop-blur-sm border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl">
        <div className="text-center py-10 space-y-4">
          <div className="flex justify-center text-green-400">
            <CheckCircleIcon />
          </div>
          <h3 className="text-2xl font-bold">You&apos;re on the list!</h3>
          <p className="text-gray-400">
            Thank you for subscribing. We&apos;ll keep you updated on new
            releases and announcements.
          </p>
          <button
            onClick={handleReset}
            className="mt-2 text-sm text-gray-500 underline hover:text-white transition-colors cursor-pointer"
          >
            Subscribe another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/[0.03] backdrop-blur-sm border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl">
      <h3 className="text-xl font-bold mb-6">Join Our Update List</h3>

      {/* noValidate: we own all validation */}
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <InputField
          name="name"
          label="Full Name"
          type="text"
          placeholder="John Doe"
          autoComplete="name"
          autoCapitalize="words"
          maxLength={100}
          value={values.name}
          error={errors.name}
          disabled={isPending}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <InputField
          name="email"
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          autoComplete="email"
          autoCapitalize="none"
          maxLength={254}
          value={values.email}
          error={errors.email}
          disabled={isPending}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <InputField
          name="phone"
          label="Phone Number"
          type="tel"
          placeholder="+1 555 000 0000"
          autoComplete="tel"
          autoCapitalize="none"
          inputMode="tel"
          maxLength={20}
          value={values.phone}
          error={errors.phone}
          disabled={isPending}
          onChange={handleChange}
          onBlur={handleBlur}
          hint="International format — include your country code"
        />

        {isError && (
          <p role="alert" className="text-sm text-red-400 text-center">
            Something went wrong — please try again.
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-white text-black font-extrabold py-4 rounded-xl hover:bg-[#d1d5db] transition-all active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Spinner />
              Submitting…
            </>
          ) : (
            "Keep Me Updated"
          )}
        </button>

        <p className="text-[10px] text-gray-500 text-center mt-4">
          By subscribing, you agree to receive updates. You can unsubscribe
          anytime.
        </p>
      </form>
    </div>
  );
}

// ─── InputField ───────────────────────────────────────────────────────────────

function InputField({
  name,
  label,
  type,
  placeholder,
  autoComplete,
  autoCapitalize,
  inputMode,
  maxLength,
  value,
  error,
  hint,
  disabled,
  onChange,
  onBlur,
}: {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  autoComplete?: string;
  autoCapitalize?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  maxLength?: number;
  value: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}) {
  const id = `field-${name}`;
  const errId = `${id}-error`;
  const hintId = `${id}-hint`;
  const hasError = Boolean(error);

  return (
    <div>
      <label
        htmlFor={id}
        className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1 block"
      >
        {label}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        autoCapitalize={autoCapitalize}
        inputMode={inputMode}
        maxLength={maxLength}
        spellCheck={false}
        value={value}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={hasError}
        aria-describedby={
          [hasError && errId, hint && hintId].filter(Boolean).join(" ") || undefined
        }
        className={`w-full bg-white/5 border rounded-xl px-4 py-3 outline-none transition-all duration-200 text-white placeholder:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed
          ${hasError
            ? "border-red-500/70 focus:border-red-400 bg-red-500/5"
            : "border-white/10 focus:border-white"
          }`}
      />

      {hint && !hasError && (
        <p id={hintId} className="mt-1 text-[11px] text-gray-600">
          {hint}
        </p>
      )}

      {hasError && (
        <p id={errId} role="alert" className="mt-1.5 text-xs text-red-400 flex items-center gap-1.5">
          <AlertIcon />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function AlertIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" />
      <path
        className="opacity-75"
        d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
