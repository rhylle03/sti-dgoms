import NewIncidentListClient from "@/components/pages/ViewReportClient";
import { cookies } from "next/headers";
import React from "react";

export default function page() {
  const cookieStore = cookies();
  const userType = cookieStore.get("userType");
  const userTypeValue = userType && userType.value;

  let denyModify = false;

  if (userTypeValue == "School Administrator") {
    denyModify = true;
  }

  return <NewIncidentListClient denyModify={denyModify} />;
}
