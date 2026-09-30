import Image from "next/image";
import Link from "next/link";
import type { SelectedProject } from "@/lib/projects";

type ProjectCardProps = {
  project: SelectedProject;
};

function CardContent({ project }: ProjectCardProps) {
  return (
    <>
      <div data-project-image data-gsap="project-image" className={`relative w-full overflow-hidden bg-surface-secondary ${project.featured ? "aspect-[350/280] lg:aspect-[1328/560]" : "aspect-[350/280]"}`}>
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          loading="lazy"
          sizes={project.featured
            ? "(max-width: 1023px) calc(100vw - 40px), calc(100vw - 112px)"
            : "(max-width: 1023px) calc(100vw - 40px), calc((100vw - 144px) / 2)"}
          className="object-cover"
        />
      </div>
      <div data-gsap="project-caption" className="flex min-w-0 flex-col gap-[10px]">
        <p className="text-[11px]/[16px] font-medium">{project.sequence} / {project.year}</p>
        <h3 className="text-[30px]/[34px] font-extrabold tracking-[-.9px] lg:text-[40px]/[44px] lg:tracking-[-1.2px]">{project.title}</h3>
        <p className="text-[11px]/[18px] font-medium lg:text-[12px]">{project.disciplines}</p>
      </div>
    </>
  );
}

export function ProjectCard({ project }: ProjectCardProps) {
  const className = "flex min-w-0 flex-col gap-[18px] text-inherit";

  if (project.href) {
    return (
      <Link data-gsap="project-card" href={project.href} className={`${className} no-underline focus-visible:rounded-[2px] focus-visible:outline-[3px] focus-visible:outline-border-focus focus-visible:outline-offset-[5px]`}>
        <CardContent project={project} />
      </Link>
    );
  }

  return (
    <article data-gsap="project-card" className={className}>
      <CardContent project={project} />
    </article>
  );
}
