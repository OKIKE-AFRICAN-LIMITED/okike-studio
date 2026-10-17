import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/work/case-study";
import {
  selectedProjects,
  type CaseStudy as CaseStudyData,
  type SelectedProject,
} from "@/lib/projects";
import { getStudioProjectBySlug, getStudioProjects } from "@/lib/cms";

export const dynamicParams = true;

type CaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

type ProjectWithCaseStudy = SelectedProject & { caseStudy: CaseStudyData };
const projects: readonly SelectedProject[] = selectedProjects;
const caseStudyProjects = projects.filter(
  (project): project is ProjectWithCaseStudy => project.caseStudy !== undefined,
);

export async function generateStaticParams() {
  const dynamicList = await getStudioProjects();
  return dynamicList
    .filter((project): project is ProjectWithCaseStudy => Boolean(project.caseStudy?.slug))
    .map((project) => ({ slug: project.caseStudy.slug }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project =
    (await getStudioProjectBySlug(slug)) ||
    caseStudyProjects.find((item) => item.caseStudy.slug === slug);
  if (!project || !project.caseStudy) return {};
  return { title: project.caseStudy.metadataTitle };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  let project = await getStudioProjectBySlug(slug);
  if (!project || !project.caseStudy) {
    project = caseStudyProjects.find((item) => item.caseStudy.slug === slug) ?? null;
  }
  if (!project || !project.caseStudy) notFound();

  return <CaseStudy project={project as ProjectWithCaseStudy} />;
}

