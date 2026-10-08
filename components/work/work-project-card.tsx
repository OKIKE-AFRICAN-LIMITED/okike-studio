import Image from "next/image";
import Link from "next/link";
import type { SelectedProject } from "@/lib/projects";

type WorkProjectCardProps = {
  project: SelectedProject;
  displayTitle: string;
  variant: "featured" | "paired";
  position?: "first" | "second";
};

export function WorkProjectCard({ project, displayTitle, variant, position }: WorkProjectCardProps) {
  const imageClass = variant === "featured"
    ? "aspect-[350/280] md:aspect-[350/280] lg:aspect-[800/560] lg:min-w-0 lg:flex-1"
    : "aspect-[350/280] w-full";

  const content = (
    <>
      <div
        data-project-image
        data-gsap="project-image"
        className={`group relative overflow-hidden bg-surface-secondary ${imageClass} ${variant === "paired" && position === "first" ? "lg:aspect-[760/500]" : ""} ${variant === "paired" && position === "second" ? "lg:aspect-[528/360]" : ""}`}
      >
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          loading="lazy"
          sizes={variant === "featured"
            ? "(max-width: 1023px) calc(100vw - 40px), calc((100vw - 552px) * .67)"
            : "(max-width: 767px) calc(100vw - 40px), (max-width: 1023px) calc((100vw - 104px) / 2), calc((100vw - 152px) / 2)"}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
      <div data-gsap="work-project-caption" className={variant === "featured" ? "flex min-w-0 flex-col gap-[10px] lg:w-[400px] lg:flex-none" : "flex min-w-0 flex-col gap-[10px]"}>
        <p className="text-[11px]/[16px] font-medium text-[#737370]">{project.sequence} / {project.caseStudy?.facts.client || "STUDIO ARCHIVE"}</p>
        <h2 className={variant === "featured" ? "text-[30px]/[34px] font-extrabold tracking-[-.9px] transition-colors duration-300 group-hover:text-lime lg:text-[52px]/[44px] lg:tracking-[-1.2px]" : "text-[30px]/[34px] font-extrabold tracking-[-.9px] transition-colors duration-300 group-hover:text-lime lg:text-[40px]/[44px] lg:tracking-[-1.2px]"}>
          {displayTitle}
        </h2>
        <p className="text-[11px]/[18px] font-medium text-[#52524e] lg:text-[12px]">{project.disciplines}</p>
      </div>
    </>
  );
  const className = variant === "featured"
    ? "group flex w-full flex-col gap-[18px] lg:flex-row lg:items-center lg:gap-10"
    : `group flex min-w-0 flex-1 flex-col gap-[18px] ${position === "second" ? "lg:pt-[140px]" : ""}`;

  if (project.href) {
    return (
      <Link
        href={project.href}
        data-project={project.id}
        data-gsap="work-project-card"
        className={`${className} focus-visible:rounded-sm focus-visible:outline-[3px] focus-visible:outline-offset-[5px]`}
      >
        {content}
      </Link>
    );
  }

  return (
    <article
      data-project={project.id}
      data-gsap="work-project-card"
      className={className}
    >
      {content}
    </article>
  );
}
