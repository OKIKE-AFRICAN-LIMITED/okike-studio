import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Portfolio Interactive UI Inspiration | OKIKE Studio",
  description: "High-fidelity interactive UI design directions for OKIKE Studio's portfolio section.",
};

export default function InspoPage() {
  return (
    <main className="min-h-screen bg-[#0e0e0e] text-[#f5f5f0] p-6 sm:p-12 lg:p-16">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-[#262626] pb-8">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#a8a8a3] hover:text-white transition-colors mb-4 group"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Studio</span>
            </Link>
            <div className="flex items-center gap-2.5">
              <span className="bg-lime text-black text-[10px] font-extrabold uppercase px-2 py-0.5 tracking-wider">
                UI Exploration
              </span>
              <span className="text-xs uppercase font-mono tracking-widest text-[#70706b]">
                Selected Work 2.0
              </span>
            </div>
            <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
              Interactive Portfolio Directions
            </h1>
            <p className="mt-2 text-sm text-[#a8a8a3] max-w-2xl leading-relaxed">
              Two high-craft interactive concepts designed to make exploring OKIKE Studio&apos;s case studies tactile, fun, and effortless for both young founders and senior executives.
            </p>
          </div>
        </div>

        {/* Concept 1: Visual Grid with Magnetic Follower */}
        <section className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-lime tracking-widest">
                DIRECTION 01
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white mt-1">
                Visual Grid + Magnetic &quot;Explore&quot; Cursor
              </h2>
            </div>
          </div>

          <div className="relative w-full aspect-16/9 rounded-sm overflow-hidden border border-[#2a2a2a] bg-[#141414] shadow-2xl">
            <Image
              src="/inspo/portfolio_grid.jpg"
              alt="OKIKE Studio Interactive Grid UI Mockup"
              fill
              priority
              className="object-contain"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-4 bg-[#141414] border border-[#262626]">
              <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-lime" /> Zero-Reload Filter Pills
              </h3>
              <p className="mt-1.5 text-xs text-[#a8a8a3] leading-relaxed">
                Clean pill buttons for All, Brand, Digital Flagships, and Custom Software that sort projects dynamically with fluid spring animation.
              </p>
            </div>
            <div className="p-4 bg-[#141414] border border-[#262626]">
              <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-lime" /> Magnetic Lime Cursor
              </h3>
              <p className="mt-1.5 text-xs text-[#a8a8a3] leading-relaxed">
                Hovering over any card attaches a smooth floating neon badge (&quot;EXPLORE CASE ↗&quot;) that glides with mouse motion.
              </p>
            </div>
            <div className="p-4 bg-[#141414] border border-[#262626]">
              <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-lime" /> Tech Stack Badges
              </h3>
              <p className="mt-1.5 text-xs text-[#a8a8a3] leading-relaxed">
                Direct visibility into technologies used (Next.js, Supabase, GSAP) so technical decision-makers see capability at a glance.
              </p>
            </div>
          </div>
        </section>

        {/* Concept 2: Architectural Index Table View */}
        <section className="space-y-6 pt-10 border-t border-[#262626]">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-lime tracking-widest">
                DIRECTION 02
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white mt-1">
                Architectural Index + Floating Hover Preview
              </h2>
            </div>
          </div>

          <div className="relative w-full aspect-16/9 rounded-sm overflow-hidden border border-[#2a2a2a] bg-[#141414] shadow-2xl">
            <Image
              src="/inspo/portfolio_index.jpg"
              alt="OKIKE Studio Index Table View Mockup"
              fill
              className="object-contain"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-4 bg-[#141414] border border-[#262626]">
              <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-lime" /> Editorial Swiss Data Table
              </h3>
              <p className="mt-1.5 text-xs text-[#a8a8a3] leading-relaxed">
                High-density layout showing Index, Project, Client, Discipline, and Year with crisp hairline dividers.
              </p>
            </div>
            <div className="p-4 bg-[#141414] border border-[#262626]">
              <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-lime" /> Floating Image Preview
              </h3>
              <p className="mt-1.5 text-xs text-[#a8a8a3] leading-relaxed">
                Hovering over any project row instantly displays a rich thumbnail card tracking next to the cursor.
              </p>
            </div>
            <div className="p-4 bg-[#141414] border border-[#262626]">
              <h3 className="text-sm font-bold uppercase text-white flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-lime" /> Instant [Grid / Index] Toggle
              </h3>
              <p className="mt-1.5 text-xs text-[#a8a8a3] leading-relaxed">
                Visitors can toggle between the cinematic Grid view and the fast Index view with a single click.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
