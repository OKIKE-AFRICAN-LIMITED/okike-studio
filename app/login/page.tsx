"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthShell } from "@/components/auth/auth-shell";
import { CheckCircle2, ArrowRight, ShieldAlert, KeyRound, Sparkles } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const initialRole = searchParams.get("role") || "client";
  const notice = searchParams.get("notice");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<"password" | "magic">("password");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(
    notice === "admin_required"
      ? {
          type: "error",
          text: "Administrator privileges required. Please sign in with an authorised studio account.",
        }
      : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = createClient();

    if (authMode === "password") {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage({
          type: "error",
          text: error.message || "Invalid credentials. Please verify your email and password.",
        });
        setLoading(false);
        return;
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

        const userRole = profile?.role || data.user.user_metadata?.role || "client";

        if (userRole === "admin") {
          router.push(redirectTo || "/admin");
        } else {
          router.push("/portal");
        }
        router.refresh();
      }
    } else {
      const destination = redirectTo || (initialRole === "admin" ? "/admin" : "/portal");
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
            destination
          )}`,
        },
      });

      if (error) {
        setMessage({
          type: "error",
          text: error.message || "Failed to dispatch magic link.",
        });
      } else {
        setMessage({
          type: "success",
          text: `A secure login link was dispatched to ${email}. Check your email to access your workspace.`,
        });
      }
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Sign In"
      subtitle="Access your Client Workspace or Studio Command."
      badge={initialRole === "admin" ? "Studio Command Login" : "Client Workspace Access"}
      footerLink={{
        prompt: "Don't have a client account yet?",
        label: "Create an Account",
        href: "/signup",
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
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="login-email"
            className="block text-xs font-bold uppercase tracking-wider text-[#a8a8a3] mb-2"
          >
            Email Address
          </label>
          <input
            id="login-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            className="w-full bg-[#090909] border border-[#2e2e2e] px-4 py-3 text-sm text-white placeholder-[#555] focus:outline-none focus:border-lime transition-colors"
          />
        </div>

        {authMode === "password" && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="login-password"
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
              id="login-password"
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
            <span>Authenticating...</span>
          ) : authMode === "password" ? (
            <>
              <span>Sign In to Workspace</span>
              <ArrowRight className="h-4 w-4" />
            </>
          ) : (
            <>
              <span>Dispatch Magic Link</span>
              <Sparkles className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center text-[#70706b] text-xs uppercase tracking-wider">
          Initialising Authentication...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
