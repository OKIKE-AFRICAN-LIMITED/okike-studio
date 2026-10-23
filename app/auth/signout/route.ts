import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function handleSignOut(request: Request) {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const url = new URL(request.url);
  const response = NextResponse.redirect(new URL("/login?notice=signed_out", url.origin), {
    status: 302,
  });

  // Explicitly invalidate all Supabase auth cookies
  const allCookies = (await import("next/headers")).cookies;
  const cookieStore = await allCookies();
  for (const cookie of cookieStore.getAll()) {
    if (cookie.name.startsWith("sb-") || cookie.name.includes("auth-token")) {
      response.cookies.delete(cookie.name);
    }
  }

  return response;
}

export async function GET(request: Request) {
  return handleSignOut(request);
}

export async function POST(request: Request) {
  return handleSignOut(request);
}
