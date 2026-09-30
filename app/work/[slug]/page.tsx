import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/work/case-study";
import { selectedProjects, type CaseStudy as CaseStudyData, type SelectedProject } from "@/lib/projects";

type CaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

type ProjectWithCaseStudy = SelectedProject & { caseStudy: CaseStudyData };
const projects: readonly SelectedProject[] = selectedProjects;
const caseStudyProjects = projects.filter(
  (project): project is ProjectWithCaseStudy => project.caseStudy !== undefined,
);

export function generateStaticParams() {
  return caseStudyProjects.map((project) => ({ slug: project.caseStudy.slug }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = caseStudyProjects.find((item) => item.caseStudy.slug === slug);
  if (!project) return {};
  return { title: project.caseStudy.metadataTitle };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const project = caseStudyProjects.find((item) => item.caseStudy.slug === slug);
  if (!project) notFound();

  return <CaseStudy project={project} />;
}
