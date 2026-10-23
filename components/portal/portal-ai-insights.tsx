"use client";

import { useState } from "react";
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
  Send,
  Loader2,
  FileText,
} from "lucide-react";

interface WeeklySummaryData {
  headline: string;
  achievements: string[];
  inProgress: string[];
  upcomingFocus: string[];
  riskAssessment: string;
  riskNote: string;
}

interface PhaseInfo {
  title: string;
  status: string;
  description: string;
}

interface DeliverableInfo {
  title: string;
  type: string;
  description?: string;
  updated: string;
}

export function HandoverRiskBadge({
  targetDate = "Nov 15, 2026",
  currentSprint = 3,
  totalSprints = 6,
  progressPercent = 50,
}: {
  targetDate?: string;
  currentSprint?: number;
  totalSprints?: number;
  progressPercent?: number;
}) {
  // Velocity estimation: ratio of progress to sprint allocation
  const expectedProgress = (currentSprint / totalSprints) * 100;
  const variance = progressPercent - expectedProgress;

  let riskStatus: "On Track" | "Moderate Variance" | "Slip Risk" = "On Track";
  let badgeColor = "bg-emerald-100 text-emerald-900 border-emerald-300";

  if (variance < -15) {
    riskStatus = "Slip Risk";
    badgeColor = "bg-red-100 text-red-900 border-red-300";
  } else if (variance < 0) {
    riskStatus = "Moderate Variance";
    badgeColor = "bg-amber-100 text-amber-900 border-amber-300";
  }

  return (
    <div className="flex items-center gap-2 border border-ink/15 bg-paper px-3 py-1.5 shadow-2xs">
      <div className="flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5 text-muted" />
        <span className="text-[11px] font-bold text-ink uppercase tracking-wider">
          Target: {targetDate}
        </span>
      </div>
      <span
        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 border tracking-wider ${badgeColor}`}
      >
        Velocity: {riskStatus}
      </span>
    </div>
  );
}

export function PortalWeeklySummary({
  projectName,
  clientCompany,
  activePhase,
  sprint,
  progressPercent,
  phases,
  deliverables,
}: {
  projectName: string;
  clientCompany: string;
  activePhase: string;
  sprint: string;
  progressPercent: number;
  phases: PhaseInfo[];
  deliverables: DeliverableInfo[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<WeeklySummaryData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    if (summary) {
      setIsOpen(!isOpen);
      return;
    }
    setLoading(true);
    setError(null);
    setIsOpen(true);
    try {
      const res = await fetch("/api/portal/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "weekly_summary",
          projectName,
          clientCompany,
          activePhase,
          sprint,
          progressPercent,
          phases,
          deliverables,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to generate update");
      setSummary(json.summary);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error generating summary";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-2 border-ink bg-surface shadow-xs">
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-ink flex items-center justify-center text-action shrink-0">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted">
                Studio Intelligence
              </span>
              <span className="bg-lime text-ink text-[9px] font-extrabold uppercase px-1.5 py-0.2">
                Gemini 3.5
              </span>
            </div>
            <h3 className="text-sm font-extrabold uppercase tracking-tight text-ink">
              Executive Weekly Progress Brief
            </h3>
          </div>
        </div>

        <button
          onClick={fetchSummary}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 bg-ink text-white hover:bg-lime hover:text-ink px-4 py-2 text-xs uppercase tracking-wider font-extrabold transition-colors cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Synthesizing...</span>
            </>
          ) : summary ? (
            <>
              <span>{isOpen ? "Hide Brief" : "View Brief"}</span>
              {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              <span>Generate Weekly Synthesis</span>
            </>
          )}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-ink/15 p-5 bg-paper/50 space-y-4 text-xs font-sans">
          {loading && (
            <div className="flex items-center justify-center py-8 gap-3 text-muted font-medium">
              <Loader2 className="h-5 w-5 animate-spin text-ink" />
              <span>Synthesizing sprint velocities, milestone tickets, and deliverables...</span>
            </div>
          )}

          {error && (
            <div className="border border-red-300 bg-red-50 p-4 text-red-900 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {summary && !loading && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-ink/10 pb-3">
                <p className="font-extrabold text-sm text-ink">{summary.headline}</p>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 self-start sm:self-auto">
                  <CheckCircle2 className="h-3 w-3" /> {summary.riskAssessment}: {summary.riskNote}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-ink/15 bg-surface p-3.5 space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted block">
                    Completed This Sprint
                  </span>
                  <ul className="space-y-1.5 text-[11px] text-ink">
                    {summary.achievements.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border border-ink/15 bg-surface p-3.5 space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted block">
                    In Production Right Now
                  </span>
                  <ul className="space-y-1.5 text-[11px] text-ink">
                    {summary.inProgress.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-ink shrink-0 mt-1.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border border-ink/15 bg-surface p-3.5 space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted block">
                    Scheduled For Next Week
                  </span>
                  <ul className="space-y-1.5 text-[11px] text-ink">
                    {summary.upcomingFocus.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Clock className="h-3 w-3 text-muted shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function VaultQaWidget({
  projectName,
  deliverables,
}: {
  projectName: string;
  deliverables: DeliverableInfo[];
}) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setAnswer(null);
    try {
      const res = await fetch("/api/portal/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "vault_qa",
          question: query,
          projectName,
          deliverables,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to search vault");
      setAnswer(data.answer);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error querying vault";
      setAnswer(`Notice: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-2 border-ink bg-surface p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-ink" />
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-ink">
            Vault Assistant · Semantic Asset Search
          </h3>
        </div>
        <span className="text-[10px] uppercase font-bold text-muted">
          Grounded In Project Files
        </span>
      </div>

      <form onSubmit={handleAsk} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Where can I find the brand guidelines, or what's in the Figma board?"
          className="flex-1 bg-paper border border-ink/20 px-3.5 py-2 text-xs text-ink placeholder-neutral-400 focus:outline-none focus:border-ink font-sans"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="bg-ink text-white hover:bg-lime hover:text-ink disabled:opacity-50 px-4 py-2 text-xs uppercase font-extrabold tracking-wider transition-colors inline-flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
          <span>Query</span>
        </button>
      </form>

      {answer && (
        <div className="border border-ink/15 bg-paper p-4 text-xs text-ink leading-relaxed font-sans space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-muted">
            <FileText className="h-3 w-3 text-ink" /> Answer
          </div>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
