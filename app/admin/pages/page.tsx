import {
  getHomePageContent,
  getServicesPageContent,
  getStudioPageContent,
  getSiteSettingsContent,
} from "@/lib/cms";
import { PagesCmsManager } from "@/components/admin/pages-cms-manager";

export const metadata = {
  title: "Pages CMS | Studio Admin | OKIKE Studio",
  description: "Edit headlines, narrative statements, and calls to action across public pages.",
};

export default async function AdminPagesCmsPage() {
  const [home, services, studio, settings] = await Promise.all([
    getHomePageContent(),
    getServicesPageContent(),
    getStudioPageContent(),
    getSiteSettingsContent(),
  ]);

  return (
    <PagesCmsManager
      initialHome={home}
      initialServices={services}
      initialStudio={studio}
      initialSettings={settings}
    />
  );
}
