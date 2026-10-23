"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthShell } from "@/components/auth/auth-shell";
import {
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Eye,
  EyeOff,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const notice = searchParams.get("notice");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(
    notice === "admin_required"
      ? {
          type: "error",
          text: "Administrator privileges required. Please sign in with an authorised studio account.",
        }
      : notice === "signed_out"
      ? {
          type: "success",
          text: "You have been successfully signed out of your workspace session.",
        }
      : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = createClient();

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

      const userRole =
        profile?.role ||
        data.user.user_metadata?.role ||
        (data.user.email === "okikeafricanlimited@gmail.com" ? "admin" : "client");

      if (userRole === "admin") {
        router.push(redirectTo || "/admin");
      } else {
        router.push(redirectTo || "/portal");
      }
      router.refresh();
    }
  };

  return (
    <AuthShell
      title="Sign In"
      subtitle="Enter your credentials to access your workspace."
      badge="Workspace Access"
      footerLink={{
        prompt: "Don't have a client account yet?",
        label: "Create an Account",
        href: "/signup",
      }}
    >
      {message && (
        <div
          className={`mb-4 p-3 text-xs border ${
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
            htmlFor="login-email"
            className="block text-xs font-bold uppercase tracking-wider text-[#a8a8a3] mb-1.5"
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
            className="w-full bg-[#090909] border border-[#2e2e2e] px-3.5 py-2.5 text-sm text-white placeholder-[#555] focus:outline-none focus:border-lime transition-colors"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
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
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#090909] border border-[#2e2e2e] pl-3.5 pr-10 py-2.5 text-sm text-white placeholder-[#555] focus:outline-none focus:border-lime transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#70706b] hover:text-white transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 flex items-center justify-center gap-2 bg-lime text-[#0e0e0e] hover:bg-white font-extrabold text-xs uppercase tracking-wider py-3 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
        >
          {loading ? (
            <span>Authenticating...</span>
          ) : (
            <>
              <span>Sign In to Workspace</span>
              <ArrowRight className="h-4 w-4" />
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
        <div className="h-screen bg-[#0e0e0e] flex items-center justify-center text-[#70706b] text-xs uppercase tracking-wider">
          Initialising Authentication...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
