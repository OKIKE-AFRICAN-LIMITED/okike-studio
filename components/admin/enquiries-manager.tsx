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
} from "lucide-react";

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
                  onClick={() =>
                    handleStatusChange(selectedEnquiry.id, "proposal_sent")
                  }
                  className="inline-flex items-center gap-1.5 bg-paper hover:bg-ink hover:text-white border border-ink/20 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <FileCheck className="h-3 w-3" />
                  Draft Proposal
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
            <div className="border border-ink/15 bg-surface p-12 text-center text-muted text-xs font-medium">
              Select an inquiry from the left to inspect brief details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
