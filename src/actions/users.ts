"use server";

import { createClient } from "@/utils/supabase/server";
import { Provider } from "@supabase/supabase-js";

export const loginAction = async (provider: Provider) => {
  const { data, error } = await createClient().signInWithOAuth({
    provider,
    options: {
      scopes: "email offline_access profile user.read.all",
      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth`,
    },
  });

  if (error) throw error;

  return { errorMessage: error, url: data.url };
};

export const signOutAction = async () => {
  const { error } = await createClient().signOut();

  if (error) throw error;

  return { errorMessage: error };
};
