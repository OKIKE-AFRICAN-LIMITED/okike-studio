import { getStudioProjects } from "@/lib/cms";
import { PortfolioManager } from "@/components/admin/portfolio-manager";

export const metadata = {
  title: "Portfolio CMS | Studio Admin | OKIKE Studio",
  description: "Manage showcase case studies and work records.",
};

export default async function AdminProjectsPage() {
  const projects = await getStudioProjects();

  return <PortfolioManager initialProjects={projects} />;
}
