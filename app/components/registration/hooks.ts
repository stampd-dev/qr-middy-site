// components/registration/hooks.ts
"use client";

import { useEffect, useState } from "react";
import { createFingerprint } from "../../utils/fingerprint";

export type ReferralLookupResult = {
  /** The code we ended up using (may be the fallback "eef4cb") */
  code: string;
  /** Whether this code has already been registered */
  registered: boolean;
  /** Optional display name, only present when registered */
  name?: string;
  /** Referral link URL from backend */
  referralLink?: string;
  /** QR code download URL from S3 */
  qrCodeDownloadUrl?: string;
};

type ErrorWithStatus = Error & {
  status?: number;
};

type ReferralLookupState =
  | { loading: true; error: null; result: null }
  | {
      loading: false;
      error: string | null;
      result: ReferralLookupResult | null;
    };

/**
 * Fetches referral code information from the backend API.
 * Returns referral lookup result or throws an error with status code.
 */
async function fetchReferralInfo(
  codeFromUrl: string | null,
  fingerprint: string
): Promise<ReferralLookupResult> {
  // No code in URL → fallback
  if (!codeFromUrl) {
    return {
      code: "eef4cb",
      registered: false,
    };
  }

  const response = await fetch("/api/get-metrics-by-code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: codeFromUrl,
      fingerprint,
    }),
  });

  if (!response.ok) {
    const error: ErrorWithStatus = new Error(
      `Failed to fetch referral info: ${response.status}`
    );
    error.status = response.status;
    throw error;
  }

  const data = await response.json();

  if (!data.success) {
    const error: ErrorWithStatus = new Error(data.message || "Unknown error");
    error.status = response.status;
    throw error;
  }

  const { registered, record, referral_link, qr_code_download_url } = data;
  const name =
    record.referrerName ||
    (record.firstName && record.lastName
      ? `${record.firstName} ${record.lastName}`
      : record.firstName || record.lastName || undefined);

  return {
    code: record.referalCode || codeFromUrl,
    registered: registered || false,
    name,
    referralLink: referral_link,
    qrCodeDownloadUrl: qr_code_download_url,
  };
}

/**
 * Hook that:
 * - Reads the raw ref code (from URL, passed in by caller)
 * - Applies the fallback "eef4cb" logic on:
 *   - missing code
 *   - 400/404 from backend
 */
export function useReferralLookup(rawCode: string | null): ReferralLookupState {
  const [state, setState] = useState<ReferralLookupState>({
    loading: true,
    error: null,
    result: null,
  });

  // Generate fingerprint once and reuse
  const [fingerprint, setFingerprint] = useState<string>("");
  useEffect(() => {
    createFingerprint()
      .then(setFingerprint)
      .catch(() => {
        setFingerprint("unknown");
      });
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      console.log("Running lookup for code:", rawCode);
      setState({ loading: true, error: null, result: null });

      if (!rawCode) {
        console.log("Fallback to eef4cb");
        /** Reload page with fallback code */
        window.location.href = `/?ref=eef4cb`;
      }

      // Wait for fingerprint if not ready
      if (!fingerprint) {
        return;
      }

      try {
        const result = await fetchReferralInfo(rawCode, fingerprint);
        if (cancelled) return;
        setState({ loading: false, error: null, result });
      } catch (err: unknown) {
        if (cancelled) return;

        const error = err as ErrorWithStatus;
        const status = error?.status;
        // Fallback logic: 400/404 or no code → fallback "eef4cb"
        if (!rawCode || status === 400 || status === 404) {
          console.log("Fallback to eef4cb");
          /** Reload page with fallback code */
          window.location.href = `/?ref=eef4cb`;
        } else {
          setState({
            loading: false,
            error: error?.message ?? "Unknown error",
            result: null,
          });
        }
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [rawCode, fingerprint]);

  return state;
}

/**
 * Registration hook that POSTs to the backend API.
 */
type RegisterPayload = {
  code: string;
  name: string;
  email: string;
  phone: string;
};

type UseRegisterReferralReturn = {
  register: (payload: RegisterPayload) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
};

/**
 * Parses a name string into firstName, lastName, and nickname.
 * Simple heuristic: first word is firstName, rest is lastName, full name is nickname.
 */
function parseName(name: string): {
  firstName: string;
  lastName: string;
  nickname: string;
} {
  const trimmed = name.trim();
  if (!trimmed) {
    return { firstName: "", lastName: "", nickname: "" };
  }

  const parts = trimmed.split(/\s+/);
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ") || "";
  const nickname = trimmed;

  return { firstName, lastName, nickname };
}

export function useRegisterReferral(): UseRegisterReferralReturn {
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Generate fingerprint once and reuse
  const [fingerprint, setFingerprint] = useState<string>("");
  useEffect(() => {
    createFingerprint()
      .then(setFingerprint)
      .catch(() => {
        setFingerprint("unknown");
      });
  }, []);

  const register = async (payload: RegisterPayload) => {
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Basic validation
      if (
        !payload.name.trim() ||
        !payload.email.trim() ||
        !payload.phone.trim()
      ) {
        throw new Error("Please fill out all fields.");
      }

      const { firstName, lastName, nickname } = parseName(payload.name);

      const response = await fetch("/api/register-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: payload.code,
          firstName,
          lastName,
          email: payload.email,
          phone: payload.phone,
          nickname,
          // ip will be extracted server-side from request headers
          fingerprint: fingerprint || "unknown",
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data.message || `Registration failed: ${response.status}`
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccess(true);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error?.message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return { register, isSubmitting, error, success };
}
