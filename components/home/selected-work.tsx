import { selectedProjects } from "@/lib/projects";
import { SectionContainer } from "@/components/ui/section-container";
import { ProjectCard } from "./project-card";

export function SelectedWork() {
  const [featuredProject, ...pairedProjects] = selectedProjects;

  return (
    <SectionContainer
      id="selected-work"
      labelledBy="selected-work-heading"
      className="bg-surface text-primary [font-optical-sizing:auto] [font-variation-settings:'wdth'_100]"
      contentClassName="flex flex-col gap-9 lg:gap-12 lg:[--page-gutter:56px] lg:[--section-space:72px]"
    >
      <header data-gsap="work-heading" className="flex min-w-0 flex-col gap-6">
        <p className="text-[12px] font-medium leading-normal">03 / SELECTED WORK</p>
        <h2 id="selected-work-heading" className="text-[44px]/[48px] font-extrabold tracking-[-1.7px] lg:text-[76px]/[80px] lg:tracking-[-3px]">Selected work.</h2>
      </header>

      <ProjectCard project={featuredProject} />

      <div className="grid gap-9 lg:grid-cols-2 lg:gap-8 [&_[data-project-image]]:lg:aspect-[648/440]">
        {pairedProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </SectionContainer>
  );
}
