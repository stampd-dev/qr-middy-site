"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { createFingerprint } from "../../utils/fingerprint";
import { CreateNewReferrerResponse } from "../../api/types/create-new-referrer";

type NewReferrerFormProps = {
  onSuccess?: (response: CreateNewReferrerResponse) => void;
  onContinueWithoutCode?: () => void;
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

export function NewReferrerForm({
  onSuccess,
  onContinueWithoutCode,
}: NewReferrerFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fingerprint, setFingerprint] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);

  // Generate fingerprint once on mount
  useEffect(() => {
    createFingerprint()
      .then(setFingerprint)
      .catch(() => {
        setFingerprint("unknown");
      });
  }, []);

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
    setError(null);
    setIsSubmitting(true);

    try {
      // Basic validation
      if (
        !firstName.trim() ||
        !lastName.trim() ||
        !email.trim() ||
        !phone.trim()
      ) {
        throw new Error("Please fill out all fields.");
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Please enter a valid email address.");
      }

      // Phone validation (should have 10 digits)
      const phoneDigits = unformatPhoneNumber(phone);
      if (phoneDigits.length !== 10) {
        throw new Error("Please enter a valid 10-digit phone number.");
      }

      let response: Response;
      try {
        response = await fetch("/api/add-new-referrer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            email: email.trim(),
            phone: phoneDigits,
            ip: "unknown", // IP should be extracted server-side by route handler
            fingerprint: fingerprint || "unknown",
          }),
        });
      } catch {
        throw new Error(
          "Creation of your code failed due to a network error. Please check your connection and try again, or email float@noonesark.org for support if the issue persists."
        );
      }

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const errorMessage =
          data.error || `Failed to add referrer: ${response.status}`;
        throw new Error(
          `Creation of your code failed. ${errorMessage} Please try again, or email float@noonesark.org for support if the issue persists.`
        );
      }

      const data: CreateNewReferrerResponse = await response.json();

      if (!data.success) {
        throw new Error(
          `Creation of your code failed. ${
            data.message || "Unknown error"
          }. Please try again, or email float@noonesark.org for support if the issue persists.`
        );
      }

      // Reset form on success
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhone("");
      setError(null);

      if (onSuccess) {
        onSuccess(data);
      }
    } catch (err: unknown) {
      const error = err as Error;
      // If error already includes the support message, use it as-is
      // Otherwise, wrap it with the support message
      if (error.message.includes("float@noonesark.org")) {
        setError(error.message);
      } else {
        setError(
          `Creation of your code failed. ${
            error.message || "Something went wrong"
          }. Please try again, or email float@noonesark.org for support if the issue persists.`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={formContainerRef}>
      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <div>
          <label className="mb-1 block text-[11px] font-semibold text-sky-200">
            First Name
          </label>
          <input
            type="text"
            className="w-full rounded-xl border border-slate-600 bg-slate-950/70 px-3 py-2 text-xs text-sky-50 outline-none ring-sky-400/60 placeholder:text-slate-400 focus:ring-2"
            placeholder="John"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            onBlur={handleInputBlur}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-[11px] font-semibold text-sky-200">
            Last Name
          </label>
          <input
            type="text"
            className="w-full rounded-xl border border-slate-600 bg-slate-950/70 px-3 py-2 text-xs text-sky-50 outline-none ring-sky-400/60 placeholder:text-slate-400 focus:ring-2"
            placeholder="Doe"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            onBlur={handleInputBlur}
            required
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
            required
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
            required
          />
        </div>

        {error && (
          <div className="rounded-xl bg-red-900/40 px-3 py-2 text-[11px] text-red-100">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !fingerprint}
          className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-sky-400 px-4 py-2 text-[12px] font-semibold text-slate-950 shadow-lg shadow-sky-500/40 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:bg-sky-500/60"
        >
          {isSubmitting ? "Adding referrer…" : "Add New Referrer"}
        </button>

        {onContinueWithoutCode && (
          <button
            type="button"
            onClick={onContinueWithoutCode}
            disabled={isSubmitting}
            className="mt-2 inline-flex w-full items-center justify-center rounded-full border border-slate-600 bg-slate-800/50 px-4 py-2 text-[12px] font-semibold text-sky-200 shadow-lg transition hover:bg-slate-700/50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue without getting a code
          </button>
        )}
      </form>
    </div>
  );
}
