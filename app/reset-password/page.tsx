"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthShell } from "@/components/auth/auth-shell";
import { CheckCircle2, ShieldAlert, ArrowRight, Lock } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setLoading(true);
    setMessage(null);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to update password. Your recovery link may have expired.",
      });
      setLoading(false);
    } else {
      setMessage({
        type: "success",
        text: "Your password has been successfully updated! Redirecting to workspace...",
      });
      setTimeout(() => {
        router.push("/portal");
      }, 1500);
    }
  };

  return (
    <AuthShell
      title="Set New Password"
      subtitle="Define a secure new password for your OKIKE workspace account."
      badge="Security Update"
      footerLink={{
        prompt: "Return to login?",
        label: "Sign In",
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
            htmlFor="new-password"
            className="block text-xs font-bold uppercase tracking-wider text-[#a8a8a3] mb-2"
          >
            New Password
          </label>
          <input
            id="new-password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimum 8 characters"
            className="w-full bg-[#090909] border border-[#2e2e2e] px-4 py-3 text-sm text-white placeholder-[#555] focus:outline-none focus:border-lime transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="confirm-password"
            className="block text-xs font-bold uppercase tracking-wider text-[#a8a8a3] mb-2"
          >
            Confirm New Password
          </label>
          <input
            id="confirm-password"
            type="password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password"
            className="w-full bg-[#090909] border border-[#2e2e2e] px-4 py-3 text-sm text-white placeholder-[#555] focus:outline-none focus:border-lime transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 flex items-center justify-center gap-2 bg-lime text-[#0e0e0e] hover:bg-white font-extrabold text-xs uppercase tracking-wider py-3.5 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <span>Updating Password...</span>
          ) : (
            <>
              <span>Save &amp; Enter Workspace</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
}
