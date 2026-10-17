"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthShell } from "@/components/auth/auth-shell";
import { CheckCircle2, ArrowRight, ShieldAlert, Sparkles, UserPlus } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);
  const [signedUpSuccess, setSignedUpSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          company_name: companyName,
          role: "client",
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/portal`,
      },
    });

    if (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to create account. Please check your information.",
      });
      setLoading(false);
      return;
    }

    if (data.user) {
      try {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          email: data.user.email || email,
          full_name: fullName,
          company_name: companyName,
          role: "client",
        });
      } catch {
        // Handled by database trigger
      }

      if (data.session) {
        router.push("/portal");
        router.refresh();
        return;
      }
    }

    setSignedUpSuccess(true);
    setLoading(false);
  };

  return (
    <AuthShell
      title="Create Account"
      subtitle="Register your client workspace to track briefs, sprints, and staging builds."
      badge="Client Workspace Onboarding"
      footerLink={{
        prompt: "Already have an account?",
        label: "Sign In Here",
        href: "/login",
      }}
    >
      {signedUpSuccess ? (
        <div className="space-y-6 text-center py-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-lime/10 border border-lime/30 text-lime">
            <CheckCircle2 className="h-7 w-7 text-lime" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold uppercase text-white tracking-tight">
              Confirmation Dispatched
            </h2>
            <p className="mt-2 text-xs text-[#a8a8a3] leading-relaxed">
              We dispatched an account verification email to{" "}
              <strong className="text-white">{email}</strong>. Click the secure link in your inbox to enter your workspace.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-lime text-[#0e0e0e] hover:bg-white px-6 py-3 text-xs font-extrabold uppercase tracking-wider transition-colors"
          >
            <span>Proceed to Sign In</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {message && (
            <div
              className={`p-4 text-xs border ${
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="signup-name"
                className="block text-xs font-bold uppercase tracking-wider text-[#a8a8a3] mb-1.5"
              >
                Full Name
              </label>
              <input
                id="signup-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alexander Wright"
                className="w-full bg-[#090909] border border-[#2e2e2e] px-4 py-2.5 text-sm text-white placeholder-[#555] focus:outline-none focus:border-lime transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="signup-company"
                className="block text-xs font-bold uppercase tracking-wider text-[#a8a8a3] mb-1.5"
              >
                Company
              </label>
              <input
                id="signup-company"
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Aether Dynamics"
                className="w-full bg-[#090909] border border-[#2e2e2e] px-4 py-2.5 text-sm text-white placeholder-[#555] focus:outline-none focus:border-lime transition-colors"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="signup-email"
              className="block text-xs font-bold uppercase tracking-wider text-[#a8a8a3] mb-1.5"
            >
              Work Email
            </label>
            <input
              id="signup-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alexander@aether.io"
              className="w-full bg-[#090909] border border-[#2e2e2e] px-4 py-2.5 text-sm text-white placeholder-[#555] focus:outline-none focus:border-lime transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="signup-password"
              className="block text-xs font-bold uppercase tracking-wider text-[#a8a8a3] mb-1.5"
            >
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
              className="w-full bg-[#090909] border border-[#2e2e2e] px-4 py-2.5 text-sm text-white placeholder-[#555] focus:outline-none focus:border-lime transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 flex items-center justify-center gap-2 bg-lime text-[#0e0e0e] hover:bg-white font-extrabold text-xs uppercase tracking-wider py-3.5 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span>Creating Client Account...</span>
            ) : (
              <>
                <span>Register Workspace</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
