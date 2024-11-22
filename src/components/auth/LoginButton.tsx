"use client";

import { loginAction } from "@/actions/users";
import { supabase } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
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
        <Button
          variant="outline"
          className="h-10 px-6 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
        >
          Login with Azure
        </Button>
      </>
    </>
  );
};

export default LoginButton;
