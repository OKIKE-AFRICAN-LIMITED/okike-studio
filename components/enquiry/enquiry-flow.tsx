"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { pricingPackages } from "@/lib/pricing";
import {
  buildPayload,
  type EnquiryAnswers,
  type PackageId,
  type ServiceId,
  payloadErrors,
  servicesForPackage,
} from "@/lib/enquiry";
import { Sparkles, Check, ArrowRight, Loader2 } from "lucide-react";
import type { ScopingAssistResponse } from "@/app/api/enquiry/assist/route";

const serviceOptions = [
  { id: "brand", label: "Brand identity", detail: "Positioning, visual identity and brand direction." },
  { id: "website", label: "Website", detail: "A new website or improvements to an existing one." },
  { id: "software", label: "Custom software", detail: "A product, platform or business workflow." },
] as const;

const emptyAnswers: EnquiryAnswers = {
  goal: "",
  brand: "",
  website: "",
  software: "",
  budget: "",
  timing: "",
  name: "",
  email: "",
  company: "",
};

type Preview = "validation" | "sending" | "failure" | "confirmation";

function Field({
  id,
  label,
  value,
  placeholder,
  required,
  error,
  multiline = false,
  onChange,
}: {
  id: keyof EnquiryAnswers;
  label: string;
  value: string;
  placeholder: string;
  required?: boolean;
  error?: string;
  multiline?: boolean;
  onChange: (value: string) => void;
}) {
  const classes = `min-h-[64px] w-full resize-y border bg-white px-3 py-3 text-[16px]/[24px] outline-none focus:border-ink focus:outline-2 focus:outline-offset-2 ${
    error ? "border-error" : "border-[#969690]"
  }`;
  const maxLength =
    id === "goal"
      ? 2000
      : id === "brand" || id === "website" || id === "software"
      ? 3000
      : id === "email"
      ? 254
      : id === "company"
      ? 160
      : id === "name"
      ? 120
      : 200;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[14px]/[20px] font-medium" htmlFor={id}>
        {label}
        {required ? " *" : ""}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={id}
          data-lenis-prevent
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(e) => onChange(e.target.value)}
          className={`${classes} min-h-[88px]`}
        />
      ) : (
        <input
          id={id}
          name={id}
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          required={required}
          type={id === "email" ? "email" : "text"}
          autoComplete={id === "name" ? "name" : id === "email" ? "email" : id === "company" ? "organization" : "off"}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(e) => onChange(e.target.value)}
          className={classes}
        />
      )}
      {error && (
        <p id={`${id}-error`} className="text-[13px]/[18px] text-error">
          {error}
        </p>
      )}
    </div>
  );
}

export function EnquiryFlow({
  initialPackageId,
  preview,
}: {
  initialPackageId?: PackageId;
  preview?: Preview;
}) {
  const [step, setStep] = useState(preview === "validation" ? 2 : initialPackageId ? 1 : 0);
  const [services, setServices] = useState<ServiceId[]>(servicesForPackage(initialPackageId));
  const [help, setHelp] = useState(false);
  const [packageId, setPackageId] = useState<PackageId | undefined>(initialPackageId);
  const [choosingPackage, setChoosingPackage] = useState(false);
  const [answers, setAnswers] = useState(emptyAnswers);
  const [errors, setErrors] = useState<Record<string, string>>(
    preview === "validation" ? { name: "Enter your name.", email: "Enter a valid email address." } : {}
  );
  const [status, setStatus] = useState<"idle" | "sending" | "failure" | "confirmation">(
    preview === "sending"
      ? "sending"
      : preview === "failure"
      ? "failure"
      : preview === "confirmation"
      ? "confirmation"
      : "idle"
  );
  const [message, setMessage] = useState(
    preview === "failure"
      ? "We couldn’t send your enquiry. Your answers are still here. Try again or email studio@okike.com."
      : ""
  );
  const [companyWebsite, setCompanyWebsite] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [startedAt] = useState(() => Date.now());
  const [submissionId, setSubmissionId] = useState(() => crypto.randomUUID());
  const submittedContentRef = useRef("");
  const submittingRef = useRef(false);

  // AI Scoping Assistant State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiRecommendation, setAiRecommendation] = useState<ScopingAssistResponse | null>(null);
  const [assistantUsed, setAssistantUsed] = useState(false);
  const [adaptiveAnswers, setAdaptiveAnswers] = useState<Record<string, string>>({});

  // NDPA 2023 Consent
  const [consentGiven, setConsentGiven] = useState(true);

  useEffect(() => {
    headingRef.current?.focus();
  }, [step, choosingPackage]);

  const labels = services.map((id) => serviceOptions.find((x) => x.id === id)!.label);
  const selection = help ? "Help me decide (AI Scoped)" : labels.join(" + ");
  const pkg = pricingPackages.find((p) => p.id === packageId);

  const update = (id: keyof EnquiryAnswers, value: string) => {
    setAnswers((a) => ({ ...a, [id]: value }));
    setErrors((e) => ({ ...e, [id]: "" }));
  };

  const go = (next: number) => {
    setErrors({});
    setStep(next);
  };

  const continueFromServices = () => {
    if (!help && services.length === 0) {
      setErrors({ services: "Choose at least one service or select Help me decide." });
      return;
    }
    go(1);
  };

  // Call the AI Scoping Assistant
  const handleRunAiScoping = async () => {
    if (!answers.goal.trim() || answers.goal.trim().length < 5) {
      setAiError("Please type a sentence or two in the goal field above first.");
      return;
    }
    setAiLoading(true);
    setAiError("");

    try {
      const res = await fetch("/api/enquiry/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: answers.goal.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Scoping analysis unavailable.");
      }
      setAiRecommendation(data.data);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "Unable to run assistant.");
    } finally {
      setAiLoading(false);
    }
  };

  // Apply the AI Recommendation
  const handleApplyAiRecommendation = () => {
    if (!aiRecommendation) return;

    setPackageId(aiRecommendation.recommendedPackageId);
    setServices(aiRecommendation.recommendedServices as ServiceId[]);
    setHelp(false);
    setAssistantUsed(true);

    const draft = aiRecommendation.draftBrief;
    let refinedGoal = draft.summary || answers.goal;
    if (Object.keys(adaptiveAnswers).length > 0) {
      refinedGoal += "\n\nAdditional Scope Context:\n" +
        Object.entries(adaptiveAnswers)
          .map(([k, v]) => `• ${k}: ${v}`)
          .join("\n");
    }

    setAnswers((prev) => ({
      ...prev,
      goal: refinedGoal,
      ...(draft.brandNeeds ? { brand: draft.brandNeeds } : {}),
      ...(draft.websiteNeeds ? { website: draft.websiteNeeds } : {}),
      ...(draft.softwareNeeds ? { software: draft.softwareNeeds } : {}),
      budget: prev.budget || aiRecommendation.indicativePriceRange,
    }));
  };

  const validateScope = () => {
    const next: Record<string, string> = {};
    if (!answers.goal.trim()) next.goal = "Tell us about your goal.";
    setErrors(next);
    if (Object.keys(next).length) {
      setTimeout(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    go(2);
  };

  const submit = async () => {
    if (submittingRef.current) return;

    if (!consentGiven) {
      setErrors((prev) => ({ ...prev, consent: "Please accept the privacy notice to proceed." }));
      return;
    }

    const content = JSON.stringify({
      services,
      help,
      packageId,
      answers,
      companyWebsite,
      consentGiven,
      assistantUsed,
    });

    let requestId = submissionId;
    if (submittedContentRef.current !== content) {
      requestId = crypto.randomUUID();
      setSubmissionId(requestId);
      submittedContentRef.current = content;
    }

    const payload = buildPayload(
      services,
      help,
      packageId,
      answers,
      { id: requestId, startedAt, companyWebsite },
      {
        consent: consentGiven,
        assistantUsed,
        aiRecommendedPackage: aiRecommendation?.recommendedPackageId,
      }
    );

    const list = payloadErrors(payload);
    const next: Record<string, string> = {};
    if (!answers.name.trim()) next.name = "Enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(answers.email)) next.email = "Enter a valid email address.";
    if (list.length || Object.keys(next).length) {
      setErrors(next);
      setTimeout(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }

    submittingRef.current = true;
    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Submission failed.");
      setStatus("confirmation");
    } catch (error) {
      setStatus("failure");
      setMessage(error instanceof Error ? error.message : "Submission failed.");
    } finally {
      submittingRef.current = false;
    }
  };

  if (status === "confirmation")
    return (
      <main className="enquiry-page min-h-screen bg-paper px-6 py-9 text-ink md:px-10 lg:px-[120px] lg:py-16">
        <p className="text-[24px] font-extrabold tracking-tight">OKIKE STUDIO</p>
        <p className="mt-10 text-[12px] font-bold uppercase tracking-wider text-muted">ENQUIRY SUBMITTED</p>
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="mt-6 max-w-5xl text-[52px]/[.98] font-extrabold tracking-[-2px] md:text-[72px] lg:text-[100px]"
        >
          Thank you.
          <br />
          We’ll be in touch.
        </h1>
        <p className="mt-8 text-[18px]/[26px] max-w-2xl text-muted">
          Your project enquiry has been securely logged. Our studio lead will review the scope and reach out with
          discovery schedule details and an initial quotation.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex min-h-11 items-center font-bold uppercase tracking-wider text-xs underline underline-offset-4 hover:text-lime"
        >
          Return to OKIKE Studio
        </Link>
      </main>
    );

  const heading = choosingPackage
    ? "Choose your starting point."
    : step === 0
    ? "What do you need help with?"
    : step === 1
    ? services.length > 1
      ? "Connect the whole project."
      : services[0] === "brand"
      ? "Give the brand a clear direction."
      : services[0] === "software"
      ? "Define the product."
      : help
      ? "Tell us where you are."
      : "Plan the website."
    : "Let’s make it happen.";

  return (
    <main className="enquiry-page min-h-screen bg-paper px-5 py-7 text-ink md:px-10 lg:px-20 lg:py-9">
      <div className="mx-auto max-w-[1280px]">
        <p className="text-[20px]/[26px] font-extrabold tracking-tight">OKIKE STUDIO</p>
        <p className="mt-7 text-[12px]/[16px] font-bold uppercase tracking-wider text-muted">
          {step === 0
            ? "STEP 1 OF 3 / SERVICES"
            : step === 1
            ? "STEP 2 OF 3 / PROJECT & SCOPE"
            : "STEP 3 OF 3 / CONTACT & REVIEW"}
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-20">
          {/* Aside column */}
          <aside>
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="text-[40px]/[48px] font-extrabold tracking-[-1.5px] outline-none lg:text-[52px]/[48px]"
            >
              {heading}
            </h1>

            {step === 0 && !choosingPackage && (
              <div className="mt-7 max-w-[330px] text-[16px]/[22px]">
                <p className="font-bold text-xs uppercase tracking-wider text-muted mb-1">YOUR PROJECT</p>
                <p>Choose one service or combine them.</p>
                <p className="mt-5 text-muted text-sm">
                  Pick the closest fit. Your choices shape the questions that follow. Final quotes are confirmed following
                  studio review.
                </p>
              </div>
            )}

            {step > 0 && !choosingPackage && (
              <div className="mt-7 text-[16px]/[22px]">
                <p className="font-bold text-xs uppercase tracking-wider text-muted mb-1">YOUR SELECTION</p>
                <p className="font-extrabold text-lg">{selection || pkg?.name}</p>
                {pkg && <p className="mt-1 text-sm text-muted font-medium">{pkg.name} · {pkg.price}</p>}
                {assistantUsed && (
                  <span className="inline-flex items-center gap-1 mt-2 bg-lime text-ink text-[10px] font-extrabold px-2 py-0.5 uppercase tracking-wider">
                    <Sparkles className="h-2.5 w-2.5" /> AI Scoped
                  </span>
                )}
                <p className="mt-6 text-sm text-muted">
                  {step === 1
                    ? "Tell us about the project. Final scope and pricing follow partner review."
                    : "Review your brief and leave your contact details. No payment is taken here."}
                </p>
                <button
                  className="mt-6 min-h-11 text-xs uppercase tracking-wider font-extrabold underline underline-offset-4 cursor-pointer hover:text-muted"
                  onClick={() => {
                    setChoosingPackage(false);
                    go(0);
                  }}
                >
                  Change services
                </button>
              </div>
            )}
          </aside>

          {/* Form section */}
          <section className="bg-white p-4 md:p-6 lg:p-8 border border-ink/10 shadow-xs">
            {choosingPackage ? (
              <div className="grid gap-4">
                {pricingPackages.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setPackageId(p.id);
                      setServices(servicesForPackage(p.id));
                      setHelp(false);
                      setChoosingPackage(false);
                      go(1);
                    }}
                    className="min-h-[64px] border border-[#969690] p-4 text-left hover:border-ink transition-colors cursor-pointer"
                  >
                    <span className="block font-extrabold text-sm uppercase">{p.name}</span>
                    <span className="text-muted text-xs font-medium">
                      {p.price} · {p.scope}
                    </span>
                  </button>
                ))}
                <button
                  onClick={() => {
                    setPackageId(undefined);
                    setChoosingPackage(false);
                    go(0);
                  }}
                  className="min-h-[64px] border border-[#c7c7bf] p-4 text-left hover:border-ink transition-colors cursor-pointer"
                >
                  <span className="font-extrabold text-sm uppercase">Combine services</span>
                  <span className="block text-muted text-xs">
                    Build a brief around brand, website or software needs.
                  </span>
                </button>
              </div>
            ) : step === 0 ? (
              <>
                <div role="group" aria-describedby={errors.services ? "services-error" : undefined} className="grid gap-4">
                  {serviceOptions.map((option) => {
                    const selected = services.includes(option.id);
                    return (
                      <button
                        key={option.id}
                        aria-pressed={selected}
                        onClick={() => {
                          setHelp(false);
                          setServices((s) => (selected ? s.filter((x) => x !== option.id) : [...s, option.id]));
                          setErrors({});
                        }}
                        className={`min-h-[64px] border p-4 text-left transition-colors cursor-pointer ${
                          selected ? "border-ink bg-lime font-bold" : "border-[#969690] hover:border-ink"
                        }`}
                      >
                        <span className="font-extrabold text-sm uppercase">{option.label}</span>
                        <span className="block text-xs text-muted mt-0.5">{option.detail}</span>
                      </button>
                    );
                  })}

                  {/* Help me decide (AI scoping entry) */}
                  <button
                    aria-pressed={help}
                    onClick={() => {
                      setHelp(!help);
                      setServices([]);
                      setPackageId(undefined);
                      setErrors({});
                    }}
                    className={`min-h-[64px] border p-4 text-left transition-colors cursor-pointer ${
                      help ? "border-ink bg-lime font-bold" : "border-[#969690] hover:border-ink bg-paper/40"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm uppercase flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5" /> Help me decide
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-ink text-white">
                        AI Scoping
                      </span>
                    </div>
                    <span className="block text-xs text-muted mt-0.5">
                      Start with your concept. Our AI will analyze your scope, suggest a package, and provide indicative naira pricing.
                    </span>
                  </button>
                </div>

                {errors.services && (
                  <p id="services-error" role="alert" className="mt-3 text-error text-xs font-semibold">
                    {errors.services}
                  </p>
                )}

                <div className="mt-8 flex items-center justify-between pt-4 border-t border-ink/10">
                  <Link href="/studio" className="text-xs uppercase font-bold tracking-wider text-muted hover:text-ink">
                    Back to Studio
                  </Link>
                  <Button disabled={!help && services.length === 0} className="disabled:opacity-40" onClick={continueFromServices}>
                    Continue
                  </Button>
                </div>
              </>
            ) : step === 1 ? (
              <>
                <div className="grid gap-5">
                  {/* AI Scoping Assistant Card */}
                  {(help || !packageId) && (
                    <div className="border-2 border-ink bg-paper/60 p-4 sm:p-5 space-y-4">
                      <div className="flex items-center justify-between gap-2 border-b border-ink/15 pb-3">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="h-4 w-4 text-ink" />
                          <h2 className="text-xs font-extrabold uppercase tracking-wider text-ink">
                            Studio AI Scoping Assistant
                          </h2>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                          Indicative Guide
                        </span>
                      </div>

                      <p className="text-xs text-muted leading-relaxed">
                        Describe your concept in the field below. Our assistant will recommend the best package, draft a structured brief, and provide indicative pricing in Naira.
                      </p>

                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={handleRunAiScoping}
                          disabled={aiLoading}
                          className="inline-flex items-center gap-1.5 bg-ink text-white hover:bg-lime hover:text-ink px-4 py-2 text-xs uppercase tracking-wider font-extrabold transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {aiLoading ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin" /> Analyzing Project Scope…
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-3 w-3" /> Analyze &amp; Draft Brief with AI
                            </>
                          )}
                        </button>
                        {aiError && <p className="text-xs text-error font-medium">{aiError}</p>}
                      </div>

                      {/* Display Scoping Results */}
                      {aiRecommendation && (
                        <div className="mt-4 border border-ink/20 bg-white p-4 space-y-4 shadow-xs">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-ink/10 pb-3">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                                Recommended Match
                              </span>
                              <span className="font-extrabold text-sm uppercase text-ink">
                                {aiRecommendation.recommendedPackageName}
                              </span>
                            </div>
                            <div className="text-left sm:text-right">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                                Indicative Bracket
                              </span>
                              <span className="font-extrabold text-xs text-emerald-800">
                                {aiRecommendation.indicativePriceRange}
                              </span>
                            </div>
                          </div>

                          <div className="text-xs space-y-1.5">
                            <span className="font-bold text-ink uppercase text-[10px] tracking-wider block">
                              Studio Reasoning:
                            </span>
                            <p className="text-muted leading-relaxed">{aiRecommendation.reasoning}</p>
                          </div>

                          {/* Adaptive Follow-up Questions */}
                          {aiRecommendation.adaptiveQuestions?.length > 0 && (
                            <div className="space-y-3 pt-2 border-t border-ink/10">
                              <span className="font-bold text-ink uppercase text-[10px] tracking-wider block">
                                Tailored Questions for this Scope:
                              </span>
                              {aiRecommendation.adaptiveQuestions.map((q) => (
                                <div key={q.id} className="space-y-1 text-xs">
                                  <label className="text-muted font-medium">{q.label}</label>
                                  <input
                                    type="text"
                                    placeholder={q.placeholder}
                                    value={adaptiveAnswers[q.label] || ""}
                                    onChange={(e) =>
                                      setAdaptiveAnswers((prev) => ({ ...prev, [q.label]: e.target.value }))
                                    }
                                    className="w-full border border-[#969690] px-3 py-2 text-xs outline-none focus:border-ink"
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={handleApplyAiRecommendation}
                              className="inline-flex items-center gap-1.5 bg-lime text-ink border border-ink/20 hover:bg-ink hover:text-white px-4 py-2 text-xs uppercase tracking-wider font-extrabold transition-colors cursor-pointer"
                            >
                              <Check className="h-3 w-3" /> Apply Recommendation to Brief
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <Field
                    id="goal"
                    label="Business, audience and goal"
                    value={answers.goal}
                    placeholder="What do you offer, who is it for, and what should change?"
                    required
                    error={errors.goal}
                    multiline
                    onChange={(v) => update("goal", v)}
                  />

                  {services.includes("brand") && (
                    <Field
                      id="brand"
                      label="Brand identity"
                      value={answers.brand}
                      placeholder="New identity or refresh? Describe what exists and what you need."
                      multiline
                      onChange={(v) => update("brand", v)}
                    />
                  )}

                  {services.includes("website") && (
                    <Field
                      id="website"
                      label="Website — pages, content and functionality"
                      value={answers.website}
                      placeholder="Required pages, existing content, features and integrations."
                      multiline
                      onChange={(v) => update("website", v)}
                    />
                  )}

                  {services.includes("software") && (
                    <Field
                      id="software"
                      label="Custom software — features and integrations"
                      value={answers.software}
                      placeholder="Users, main workflow, features and systems to connect."
                      multiline
                      onChange={(v) => update("software", v)}
                    />
                  )}

                  <Field
                    id="budget"
                    label="Budget range"
                    value={answers.budget}
                    placeholder="Enter a range in NGN, or “Need guidance”."
                    onChange={(v) => update("budget", v)}
                  />

                  <Field
                    id="timing"
                    label="Preferred timing"
                    value={answers.timing}
                    placeholder="Enter a date or “Flexible”."
                    onChange={(v) => update("timing", v)}
                  />
                </div>

                <div className="mt-8 flex justify-between pt-4 border-t border-ink/10">
                  <button
                    className="min-h-11 text-xs uppercase font-bold tracking-wider text-muted hover:text-ink cursor-pointer"
                    onClick={() => go(0)}
                  >
                    Back
                  </button>
                  <Button onClick={validateScope}>Continue</Button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-7 border-b border-[#c7c7bf] pb-6 text-[14px]/[22px]">
                  <p className="font-extrabold text-xs uppercase tracking-wider text-muted mb-2">YOUR BRIEF SUMMARY</p>
                  <p>
                    <span className="font-bold">Services:</span> {selection}
                  </p>
                  <p className="mt-1">
                    <span className="font-bold">Goal:</span> {answers.goal || "—"}
                  </p>
                  {services.includes("brand") && (
                    <p className="mt-1">
                      <span className="font-bold">Brand:</span> {answers.brand || "—"}
                    </p>
                  )}
                  {services.includes("website") && (
                    <p className="mt-1">
                      <span className="font-bold">Website:</span> {answers.website || "—"}
                    </p>
                  )}
                  {services.includes("software") && (
                    <p className="mt-1">
                      <span className="font-bold">Software:</span> {answers.software || "—"}
                    </p>
                  )}
                  <p className="mt-1">
                    <span className="font-bold">Budget:</span> {answers.budget || "—"}
                  </p>
                  <p className="mt-1">
                    <span className="font-bold">Timing:</span> {answers.timing || "—"}
                  </p>
                  <button
                    className="mt-4 text-xs font-extrabold uppercase tracking-wider underline underline-offset-4 cursor-pointer hover:text-muted"
                    onClick={() => go(1)}
                  >
                    Edit project details
                  </button>
                </div>

                <div className="grid gap-4">
                  <div className="sr-only" aria-hidden="true">
                    <label htmlFor="company-website">Company website</label>
                    <input
                      id="company-website"
                      name="companyWebsite"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={companyWebsite}
                      onChange={(event) => setCompanyWebsite(event.target.value)}
                    />
                  </div>

                  <Field
                    id="name"
                    label="Your name"
                    value={answers.name}
                    placeholder="Full name"
                    required
                    error={errors.name}
                    onChange={(v) => update("name", v)}
                  />

                  <Field
                    id="email"
                    label="Email address"
                    value={answers.email}
                    placeholder="you@company.com"
                    required
                    error={errors.email}
                    onChange={(v) => update("email", v)}
                  />

                  <Field
                    id="company"
                    label="Company name"
                    value={answers.company}
                    placeholder="Optional"
                    onChange={(v) => update("company", v)}
                  />

                  {/* NDPA 2023 Consent Checkbox */}
                  <div className="mt-3 p-3 bg-paper/50 border border-ink/15 text-xs space-y-1">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consentGiven}
                        onChange={(e) => {
                          setConsentGiven(e.target.checked);
                          if (e.target.checked) setErrors((prev) => ({ ...prev, consent: "" }));
                        }}
                        className="mt-0.5 size-4 accent-ink cursor-pointer"
                      />
                      <span className="text-muted leading-relaxed font-medium">
                        I agree to OKIKE Studio collecting and processing this enquiry in compliance with the{" "}
                        <strong className="text-ink">Nigeria Data Protection Act (NDPA) 2023</strong> and the{" "}
                        <Link href="/privacy" target="_blank" className="underline text-ink hover:text-lime">
                          Privacy Policy
                        </Link>
                        . Briefs are handled confidentially and are never shared.
                      </span>
                    </label>
                    {errors.consent && <p className="text-error text-xs font-semibold">{errors.consent}</p>}
                  </div>
                </div>

                {message && (
                  <p role="alert" className="mt-4 text-error text-xs font-semibold">
                    {message}
                  </p>
                )}

                <div className="mt-8 flex justify-between pt-4 border-t border-ink/10">
                  <button
                    className="min-h-11 text-xs uppercase font-bold tracking-wider text-muted hover:text-ink cursor-pointer"
                    onClick={() => go(1)}
                  >
                    Back
                  </button>
                  <Button disabled={status === "sending"} onClick={submit}>
                    {status === "sending" ? "Sending…" : status === "failure" ? "Try again" : "Send enquiry"}
                  </Button>
                </div>
              </>
            )}
          </section>
        </div>

        {packageId && step === 1 && !choosingPackage && (
          <button
            onClick={() => setChoosingPackage(true)}
            className="mt-6 text-xs uppercase font-extrabold tracking-wider underline underline-offset-4 cursor-pointer hover:text-muted"
          >
            Change package
          </button>
        )}
      </div>
    </main>
  );
}
