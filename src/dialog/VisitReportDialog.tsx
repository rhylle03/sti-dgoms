"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { useRouter } from "next/navigation";

export function VisitIncidentReportDialog({
  caseId,
  offenderName,
  programCourse,
  studentYear,
  typeOfIncident,
  studentSection,
  created_at,
  sentBy,
  userSession,
}: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [IncidentStatus, setincidentStatus] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchincidentStatus = async () => {
      const { data, error } = await supabase
        .from("sti_dgoms_case")
        .select("*")
        .eq("id", caseId)
        .single();

      if (error) {
        console.error("Error fetching sti_dgoms_case: ", error);
      }
    };

    fetchincidentStatus();
  }, [caseId]);

  const handleAccept = async () => {
    setIsOpen(false);

    const { data, error } = await supabase
      .from("sti_dgoms_case")
      .select("*")
      .eq("id", caseId)
      .single();

    if (error) {
      console.error("Error fetching IncidentStatus: ", error);
      return;
    }

    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, "0");
    const caseNumber = `CASE-${datePart}-${randomPart}`;

    const currentStatus = data?.newReport;
    const newStatus = currentStatus === "Pending" ? "Accepted" : "Pending";

    const addata = {
      acceptedDate: new Date(),
      caseNumber,
      newReportStatus: "Pending",
      newReportAccepted: "Accepted",
      caseTracking: "Accepted",
    };

    const { data: updateData, error: updateError } = await supabase
      .from("sti_dgoms_case")
      .update({ ...addata, newReport: newStatus })
      .eq("id", caseId);

    if (updateError) {
      console.error("Error updating row: ", updateError);
    } else {
      console.log("Row updated:", updateData);
      setincidentStatus(newStatus);

      setIsOpen(false);
    }

    window.location.reload();
  };

  const handleDeny = async () => {
    setIsOpen(false);
    try {
      const { error: deleteError } = await supabase
        .from("sti_dgoms_case")
        .delete()
        .eq("id", caseId);

      if (deleteError) {
        console.error("Error deleting from incident_reports:", deleteError);
        return;
      }

      console.log("Case successfully deleted from incident_reports.");
    } catch (error) {
      console.error("Error during delete operation:", error);
    }

    window.location.reload();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <div className="px-6 py-3 bg-green-800 text-white rounded-full mr-6">
          Check Case
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="mb-3">{sentBy}</div>
          </DialogTitle>
          <DialogDescription className="text-left">
            <div className="">
              <div className="font-bold w-[20em] text-lg py-4">
                {typeOfIncident}
              </div>
              <div>
                <div>
                  <p className="">
                    <span className="font-bold justify-start">Section : </span>
                    {studentSection}
                  </p>
                  <p className="">
                    <span className="font-bold">
                      Person involve in the incident :{" "}
                    </span>
                    {offenderName}
                  </p>

                  <p className="">
                    <span className="font-bold">Report created : </span>
                    {format(parseISO(created_at), "MM/dd/yyyy")}
                  </p>
                  <p className="">
                    <span className="font-bold">Reported by: </span>
                    {sentBy}
                  </p>
                </div>
              </div>
              {userSession === "School Administrator" ? (
                <div></div>
              ) : (
                <div className=" flex justify-between mt-4">
                  <button
                    onClick={handleAccept}
                    className="p-3 text-white rounded-md bg-green-600"
                  >
                    Accept{" "}
                  </button>
                  <button
                    onClick={handleDeny}
                    className="p-3 text-white rounded-md bg-red-600"
                  >
                    Deny
                  </button>
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
