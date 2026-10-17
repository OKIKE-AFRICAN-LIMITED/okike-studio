import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  getHomePageContent,
  getServicesPageContent,
  getStudioPageContent,
  getSiteSettingsContent,
  saveSiteContent,
} from "@/lib/cms";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");

    if (page === "home") {
      const data = await getHomePageContent();
      return NextResponse.json({ content: data });
    }
    if (page === "services") {
      const data = await getServicesPageContent();
      return NextResponse.json({ content: data });
    }
    if (page === "studio") {
      const data = await getStudioPageContent();
      return NextResponse.json({ content: data });
    }
    if (page === "settings") {
      const data = await getSiteSettingsContent();
      return NextResponse.json({ content: data });
    }

    // Return all pages
    const [home, services, studio, settings] = await Promise.all([
      getHomePageContent(),
      getServicesPageContent(),
      getStudioPageContent(),
      getSiteSettingsContent(),
    ]);

    return NextResponse.json({
      home,
      services,
      studio,
      settings,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch CMS page content" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pageKey, content } = body;

    if (!pageKey || !content) {
      return NextResponse.json(
        { error: "Both pageKey and content are required" },
        { status: 400 }
      );
    }

    await saveSiteContent(pageKey, content);

    // Revalidate public route paths
    try {
      if (pageKey === "home") revalidatePath("/");
      if (pageKey === "services") revalidatePath("/services");
      if (pageKey === "studio") revalidatePath("/studio");
      if (pageKey === "settings") {
        revalidatePath("/", "layout");
      }
    } catch {
      // Revalidation during dev
    }

    return NextResponse.json({ success: true, pageKey });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update page content";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
