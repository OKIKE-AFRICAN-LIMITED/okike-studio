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
      <div className={`relative overflow-hidden bg-surface-secondary ${imageClass} ${variant === "paired" && position === "first" ? "lg:aspect-[760/500]" : ""} ${variant === "paired" && position === "second" ? "lg:aspect-[528/360]" : ""}`}>
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          loading="lazy"
          sizes={variant === "featured"
            ? "(max-width: 1023px) calc(100vw - 40px), calc((100vw - 552px) * .67)"
            : "(max-width: 767px) calc(100vw - 40px), (max-width: 1023px) calc((100vw - 104px) / 2), calc((100vw - 152px) / 2)"}
          className="object-cover"
        />
      </div>
      <div className={variant === "featured" ? "flex min-w-0 flex-col gap-[10px] lg:w-[400px] lg:flex-none" : "flex min-w-0 flex-col gap-[10px]"}>
        <p className="text-[11px]/[16px] font-medium">{project.sequence} / PLACEHOLDER</p>
        <h2 className={variant === "featured" ? "text-[30px]/[34px] font-extrabold tracking-[-.9px] lg:text-[52px]/[44px] lg:tracking-[-1.2px]" : "text-[30px]/[34px] font-extrabold tracking-[-.9px] lg:text-[40px]/[44px] lg:tracking-[-1.2px]"}>
          {displayTitle}
        </h2>
        <p className="text-[11px]/[18px] font-medium lg:text-[12px]">{project.disciplines}</p>
      </div>
    </>
  );
  const className = variant === "featured"
    ? "flex w-full flex-col gap-[18px] lg:flex-row lg:items-center lg:gap-10"
    : `flex min-w-0 flex-1 flex-col gap-[18px] ${position === "second" ? "lg:pt-[140px]" : ""}`;

  if (project.href) {
    return (
      <Link
        href={project.href}
        data-project={project.id}
        className={`${className} focus-visible:rounded-sm focus-visible:outline-[3px] focus-visible:outline-offset-[5px]`}
      >
        {content}
      </Link>
    );
  }

  return (
    <article
      data-project={project.id}
      className={className}
    >
      {content}
    </article>
  );
}
