// components/registration/RegistrationGate.tsx
"use client";

import { FormEvent, useRef, useState } from "react";
import { ReferralLookupResult } from "./hooks";

type RegistrationGateProps = {
  /** What to show once the user is considered "registered" */
  children: React.ReactNode;
  loading: boolean;
  error: string | null;
  result: ReferralLookupResult | null;
  /** The code to use for registration (from URL, not from API fallback) */
  registrationCode: string;
  hasCompleted: boolean;
  register: (payload: {
    code: string;
    name: string;
    email: string;
    phone: string;
  }) => Promise<void>;
  isSubmitting: boolean;
  submitError: string | null;
};

export function RegistrationGate({
  children,
  loading,
  error,
  result,
  registrationCode,
  hasCompleted,
  register,
  isSubmitting,
  submitError,
}: RegistrationGateProps) {
  // While we're looking up the code, just show a subtle loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-sky-100">
        <div className="rounded-2xl bg-slate-900/80 px-6 py-4 text-sm text-sky-200 shadow-lg shadow-slate-900">
          Validating your splash code…
        </div>
      </div>
    );
  }

  // If lookup totally failed (non 400/404, non-fallback scenario)
  if (error || !result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-sky-100">
        <div className="rounded-2xl bg-red-900/40 px-6 py-4 text-sm text-red-100 shadow-lg shadow-red-900/60">
          Something went wrong loading your code. Please try again later.
        </div>
      </div>
    );
  }

  const { registered, name } = result;

  // If already registered (or we've just completed local registration),
  // skip the registration UI and show the main experience.
  if (registered || hasCompleted) {
    return <>{children}</>;
  }

  // Otherwise, show first-time registration form.
  // Use registrationCode (from URL) instead of result.code (which might be fallback)
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-sky-50">
      <div className="relative max-w-md w-full mx-4 rounded-3xl border border-sky-500/40 bg-slate-900/80 px-7 py-6 shadow-2xl shadow-slate-950/80 backdrop-blur-md">
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-sky-300">
          Claim your ripple
        </div>

        <h1 className="mb-3 text-xl font-semibold text-sky-50">
          Finish setting up your code.
        </h1>

        <p className="mb-4 text-xs text-sky-200/85">
          You&apos;re activating splash code{" "}
          <span className="font-semibold text-sky-300">{registrationCode}</span>
          {name && name !== "unassigned" && (
            <>
              {" "}
              for <span className="font-semibold text-sky-100">{name}</span>
            </>
          )}
          .
        </p>

        <RegistrationForm
          code={registrationCode}
          isSubmitting={isSubmitting}
          submitError={submitError}
          onSubmit={register}
        />
      </div>
    </div>
  );
}

type RegistrationFormProps = {
  code: string;
  isSubmitting: boolean;
  submitError: string | null;
  onSubmit: (payload: {
    code: string;
    name: string;
    email: string;
    phone: string;
  }) => Promise<void>;
};

/**
 * Formats phone number input as (XXX) XXX-XXXX
 * Strips non-digits and applies formatting
 */
function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

/**
 * Strips formatting from phone number, returning only digits
 */
function unformatPhoneNumber(value: string): string {
  return value.replace(/\D/g, "");
}

function RegistrationForm({
  code,
  isSubmitting,
  submitError,
  onSubmit,
}: RegistrationFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const formContainerRef = useRef<HTMLDivElement>(null);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const digits = unformatPhoneNumber(input);
    // Limit to 10 digits
    if (digits.length <= 10) {
      setPhone(formatPhoneNumber(digits));
    }
  };

  /**
   * Handles blur events to resize viewport and scroll form into view on mobile.
   * This ensures the form remains visible after keyboard dismissal.
   */
  const handleInputBlur = () => {
    // Small delay to allow keyboard to dismiss first
    setTimeout(() => {
      if (formContainerRef.current) {
        // Scroll the form container into view, centering it
        formContainerRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      // Trigger a resize event to help mobile browsers recalculate viewport
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("resize"));
      }
    }, 100);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onSubmit({ code, name, email, phone: unformatPhoneNumber(phone) });
  };

  return (
    <div ref={formContainerRef}>
      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <div>
          <label className="mb-1 block text-[11px] font-semibold text-sky-200">
            Name or team name
          </label>
          <input
            type="text"
            className="w-full rounded-xl border border-slate-600 bg-slate-950/70 px-3 py-2 text-xs text-sky-50 outline-none ring-sky-400/60 placeholder:text-slate-400 focus:ring-2"
            placeholder="e.g. Scott / No One's Ark"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleInputBlur}
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-semibold text-sky-200">
            Email
          </label>
          <input
            type="email"
            className="w-full rounded-xl border border-slate-600 bg-slate-950/70 px-3 py-2 text-xs text-sky-50 outline-none ring-sky-400/60 placeholder:text-slate-400 focus:ring-2"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleInputBlur}
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-semibold text-sky-200">
            Phone
          </label>
          <input
            type="tel"
            className="w-full rounded-xl border border-slate-600 bg-slate-950/70 px-3 py-2 text-xs text-sky-50 outline-none ring-sky-400/60 placeholder:text-slate-400 focus:ring-2"
            placeholder="(555) 123-4567"
            value={phone}
            onChange={handlePhoneChange}
            onBlur={handleInputBlur}
            maxLength={14}
          />
        </div>

        {submitError && (
          <div className="rounded-xl bg-red-900/40 px-3 py-2 text-[11px] text-red-100">
            {submitError}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-sky-400 px-4 py-2 text-[12px] font-semibold text-slate-950 shadow-lg shadow-sky-500/40 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:bg-sky-500/60"
        >
          {isSubmitting ? "Activating…" : "Activate my splash code"}
        </button>

        <p className="mt-2 text-[10px] text-slate-400">
          By activating, you agree to let us track anonymous scan activity for
          this code and display aggregate stats on this page.
        </p>
      </form>
    </div>
  );
}
