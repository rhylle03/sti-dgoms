"use client";

import { loginAction } from "@/actions/users";
import { supabase } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { Provider } from "@supabase/supabase-js";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

const LoginButton = () => {
  const router = useRouter();
  const [isPending, startTranstion] = useTransition();

  const handleLogin = (provider: Provider) => {
    startTranstion(async () => {
      const { errorMessage, url } = await loginAction(provider);

      if (!errorMessage && url) {
        router.push(url);
      } else {
        console.log("Error logging in");
      }
    });
  };

  return (
    <>
      <>
        <button onClick={() => handleLogin("azure")} disabled={isPending}>
          Login with Azure
        </button>
      </>
    </>
  );
};

export default LoginButton;