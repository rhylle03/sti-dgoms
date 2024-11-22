import React, { Suspense, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import Loader from "@/components/loader";
import LoginButton from "@/components/auth/LoginButton";
import { supabase } from "@/utils/supabase/client";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getUser } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function LoginPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }
  if (user.role == "Student") {
    redirect("/student-portal");
  }

  if (user.role == "Teacher") {
    redirect("/teacher-portal");
  }

  if (user.role == "Discipline Officer") {
    redirect("/dashboard");
  }
  if (user.role == "Guidance Associate") {
    redirect("/dashboard");
  }
  if (user.role == "Academic Head") {
    redirect("/academic-head");
  }
  if (user) {
    redirect("/login");
  }
}
