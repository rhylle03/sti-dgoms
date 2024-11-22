import { NextResponse, type NextRequest } from "next/server";
import { createClient, getUser } from "./utils/supabase/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const path = new URL(request.url).pathname;

  const { user, role } = await supabaseMiddleware(request, response);

  const redirectLogic = [
    {
      path: "/login",
      condition: !!user,
      redirectTo: "/dashboard",
    },
    {
      path: "/dashboard",
      condition: !user,
      redirectTo: "/login",
    },
    {
      path: "/academic-head",
      condition: role !== "Academic Head",
      redirectTo: "/login",
    },
    {
      path: "/program-head",
      condition: role !== "Program Head",
      redirectTo: "/login",
    },
    {
      path: "/student-portal",
      condition: role !== "Student",
      redirectTo: "/login",
    },
    {
      path: "/teacher-portal",
      condition: role !== "Teacher",
      redirectTo: "/login",
    },
  ];

  const redirectTo = redirectLogic.find(
    (rule) => path.startsWith(rule.path) && rule.condition
  )?.redirectTo;

  if (redirectTo) {
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/student-portal/:path*",
    "/academic-head/:path*",
    "/teacher-portal/:path*",
    "/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

async function supabaseMiddleware(
  request: NextRequest,
  response: NextResponse
): Promise<any> {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userRole = await getUser();

  return { user, role: userRole.role };
}
