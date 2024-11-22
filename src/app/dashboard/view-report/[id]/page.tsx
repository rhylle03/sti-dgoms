import CaseRecordPageClient from "@/components/pages/ViewReportIDClient";
import { cookies } from "next/headers";
import React from "react";

export default function ViewReport({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const userType = cookieStore.get("userType");
  const userTypeValue = userType && userType.value;

  let AcademicdHead = false;

  if (userTypeValue == "School Administrator") {
    AcademicdHead = true;
  }
  return <CaseRecordPageClient AcademicdHead={AcademicdHead} params={params} />;
}
