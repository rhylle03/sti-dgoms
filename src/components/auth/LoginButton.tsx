"use client";

import { Button } from "@/components/ui/button";
import { loginAction } from "@/actions/users";
import { Provider } from "@supabase/supabase-js";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function AzureLoginButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogin = (provider: Provider) => {
    startTransition(async () => {
      const { errorMessage, url } = await loginAction(provider);

      if (!errorMessage && url) {
        router.push(url);
      } else {
        console.log("Error logging in");
      }
    });
  };

  return (
    <Button
      variant="outline"
      className="h-10 px-6 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={() => handleLogin("azure")}
      disabled={isPending}
    >
      {isPending ? "Logging in..." : "Login with Azure"}
    </Button>
  );
}
