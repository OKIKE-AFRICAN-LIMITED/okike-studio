import Link from "next/link";
import { FileText, ArrowRight, CheckCircle2, Clock, Plus } from "lucide-react";

export const metadata = {
  title: "My Inquiries & Proposals | OKIKE Studio Client Workspace",
  description: "Track submitted project briefs, review proposals, and scope definitions.",
};

export default async function ClientEnquiriesPage() {
  const inquiries = [
    {
      id: "inq-01",
      title: "Venture Brand & Digital Flagship Experience",
      submittedDate: "Oct 01, 2026",
      package: "Business Pro",
      budget: "$15k - $30k",
      status: "won",
      statusLabel: "Accepted & Active Project",
      services: ["Brand identity", "Website"],
    },
    {
      id: "inq-02",
      title: "Q1 Campaign Motion & Interactive Microsite Add-on",
      submittedDate: "Oct 12, 2026",
      package: "Bespoke Scope",
      budget: "$5k - $10k",
      status: "proposal_sent",
      statusLabel: "Proposal Under Review",
      services: ["Custom software"],
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-ink/15 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-muted">
            Project Briefs &amp; Contract Scopes
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-ink mt-1">
            My Inquiries &amp; Proposals
          </h1>
          <p className="text-xs text-muted mt-1 font-medium">
            Historical records of briefs submitted to OKIKE Studio and active proposals.
          </p>
        </div>

        <Link
          href="/enquiry"
          className="inline-flex items-center gap-2 bg-ink text-white hover:bg-lime hover:text-ink px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-colors shrink-0 shadow-xs"
        >
          <Plus className="h-4 w-4 text-action" />
          Submit New Brief
        </Link>
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {inquiries.map((inq) => (
          <div
            key={inq.id}
            className="border border-ink/15 bg-surface p-6 sm:p-8 space-y-4 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ink/10 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-muted font-bold">
                  Brief ID: {inq.id} · Submitted {inq.submittedDate}
                </span>
                <h2 className="text-lg font-extrabold uppercase tracking-tight text-ink mt-0.5">
                  {inq.title}
                </h2>
              </div>

              <span
                className={`text-xs uppercase px-2.5 py-1 font-extrabold tracking-wider self-start sm:self-auto border ${
                  inq.status === "won"
                    ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                    : inq.status === "proposal_sent"
                    ? "bg-purple-100 text-purple-900 border-purple-300"
                    : "bg-paper text-ink border-ink/15"
                }`}
              >
                {inq.statusLabel}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-paper/40 p-4 border border-ink/10">
              <div>
                <span className="text-[10px] text-muted block uppercase font-bold tracking-wider">
                  Service Package
                </span>
                <span className="font-extrabold text-ink">{inq.package}</span>
              </div>
              <div>
                <span className="text-[10px] text-muted block uppercase font-bold tracking-wider">
                  Budget Frame
                </span>
                <span className="font-bold text-ink">{inq.budget}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[10px] text-muted block uppercase font-bold tracking-wider">
                  Disciplines
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {inq.services.map((svc) => (
                    <span
                      key={svc}
                      className="bg-paper border border-ink/15 text-[10px] uppercase font-bold px-2 py-0.5 text-muted"
                    >
                      {svc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {inq.status === "proposal_sent" && (
              <div className="bg-purple-50/70 border border-purple-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h3 className="text-xs font-extrabold uppercase text-purple-950">
                    Proposal Ready For Review
                  </h3>
                  <p className="text-xs text-purple-900 font-medium">
                    OKIKE Studio has prepared a tailored scope breakdown and milestone quote.
                  </p>
                </div>
                <a
                  href="mailto:studio@okikestudio.com?subject=Re: Proposal Review"
                  className="inline-flex items-center gap-1.5 bg-ink text-white hover:bg-lime hover:text-ink px-4 py-2 text-xs uppercase font-extrabold tracking-wider transition-colors shrink-0 shadow-xs"
                >
                  Approve / Discuss Scope
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
