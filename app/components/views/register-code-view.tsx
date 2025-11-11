"use client";

import { useState } from "react";
import { WaterDroplet } from "../icons-and-images/water-droplet";
import { RegisterCodeRequest } from "../../api/types/register-code";

interface RegisterCodeViewProps {
  code: string;
  setRegistered: (registered: boolean) => void;
}

export function RegisterCodeView({
  code,
  setRegistered,
}: RegisterCodeViewProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleKickstarterClick = () => {
    const baseUrl =
      "https://www.kickstarter.com/projects/noonesark/no-ones-ark-the-most-biblical-campaign-ever";
    const kickstarterUrl = `${baseUrl}?ref=${encodeURIComponent(code)}`;
    window.open(kickstarterUrl, "_blank");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    const nickname = `${firstName.trim()} ${lastName.trim()}`.trim();

    const request: RegisterCodeRequest = {
      code,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      nickname: nickname || firstName.trim() || lastName.trim() || "User",
    };

    try {
      const response = await fetch("/api/register-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitMessage({
          type: "success",
          text: data.message || "Code registered successfully!",
        });
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setRegistered(true);
      } else {
        setSubmitMessage({
          type: "error",
          text: data.message || "Failed to register code. Please try again.",
        });
      }
    } catch (error) {
      setSubmitMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center px-3 sm:px-4 py-4">
      <div className="w-full max-w-md sm:max-w-lg bg-slate-950/70 border border-sky-500/35 rounded-3xl px-4 sm:px-6 py-4 sm:py-6 shadow-2xl shadow-sky-900/40 backdrop-blur-md">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h1
            className="text-lg sm:text-2xl font-bold text-slate-50 mb-1"
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            Register your code
          </h1>
          <p className="text-[0.7rem] sm:text-sm text-slate-300">
            Lock in your splash and join the ripple map.
          </p>
        </div>

        {/* Form */}
        <div className="bg-slate-900/60 border border-sky-500/20 rounded-2xl px-3 sm:px-4 py-3 sm:py-4">
          <form
            onSubmit={handleSubmit}
            className="space-y-3 sm:space-y-4 text-slate-100"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                required
                className="bg-slate-950/70 border border-sky-500/30 rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400/70 focus:border-sky-300 transition"
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                required
                className="bg-slate-950/70 border border-sky-500/30 rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400/70 focus:border-sky-300 transition"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="bg-slate-950/70 border border-sky-500/30 rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400/70 focus:border-sky-300 transition"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone"
                required
                className="bg-slate-950/70 border border-sky-500/30 rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400/70 focus:border-sky-300 transition"
              />
            </div>

            {submitMessage && (
              <div
                className={`mt-1 p-2 sm:p-3 rounded-xl text-center text-[0.7rem] sm:text-sm ${
                  submitMessage.type === "success"
                    ? "bg-emerald-500/15 border border-emerald-400/40 text-emerald-200"
                    : "bg-red-500/15 border border-red-400/40 text-red-200"
                }`}
              >
                {submitMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-1 bg-sky-500/90 hover:bg-sky-400 active:bg-sky-600 disabled:bg-sky-500/50 disabled:cursor-not-allowed text-white font-semibold rounded-full px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base shadow-lg shadow-sky-500/40 transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSubmitting ? "Registering..." : "Register Code"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
