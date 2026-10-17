import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Graceful fallback if credentials are not yet configured in environment
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("placeholder")) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // If already authenticated and accessing login/signup, redirect to respective dashboard
  if (user && (pathname === "/login" || pathname === "/signup")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role || user.user_metadata?.role;
    const url = request.nextUrl.clone();
    url.pathname = role === "admin" ? "/admin" : "/portal";
    return NextResponse.redirect(url);
  }

  // Protect Admin routes: ONLY admins can access
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("role", "admin");
      url.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(url);
    }

    // Role check for Admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const isStudioAdmin =
      profile?.role === "admin" ||
      user.user_metadata?.role === "admin" ||
      (process.env.ENQUIRY_TO_EMAIL && user.email === process.env.ENQUIRY_TO_EMAIL);

    // If regular user/client attempts to access /admin, redirect to /portal with notice
    if (!isStudioAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = "/portal";
      url.searchParams.set("notice", "admin_required");
      return NextResponse.redirect(url);
    }
  }

  // Protect Client Portal routes: Both Clients AND Admins can view
  if (pathname.startsWith("/portal") && !pathname.startsWith("/portal/login")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(url);
    }
    // Admins and Clients are BOTH allowed to view /portal!
  }

  return supabaseResponse;
}
