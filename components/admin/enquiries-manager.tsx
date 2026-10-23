"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Inbox,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  FileCheck,
  Send,
  UserCheck,
  X,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import type { GeneratedProposal } from "@/app/api/admin/proposals/generate/route";

export type EnquiryItem = {
  id: string;
  client_name: string;
  client_email: string;
  client_company: string | null;
  services: string[];
  package_selected: string | null;
  scope_answers: Record<string, string>;
  budget_range: string | null;
  timeline: string | null;
  status: "new" | "reviewed" | "discovery_scheduled" | "proposal_sent" | "won" | "archived";
  admin_notes: string | null;
  ai_summary?: string | null;
  ai_tags?: Record<string, unknown> | null;
  ai_spam_score?: number | null;
  assistant_used?: boolean | null;
  ai_recommended_package?: string | null;
  created_at: string;
};

export function EnquiriesManager({
  initialEnquiries,
}: {
  initialEnquiries: EnquiryItem[];
}) {
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>(initialEnquiries);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(
    initialEnquiries[0] || null
  );
  const [adminNotes, setAdminNotes] = useState<string>(
    initialEnquiries[0]?.admin_notes || ""
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [isGeneratingProposal, setIsGeneratingProposal] = useState(false);
  const [generatedProposal, setGeneratedProposal] = useState<GeneratedProposal | null>(null);
  const [proposalError, setProposalError] = useState<string | null>(null);
  const [copiedProposal, setCopiedProposal] = useState(false);

  const filterTabs = [
    { id: "all", label: "All Leads" },
    { id: "new", label: "New" },
    { id: "reviewed", label: "Reviewed" },
    { id: "discovery_scheduled", label: "Discovery" },
    { id: "proposal_sent", label: "Proposal Sent" },
    { id: "won", label: "Won" },
  ];

  const filtered = enquiries.filter((e) => {
    if (activeFilter === "all") return true;
    return e.status === activeFilter;
  });

  const handleSelect = (item: EnquiryItem) => {
    setSelectedEnquiry(item);
    setAdminNotes(item.admin_notes || "");
  };

  const handleStatusChange = async (id: string, newStatus: EnquiryItem["status"]) => {
    setIsUpdating(true);
    try {
      const supabase = createClient();
      await supabase
        .from("enquiries")
        .update({ status: newStatus })
        .eq("id", id);

      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
      );
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch {
      // Offline fallback
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
      );
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedEnquiry) return;
    setIsUpdating(true);
    try {
      const supabase = createClient();
      await supabase
        .from("enquiries")
        .update({ admin_notes: adminNotes })
        .eq("id", selectedEnquiry.id);

      setEnquiries((prev) =>
        prev.map((e) =>
          e.id === selectedEnquiry.id ? { ...e, admin_notes: adminNotes } : e
        )
      );
      setSelectedEnquiry((prev) =>
        prev ? { ...prev, admin_notes: adminNotes } : null
      );
    } catch {
      // Offline fallback
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenProposalGenerator = async () => {
    if (!selectedEnquiry) return;
    setIsProposalModalOpen(true);
    setProposalError(null);
    if (generatedProposal) return;

    setIsGeneratingProposal(true);
    try {
      const res = await fetch("/api/admin/proposals/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enquiryId: selectedEnquiry.id,
          clientName: selectedEnquiry.client_name,
          clientCompany: selectedEnquiry.client_company,
          services: selectedEnquiry.services,
          packageSelected: selectedEnquiry.package_selected,
          scopeAnswers: selectedEnquiry.scope_answers,
          budgetRange: selectedEnquiry.budget_range,
          timeline: selectedEnquiry.timeline,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate proposal");
      setGeneratedProposal(data.proposal);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error generating proposal";
      setProposalError(msg);
    } finally {
      setIsGeneratingProposal(false);
    }
  };

  const formatProposalMarkdown = (p: GeneratedProposal): string => {
    return `# ${p.title}
**Client:** ${selectedEnquiry?.client_name} (${selectedEnquiry?.client_company || "Venture"})
**Package:** ${p.recommendedPackage}
**Indicative Investment:** ${p.indicativeInvestmentNgn}
**Timeline:** ${p.estimatedTimeline}

## Executive Summary
${p.executiveSummary}

## Architecture & Technology Stack
${p.architectureHighlights.map((h) => `- ${h}`).join("\n")}

## Delivery Sprints & Milestones
${p.sprints
  .map(
    (s) =>
      `### Sprint ${s.number}: ${s.title} (${s.weeks})\n${s.deliverables.map((d) => `- ${d}`).join("\n")}`
  )
  .join("\n\n")}

## Commercial & Sign-off Notes
${p.commercialNotes}
`;
  };

  const handleCopyProposal = () => {
    if (!generatedProposal) return;
    const text = formatProposalMarkdown(generatedProposal);
    navigator.clipboard.writeText(text);
    setCopiedProposal(true);
    setTimeout(() => setCopiedProposal(false), 2000);
  };

  const handleSaveProposalToNotes = async () => {
    if (!selectedEnquiry || !generatedProposal) return;
    const addition = `\n\n--- AI DRAFT PROPOSAL (${new Date().toLocaleDateString()}) ---\nPackage: ${generatedProposal.recommendedPackage}\nInvestment: ${generatedProposal.indicativeInvestmentNgn}\nTimeline: ${generatedProposal.estimatedTimeline}\nSummary: ${generatedProposal.executiveSummary}`;
    const updatedNotes = (adminNotes || "") + addition;
    setAdminNotes(updatedNotes);
    await handleStatusChange(selectedEnquiry.id, "proposal_sent");
    try {
      const supabase = createClient();
      await supabase
        .from("enquiries")
        .update({ admin_notes: updatedNotes })
        .eq("id", selectedEnquiry.id);
    } catch {
      // offline fallback
    }
    setIsProposalModalOpen(false);
  };

  const statusPills: Record<string, string> = {
    new: "bg-lime text-ink font-extrabold border border-lime",
    reviewed: "bg-paper text-ink border border-ink/15 font-semibold",
    discovery_scheduled: "bg-purple-100 text-purple-900 border border-purple-300 font-bold",
    proposal_sent: "bg-amber-100 text-amber-900 border border-amber-300 font-bold",
    won: "bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold",
    archived: "bg-neutral-200 text-neutral-600 font-medium",
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-ink/15 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-muted">
            Lead Intake &amp; Opportunity CRM
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-ink mt-1">
            Inquiries Pipeline
          </h1>
          <p className="text-xs text-muted mt-1 font-medium">
            Triage submitted briefs from /enquiry, schedule discovery calls, and issue proposals.
          </p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto bg-surface border border-ink/15 p-1 shadow-xs">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeFilter === tab.id
                  ? "bg-ink text-white font-extrabold"
                  : "text-muted hover:text-ink hover:bg-paper"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Layout: List on Left, Detail Drawer on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-muted flex items-center justify-between px-1">
            <span>Showing {filtered.length} Leads</span>
            <span>Sort: Most Recent</span>
          </div>

          {filtered.length === 0 ? (
            <div className="border border-ink/15 bg-surface p-10 text-center space-y-3 shadow-xs">
              <div className="mx-auto w-10 h-10 border border-ink/10 flex items-center justify-center bg-paper text-muted">
                <Inbox className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-extrabold uppercase tracking-wider text-ink">
                  No Inquiries Found
                </p>
                <p className="text-xs text-muted max-w-xs mx-auto">
                  {activeFilter === "all"
                    ? "Your inbound pipeline is clean. When prospective clients submit inquiries, they will appear here in real time."
                    : `No inquiries with status '${activeFilter}'.`}
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-ink/10 border border-ink/15 bg-surface shadow-xs">
              {filtered.map((item) => {
                const isSelected = selectedEnquiry?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className={`p-4 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-paper border-l-4 border-ink"
                        : "hover:bg-paper/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-extrabold text-xs uppercase text-ink">
                          {item.client_name}
                        </h3>
                        {item.client_company && (
                          <p className="text-[11px] text-muted font-medium">
                            {item.client_company}
                          </p>
                        )}
                      </div>
                      <span
                        className={`text-[9px] uppercase px-2 py-0.5 tracking-wider font-extrabold ${
                          statusPills[item.status] || "bg-paper text-ink"
                        }`}
                      >
                        {item.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-muted font-medium">
                      <span>Budget: {item.budget_range || "Flexible"}</span>
                      <span>{item.created_at}</span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.assistant_used && (
                        <span className="bg-lime text-ink text-[9px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 border border-ink/20 flex items-center gap-1">
                          <Sparkles className="h-2 w-2" /> AI Scoped
                        </span>
                      )}
                      {item.services.map((svc) => (
                        <span
                          key={svc}
                          className="bg-paper border border-ink/10 text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 text-muted"
                        >
                          {svc}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Detail Pane */}
        <div className="lg:col-span-7">
          {selectedEnquiry ? (
            <div className="border border-ink/15 bg-surface p-6 sm:p-8 space-y-6 shadow-xs">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink/15 pb-5">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-muted font-bold">
                    Lead Profile
                  </span>
                  <h2 className="text-xl font-extrabold uppercase tracking-tight text-ink mt-0.5">
                    {selectedEnquiry.client_name}
                  </h2>
                  <p className="text-xs text-muted font-medium">
                    {selectedEnquiry.client_email}{" "}
                    {selectedEnquiry.client_company &&
                      `· ${selectedEnquiry.client_company}`}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-[11px] uppercase tracking-wider text-muted font-bold">
                    Status:
                  </label>
                  <select
                    value={selectedEnquiry.status}
                    onChange={(e) =>
                      handleStatusChange(
                        selectedEnquiry.id,
                        e.target.value as EnquiryItem["status"]
                      )
                    }
                    disabled={isUpdating}
                    className="bg-paper border border-ink/20 px-2.5 py-1.5 text-xs font-extrabold uppercase text-ink cursor-pointer"
                  >
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="discovery_scheduled">
                      Discovery Scheduled
                    </option>
                    <option value="proposal_sent">Proposal Sent</option>
                    <option value="won">Won (Active Project)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Scope Facts */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-b border-ink/15 pb-5">
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-muted font-bold">
                    Selected Package
                  </span>
                  <span className="text-xs font-extrabold uppercase text-ink">
                    {selectedEnquiry.package_selected || "Bespoke Scope"}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-muted font-bold">
                    Budget Bracket
                  </span>
                  <span className="text-xs font-bold text-ink">
                    {selectedEnquiry.budget_range || "To be discussed"}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider text-muted font-bold">
                    Target Timeline
                  </span>
                  <span className="text-xs font-bold text-ink">
                    {selectedEnquiry.timeline || "Standard studio sprint"}
                  </span>
                </div>
              </div>

              {/* AI Triage & Synthesis */}
              {selectedEnquiry.ai_summary && (
                <div className="border-2 border-ink bg-lime/10 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-ink">
                      <Sparkles className="h-3.5 w-3.5 text-ink" /> AI Triage &amp; Opportunity Synthesis
                    </span>
                    {selectedEnquiry.ai_spam_score !== undefined && selectedEnquiry.ai_spam_score !== null && (
                      <span
                        className={`text-[9px] font-extrabold px-2 py-0.5 uppercase tracking-wider border ${
                          selectedEnquiry.ai_spam_score > 0.4
                            ? "bg-red-100 text-red-900 border-red-300"
                            : "bg-emerald-100 text-emerald-900 border-emerald-300"
                        }`}
                      >
                        Spam Risk: {Math.round(selectedEnquiry.ai_spam_score * 100)}%
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink font-medium leading-relaxed">
                    {selectedEnquiry.ai_summary}
                  </p>
                  {selectedEnquiry.ai_tags && typeof selectedEnquiry.ai_tags === "object" && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {Object.entries(selectedEnquiry.ai_tags).map(([k, v]) => (
                        <span
                          key={k}
                          className="bg-paper border border-ink/15 text-[10px] font-mono px-2 py-0.5 text-ink font-semibold"
                        >
                          {k}: {String(v)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Service Details & Answers */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-ink">
                  Inquiry Brief &amp; Questions
                </h3>

                <div className="bg-paper/60 border border-ink/10 p-4 space-y-3 text-xs">
                  {Object.entries(selectedEnquiry.scope_answers).map(
                    ([q, ans]) => (
                      <div key={q} className="space-y-1">
                        <span className="text-muted block uppercase text-[10px] font-bold tracking-wider">
                          {q}
                        </span>
                        <p className="text-ink text-sm font-medium">{ans}</p>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Internal Studio Notes */}
              <div className="space-y-2 border-t border-ink/15 pt-5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-ink">
                    Internal Studio Notes
                  </label>
                  <button
                    onClick={handleSaveNotes}
                    disabled={isUpdating}
                    className="text-[11px] uppercase font-extrabold tracking-wider text-ink hover:text-lime-700 transition-colors cursor-pointer"
                  >
                    Save Notes
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Notes from discovery call, strategic observations, or pricing adjustments..."
                  className="w-full bg-paper border border-ink/20 p-3 text-xs text-ink placeholder-neutral-400 focus:outline-none focus:border-ink font-normal"
                />
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-ink/15">
                <a
                  href={`mailto:${selectedEnquiry.client_email}?subject=OKIKE Studio // Your Project Inquiry`}
                  className="inline-flex items-center gap-1.5 bg-ink text-white hover:bg-lime hover:text-ink px-4 py-2 text-xs uppercase tracking-wider font-extrabold transition-colors shadow-xs"
                >
                  <Send className="h-3 w-3" />
                  Email Client
                </a>

                <button
                  onClick={handleOpenProposalGenerator}
                  className="inline-flex items-center gap-1.5 bg-paper hover:bg-ink hover:text-white border border-ink/20 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <Sparkles className="h-3 w-3 text-ink" />
                  Draft AI Proposal
                </button>

                <button
                  onClick={() => handleStatusChange(selectedEnquiry.id, "won")}
                  className="inline-flex items-center gap-1.5 bg-lime text-ink hover:bg-ink hover:text-white px-4 py-2 text-xs uppercase tracking-wider font-extrabold transition-colors cursor-pointer shadow-xs"
                >
                  <UserCheck className="h-3 w-3" />
                  Convert to Active Project
                </button>
              </div>
            </div>
          ) : (
            <div className="border border-ink/15 bg-surface p-12 text-center space-y-2 text-muted text-xs font-medium shadow-xs">
              <Inbox className="h-8 w-8 mx-auto text-ink/20" />
              <p className="font-extrabold text-ink uppercase tracking-wider text-xs">
                Awaiting Inbound Briefs
              </p>
              <p className="text-[11px] max-w-xs mx-auto">
                Once prospective clients submit an inquiry via your public website, their project requirements, budget, and scope answers will display here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* AI Proposal Modal */}
      {isProposalModalOpen && (
        <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border-2 border-ink max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl font-sans">
            <div className="p-4 sm:p-5 border-b border-ink/15 flex items-center justify-between bg-paper">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-ink" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-ink">
                  AI Proposal &amp; Scope Architecture
                </h3>
                <span className="text-[10px] font-mono bg-lime text-ink px-1.5 py-0.5 font-bold uppercase">
                  Gemini 3.5 Grounded
                </span>
              </div>
              <button
                onClick={() => setIsProposalModalOpen(false)}
                className="text-muted hover:text-ink p-1 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {isGeneratingProposal && (
                <div className="py-16 text-center space-y-3 text-muted font-medium">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-ink" />
                  <p className="font-bold text-ink uppercase tracking-wider text-xs">
                    Drafting Commercial Proposal with Gemini...
                  </p>
                  <p className="text-[11px] max-w-sm mx-auto">
                    Synthesizing scope requirements, milestone breakdown, architecture recommendations, and Naira pricing ranges.
                  </p>
                </div>
              )}

              {proposalError && (
                <div className="p-4 border border-red-300 bg-red-50 text-red-900 space-y-2">
                  <p className="font-bold">Proposal Generation Error:</p>
                  <p>{proposalError}</p>
                  <button
                    onClick={() => {
                      setGeneratedProposal(null);
                      handleOpenProposalGenerator();
                    }}
                    className="underline font-bold uppercase tracking-wider text-[10px]"
                  >
                    Retry Generation
                  </button>
                </div>
              )}

              {generatedProposal && !isGeneratingProposal && (
                <div className="space-y-6">
                  <div className="border-b border-ink/15 pb-4">
                    <span className="text-[10px] uppercase font-bold text-muted tracking-wider block">
                      Executive Proposal
                    </span>
                    <h2 className="text-lg font-extrabold uppercase tracking-tight text-ink mt-0.5">
                      {generatedProposal.title}
                    </h2>
                    <div className="flex flex-wrap gap-3 mt-3">
                      <span className="bg-paper border border-ink/15 px-2.5 py-1 text-[11px] font-bold text-ink">
                        Package: {generatedProposal.recommendedPackage}
                      </span>
                      <span className="bg-paper border border-ink/15 px-2.5 py-1 text-[11px] font-bold text-ink">
                        Investment: {generatedProposal.indicativeInvestmentNgn}
                      </span>
                      <span className="bg-paper border border-ink/15 px-2.5 py-1 text-[11px] font-bold text-ink">
                        Duration: {generatedProposal.estimatedTimeline}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-extrabold uppercase tracking-wider text-[11px] text-ink">
                      Executive Summary
                    </h4>
                    <p className="leading-relaxed text-ink/90 bg-paper/60 p-3.5 border border-ink/10">
                      {generatedProposal.executiveSummary}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-extrabold uppercase tracking-wider text-[11px] text-ink">
                      Architecture &amp; Engineering Highlights
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {generatedProposal.architectureHighlights.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-1.5 p-2 bg-surface border border-ink/10 text-[11px]"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-extrabold uppercase tracking-wider text-[11px] text-ink">
                      Milestone Sprints
                    </h4>
                    <div className="space-y-2.5">
                      {generatedProposal.sprints.map((sprint) => (
                        <div
                          key={sprint.number}
                          className="border border-ink/15 bg-paper p-3 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-ink text-xs">
                              Sprint {sprint.number}: {sprint.title}
                            </span>
                            <span className="text-[10px] font-mono text-muted uppercase font-semibold">
                              {sprint.weeks}
                            </span>
                          </div>
                          <ul className="text-[11px] text-muted space-y-0.5 pl-3 list-disc">
                            {sprint.deliverables.map((d, dIdx) => (
                              <li key={dIdx}>{d}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border border-ink/10 p-3 bg-paper/40 text-[11px] text-muted leading-relaxed">
                    <span className="font-bold uppercase text-ink block mb-0.5">Commercial Terms</span>
                    {generatedProposal.commercialNotes}
                  </div>
                </div>
              )}
            </div>

            {generatedProposal && !isGeneratingProposal && (
              <div className="p-4 border-t border-ink/15 bg-paper flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={handleCopyProposal}
                  className="inline-flex items-center gap-1.5 bg-surface border border-ink/20 hover:bg-ink hover:text-white px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {copiedProposal ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Copied Markdown</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Markdown</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsProposalModalOpen(false)}
                    className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-muted hover:text-ink cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleSaveProposalToNotes}
                    className="inline-flex items-center gap-1.5 bg-lime text-ink hover:bg-ink hover:text-white px-4 py-2 text-xs uppercase tracking-wider font-extrabold transition-colors cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Save to Notes &amp; Mark Sent</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
