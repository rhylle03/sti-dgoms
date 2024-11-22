import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabase } from "./client";

export const getUser = async () => {
  const auth = createClient();
  const user = (await auth.getUser()).data.user;

  const { data: roleData, error: roleError } = await supabase
    .from("users")
    .select("role")
    .eq("email", user?.email)
    .single();

  if (!roleData) {
    console.log("could not find role");
  }

  if (roleError || !roleData) {
    console.error(
      "Could not fetch role:",
      roleError?.message || "No role found"
    );
    return { ...user, role: null };
  }

  return { ...user, role: roleData.role };
};

export function createClient() {
  const cookieStore = cookies();

  const supabaseClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {}
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {}
        },
      },
    }
  );

  return supabaseClient.auth;
}
