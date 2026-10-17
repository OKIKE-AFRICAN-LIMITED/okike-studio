"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthShell } from "@/components/auth/auth-shell";
import { ArrowRight, Sparkles, CheckCircle2, ShieldAlert } from "lucide-react";

export default function ClientLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<"magic" | "password">("magic");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = createClient();

    if (authMode === "magic") {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/portal`,
        },
      });

      if (error) {
        setMessage({
          type: "error",
          text: error.message || "Failed to send magic link.",
        });
      } else {
        setMessage({
          type: "success",
          text: `A secure login link was dispatched to ${email}. Check your email to access your workspace.`,
        });
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage({
          type: "error",
          text: error.message || "Unable to sign in with password.",
        });
      } else if (data.user) {
        router.push("/portal");
        router.refresh();
      }
    }

    setLoading(false);
  };

  return (
    <AuthShell
      title="Client Portal Login"
      subtitle="Access your project pulse, sprint timelines, and asset vault."
      badge="Client Workspace"
      footerLink={{
        prompt: "Need a new project engagement?",
        label: "Submit a Project Brief",
        href: "/enquiry",
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

      {/* Mode Switcher */}
      <div className="flex border-b border-[#262626] mb-6">
        <button
          type="button"
          onClick={() => {
            setAuthMode("magic");
            setMessage(null);
          }}
          className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider text-center transition-colors ${
            authMode === "magic"
              ? "text-lime border-b-2 border-lime"
              : "text-[#70706b] hover:text-white"
          }`}
        >
          Magic Link
        </button>
        <button
          type="button"
          onClick={() => {
            setAuthMode("password");
            setMessage(null);
          }}
          className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider text-center transition-colors ${
            authMode === "password"
              ? "text-lime border-b-2 border-lime"
              : "text-[#70706b] hover:text-white"
          }`}
        >
          Password
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="client-email"
            className="block text-xs font-bold uppercase tracking-wider text-[#a8a8a3] mb-2"
          >
            Client Work Email
          </label>
          <input
            id="client-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alexander@company.com"
            className="w-full bg-[#090909] border border-[#2e2e2e] px-4 py-3 text-sm text-white placeholder-[#555] focus:outline-none focus:border-lime transition-colors"
          />
        </div>

        {authMode === "password" && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="client-password"
                className="block text-xs font-bold uppercase tracking-wider text-[#a8a8a3]"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-[#70706b] hover:text-lime transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="client-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#090909] border border-[#2e2e2e] px-4 py-3 text-sm text-white placeholder-[#555] focus:outline-none focus:border-lime transition-colors"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 flex items-center justify-center gap-2 bg-lime text-[#0e0e0e] hover:bg-white font-extrabold text-xs uppercase tracking-wider py-3.5 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <span>Processing...</span>
          ) : authMode === "magic" ? (
            <>
              <span>Dispatch Magic Link</span>
              <Sparkles className="h-4 w-4" />
            </>
          ) : (
            <>
              <span>Enter Workspace</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
}
