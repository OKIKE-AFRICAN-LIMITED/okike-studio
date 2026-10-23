import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | NDPA 2023 Compliance | OKIKE Studio",
  description:
    "How OKIKE Studio collects, protects, and processes client and visitor information under the Nigeria Data Protection Act (NDPA) 2023.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-paper text-ink px-5 py-12 md:px-10 lg:px-20 lg:py-16">
      <div className="mx-auto max-w-3xl space-y-10">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-muted">Legal &amp; Compliance</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-ink mt-2">
            Privacy Policy
          </h1>
          <p className="text-xs text-muted font-mono mt-2">
            Compliant with the Nigeria Data Protection Act (NDPA) 2023 · Effective October 2026
          </p>
        </div>

        <section className="space-y-4 text-sm leading-relaxed text-ink/90 border-t border-ink/15 pt-8">
          <h2 className="text-base font-extrabold uppercase tracking-wider text-ink">1. Data Controller</h2>
          <p>
            OKIKE Studio (“we”, “us”, or “our”) is an independent brand, digital product, and software studio operating in
            Lagos, Nigeria, and internationally. We act as the data controller regarding personal data submitted through
            our website (
            <Link href="/" className="underline font-medium">
              studio.okikeenterprises.com
            </Link>
            ) and our client portal.
          </p>
          <p>
            For privacy inquiries or to exercise your statutory rights under the NDPA 2023, contact our Data Protection
            Lead at <strong className="text-ink">studio@okike.com</strong>.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-ink/90 border-t border-ink/15 pt-8">
          <h2 className="text-base font-extrabold uppercase tracking-wider text-ink">2. Information We Collect</h2>
          <p>We collect and process the following categories of personal information:</p>
          <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm">
            <li>
              <strong>Project Enquiries:</strong> Name, professional email address, company name, project goals, budget
              estimates, and technical requirements provided via our enquiry form or scoping assistant.
            </li>
            <li>
              <strong>Client Workspace Data:</strong> Account credentials, business deliverables, feedback, and milestones
              stored within the authenticated client portal.
            </li>
            <li>
              <strong>Technical Usage Data:</strong> Anonymized timestamps, device telemetry, and interaction metrics to
              maintain system reliability and security.
            </li>
          </ul>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-ink/90 border-t border-ink/15 pt-8">
          <h2 className="text-base font-extrabold uppercase tracking-wider text-ink">
            3. AI &amp; Machine Learning Processing
          </h2>
          <p>
            When you interact with our AI Scoping Assistant or submit a project brief, non-identifying project requirements
            are processed through enterprise API endpoints (Google Gemini API) to structure briefs, classify urgency, and
            provide indicative scope recommendations.
          </p>
          <div className="border-l-2 border-ink pl-4 py-1 text-xs text-muted">
            <strong className="text-ink block uppercase tracking-wider mb-1">Our AI Privacy Guarantees:</strong>
            <ul className="list-disc pl-4 space-y-1">
              <li>Your confidential briefs and proprietary code are NEVER used to train public foundation models.</li>
              <li>Requests are transmitted over encrypted TLS 1.3 tunnels.</li>
              <li>All automated recommendations remain indicative and are confirmed by a human studio partner.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-ink/90 border-t border-ink/15 pt-8">
          <h2 className="text-base font-extrabold uppercase tracking-wider text-ink">4. Lawful Basis for Processing</h2>
          <p>
            Under Section 25 of the Nigeria Data Protection Act (NDPA) 2023, our processing is grounded on:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
            <li>Your explicit consent when submitting an enquiry or interacting with the assistant.</li>
            <li>Steps taken at your request prior to entering into a studio engagement contract.</li>
            <li>Legitimate business interests in ensuring website security, uptime, and fraud prevention.</li>
          </ul>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-ink/90 border-t border-ink/15 pt-8">
          <h2 className="text-base font-extrabold uppercase tracking-wider text-ink">5. Your Statutory Rights</h2>
          <p>Under the NDPA 2023, you hold the following rights regarding your personal data:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>The right to access and receive a copy of your personal data held by us.</li>
            <li>The right to request rectification of inaccurate or outdated information.</li>
            <li>The right to request deletion (erasure) of your enquiry records.</li>
            <li>The right to withdraw consent at any time without affecting past lawful processing.</li>
          </ul>
          <p className="text-xs text-muted pt-2">
            To submit a data access or deletion request, please email{" "}
            <a href="mailto:studio@okike.com" className="underline font-bold text-ink">
              studio@okike.com
            </a>{" "}
            with the subject line “NDPA Data Request”.
          </p>
        </section>

        <div className="pt-8 border-t border-ink/20 flex items-center justify-between">
          <Link href="/" className="text-xs font-bold uppercase tracking-wider underline underline-offset-4">
            ← Return to OKIKE Studio
          </Link>
          <Link href="/terms" className="text-xs font-bold uppercase tracking-wider underline underline-offset-4">
            Terms of Service →
          </Link>
        </div>
      </div>
    </main>
  );
}
