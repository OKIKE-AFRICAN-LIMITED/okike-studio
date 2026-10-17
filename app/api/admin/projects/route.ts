import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getStudioProjects, saveStudioProject, deleteStudioProject } from "@/lib/cms";
import type { SelectedProject } from "@/lib/projects";

export async function GET() {
  try {
    const projects = await getStudioProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch studio projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const project = body.project as SelectedProject;
    const oldId = body.oldId as string | undefined;

    if (!project || !project.id || !project.title) {
      return NextResponse.json(
        { error: "Invalid project payload: ID and title are required" },
        { status: 400 }
      );
    }

    if (oldId && oldId !== project.id) {
      await deleteStudioProject(oldId);
    }

    const result = await saveStudioProject(project);

    // Revalidate public portfolio pages
    try {
      revalidatePath("/work");
      revalidatePath("/");
      if (project.href) {
        revalidatePath(project.href);
      }
    } catch {
      // Revalidation during dynamic dev
    }

    return NextResponse.json({ success: true, project });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save project";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    await deleteStudioProject(id);

    try {
      revalidatePath("/work");
      revalidatePath("/");
    } catch {
      // Revalidation in dev
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete project";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
