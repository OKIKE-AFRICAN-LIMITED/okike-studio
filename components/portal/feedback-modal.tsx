"use client";

import { useState } from "react";
import {
  X,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  HelpCircle,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
} from "lucide-react";
import type { FeedbackCategory, FeedbackPriority } from "@/lib/portal-feedback";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  deliverableId?: string | null;
  deliverableTitle?: string | null;
  projectId?: string | null;
  projectName?: string | null;
  onSuccess?: () => void;
}

const categoryOptions: Array<{
  id: FeedbackCategory;
  label: string;
  icon: typeof RotateCcw;
  desc: string;
}> = [
  {
    id: "revision",
    label: "Revision Request",
    icon: RotateCcw,
    desc: "Modifications, design tweaks or content changes.",
  },
  {
    id: "approval",
    label: "Sign-off / Approval",
    icon: FileCheck,
    desc: "Approve this deliverable to advance to the next sprint.",
  },
  {
    id: "question",
    label: "Clarification / Question",
    icon: HelpCircle,
    desc: "Ask the studio team about this asset or spec.",
  },
  {
    id: "issue",
    label: "Bug / Technical Defect",
    icon: AlertTriangle,
    desc: "Report a broken link, visual regression or defect.",
  },
];

export function FeedbackModal({
  isOpen,
  onClose,
  deliverableId,
  deliverableTitle,
  projectId,
  projectName = "Active Project",
  onSuccess,
}: FeedbackModalProps) {
  const [category, setCategory] = useState<FeedbackCategory>("revision");
  const [priority, setPriority] = useState<FeedbackPriority>("normal");
  const [message, setMessage] = useState("");
  const [referenceUrl, setReferenceUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (message.trim().length < 5) {
      setError("Please provide a note or specification of at least 5 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/portal/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deliverableId,
          deliverableTitle,
          projectId,
          projectName,
          category,
          priority,
          message,
          referenceUrl: referenceUrl.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to submit feedback.");
      }

      setIsSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setIsSuccess(false);
        setMessage("");
        setReferenceUrl("");
        onClose();
      }, 1600);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-surface border-2 border-ink shadow-2xl p-6 sm:p-8 font-sans">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-muted hover:text-ink hover:bg-paper transition-colors cursor-pointer"
          aria-label="Close Feedback Dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          <div className="py-12 text-center space-y-4">
            <div className="h-12 w-12 bg-lime text-ink rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-7 w-7 text-ink" />
            </div>
            <h3 className="text-xl font-extrabold uppercase tracking-tight text-ink">
              Feedback Delivered
            </h3>
            <p className="text-xs text-muted max-w-sm mx-auto">
              Your notes have been received by the OKIKE Studio design and engineering leads. We will review and update the sprint record.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-lime text-ink text-[10px] font-extrabold uppercase px-2 py-0.5 tracking-wider">
                  Client Revision System
                </span>
                <span className="text-[11px] font-mono text-muted uppercase">
                  {projectName}
                </span>
              </div>
              <h2 className="text-xl font-extrabold uppercase tracking-tight text-ink mt-2">
                {deliverableTitle ? `Feedback: ${deliverableTitle}` : "Project Revision & Notes"}
              </h2>
              <p className="text-xs text-muted mt-1">
                Directly communicate updates, approvals or questions to your dedicated team.
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-300 p-3 text-red-800 text-xs font-medium">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Category Selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-ink block">
                Type of Feedback
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categoryOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = category === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setCategory(opt.id)}
                      className={`p-3 text-left border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "border-ink bg-paper shadow-2xs ring-1 ring-ink"
                          : "border-ink/15 bg-surface hover:border-ink/40 text-muted"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon
                          className={`h-4 w-4 ${
                            isSelected ? "text-action" : "text-muted"
                          }`}
                        />
                        <span
                          className={`text-xs font-extrabold uppercase tracking-tight ${
                            isSelected ? "text-ink" : "text-muted"
                          }`}
                        >
                          {opt.label}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted leading-tight mt-1">
                        {opt.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Priority Selector */}
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-ink block">
                Urgency
              </label>
              <div className="flex items-center gap-2">
                {(["normal", "urgent", "low"] as FeedbackPriority[]).map((p) => {
                  const isSelected = priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider border transition-colors cursor-pointer ${
                        isSelected
                          ? p === "urgent"
                            ? "bg-red-600 text-white border-red-700"
                            : "bg-ink text-white border-ink"
                          : "border-ink/15 bg-paper text-muted hover:border-ink/40"
                      }`}
                    >
                      {p === "urgent" ? "Urgent (Blocking)" : p === "normal" ? "Normal (Next Sprint)" : "Low (Backlog)"}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Message Area */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="feedback-message"
                  className="text-[11px] font-extrabold uppercase tracking-wider text-ink"
                >
                  Notes &amp; Specific Details
                </label>
                <span className="text-[10px] text-muted">{message.length}/3000</span>
              </div>
              <textarea
                id="feedback-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                maxLength={3000}
                required
                placeholder="Describe desired adjustments, specific copy edits, or reference timestamps..."
                className="w-full border border-ink/25 bg-paper p-3 text-xs leading-relaxed text-ink focus:border-ink focus:ring-1 focus:ring-ink outline-none resize-y"
              />
            </div>

            {/* Reference URL */}
            <div className="space-y-1.5">
              <label
                htmlFor="feedback-reference-url"
                className="text-[11px] font-extrabold uppercase tracking-wider text-ink flex items-center gap-1.5"
              >
                <span>Reference Link</span>
                <span className="text-[10px] text-muted font-normal lowercase">(optional: Figma comment, Loom, or screenshot)</span>
              </label>
              <div className="relative">
                <input
                  id="feedback-reference-url"
                  type="url"
                  value={referenceUrl}
                  onChange={(e) => setReferenceUrl(e.target.value)}
                  placeholder="https://www.figma.com/design/... or https://loom.com/share/..."
                  className="w-full border border-ink/25 bg-paper px-3 py-2 text-xs text-ink focus:border-ink focus:ring-1 focus:ring-ink outline-none pr-8"
                />
                <ExternalLink className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-muted pointer-events-none" />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-ink/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-muted hover:text-ink transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 bg-ink text-white hover:bg-lime hover:text-ink px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Transmitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5 text-action" />
                    <span>Submit to Studio</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
