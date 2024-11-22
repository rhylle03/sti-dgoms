"use client";

import { signOutAction } from "@/actions/users";
import { supabase } from "@/utils/supabase/client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export const SignOut = async () => {
  const { errorMessage } = await signOutAction();
};

export function SidebarLogOut() {
  const router = useRouter();
  const handleSignOut = async () => {
    await SignOut();
    router.push("/login");
  };

  return (
    <>
      <div>
        <li
          className="flex items-center cursor-pointer p-3 m-2 rounded-md hover:bg-sti-yellow"
          onClick={handleSignOut}
        >
          <LogOut />
          <span className="pl-3">Logout</span>
        </li>
      </div>
    </>
  );
}
