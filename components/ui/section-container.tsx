import type { ReactNode } from "react";

type SectionContainerProps = {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  id?: string;
  labelledBy?: string;
};

/** Full-width section wrapper; background reaches edges, content keeps gutters. */
export function SectionContainer({
  children,
  className = "",
  contentClassName = "",
  id,
  labelledBy,
}: SectionContainerProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={className}>
      <div className={`site-container py-section ${contentClassName}`}>{children}</div>
    </section>
  );
}
