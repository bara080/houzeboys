"use client";

import { useMutation } from "@tanstack/react-query";
import { useRef } from "react";

interface SubscribePayload {
  name: string;
  email: string;
  phone: string;
}

async function subscribeUser(data: SubscribePayload): Promise<void> {
  // Swap for a real endpoint:
  // await fetch('/api/subscribe', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // });
  await new Promise((r) => setTimeout(r, 1200));
}

export default function SubscriptionForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const { mutate, isPending, isSuccess, isError, reset } = useMutation({
    mutationFn: subscribeUser,
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const els = e.currentTarget.elements;
    mutate({
      name: (els.namedItem("name") as HTMLInputElement).value,
      email: (els.namedItem("email") as HTMLInputElement).value,
      phone: (els.namedItem("phone") as HTMLInputElement).value,
    });
  }

  return (
    <div className="bg-white/[0.03] backdrop-blur-sm border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl">
      {isSuccess ? (
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
            onClick={reset}
            className="mt-2 text-sm text-gray-500 underline hover:text-white transition-colors"
          >
            Subscribe another
          </button>
        </div>
      ) : (
        <>
          <h3 className="text-xl font-bold mb-6">Join Our Update List</h3>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <InputField
              name="name"
              label="Full Name"
              type="text"
              placeholder="John Doe"
              disabled={isPending}
            />
            <InputField
              name="email"
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              disabled={isPending}
            />
            <InputField
              name="phone"
              label="Phone Number"
              type="tel"
              placeholder="+1 (555) 000-0000"
              disabled={isPending}
            />

            {isError && (
              <p className="text-sm text-red-400 text-center">
                Something went wrong — please try again.
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-white text-black font-extrabold py-4 rounded-xl hover:bg-gray-200 transition-all active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
        </>
      )}
    </div>
  );
}

function InputField({
  name,
  label,
  type,
  placeholder,
  disabled,
}: {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1 block">
        {label}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required
        disabled={disabled}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white transition-all text-white placeholder:text-gray-600 disabled:opacity-50"
      />
    </div>
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
