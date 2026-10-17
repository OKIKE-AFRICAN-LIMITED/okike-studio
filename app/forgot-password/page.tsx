"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AuthShell } from "@/components/auth/auth-shell";
import { CheckCircle2, ShieldAlert, ArrowRight, KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    if (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to initiate password reset. Please try again.",
      });
    } else {
      setMessage({
        type: "success",
        text: `Instructions to reset your password have been dispatched to ${email}.`,
      });
    }

    setLoading(false);
  };

  return (
    <AuthShell
      title="Reset Password"
      subtitle="Enter your verified account email to receive a secure recovery link."
      badge="Account Recovery"
      footerLink={{
        prompt: "Remembered your credentials?",
        label: "Return to Sign In",
        href: "/login",
      }}
    >
      {message && (
        <div
          className={`mb-6 p-4 text-xs border ${
            message.type === "error"
              ? "bg-red-950/40 border-red-800 text-red-200"
              : "bg-emerald-950/40 border-emerald-800 text-emerald-200"
          }`}
        >
          {message.type === "error" ? (
            <ShieldAlert className="inline mr-2 h-4 w-4 text-red-400 align-text-bottom" />
          ) : (
            <CheckCircle2 className="inline mr-2 h-4 w-4 text-emerald-400 align-text-bottom" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="forgot-email"
            className="block text-xs font-bold uppercase tracking-wider text-[#a8a8a3] mb-2"
          >
            Registered Email Address
          </label>
          <input
            id="forgot-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            className="w-full bg-[#090909] border border-[#2e2e2e] px-4 py-3 text-sm text-white placeholder-[#555] focus:outline-none focus:border-lime transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 flex items-center justify-center gap-2 bg-lime text-[#0e0e0e] hover:bg-white font-extrabold text-xs uppercase tracking-wider py-3.5 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <span>Sending Link...</span>
          ) : (
            <>
              <span>Dispatch Recovery Link</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
}
