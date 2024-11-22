"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { CaseDocumentationDialog } from "@/dialog/CaseDocumentationDialog";
import CaseTrackingOngoing from "@/components/CaseTrackingOngoing";
import {
  Calendar,
  CalendarCheck,
  Gavel,
  Link,
  NotepadText,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type StudentData = {
  id: string;
  created_at: string;
  studentName: string;
  studentGrade: string;
  programCourse: string;
  studentYear: string;
  fileEvidence: string;
  typeOfIncident: string;
  whenIncidentOccur: string;
  incidentOccured: string;
  incidentSchool: string;
  incidentWitness: string;
  assistance: string;
  incidentDescription: string;
  sentBy: string;
  studentSection: string;
  caseNumber: string;
  offenderName: string;
  hearingEnded: string;
  caseRecord: string;
  newReport: string;
  userSession: string;
  caseSanction: string;
  caseResolution: string;
  caseResolutionStart: string;
  caseResolutionEnd: string;
  caseDocumentation: string;
  documents: string;
  additional_documents: string;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US");
};

export default function CaseRecordPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [studentData, setStudentData] = useState<StudentData | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from("sti_dgoms_case")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching student data:", error);
        } else {
          setStudentData(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchStudentData();
  }, [id]);

  const handleOpenImage = (url: string) => {
    window.open(url, "_blank");
  };

  if (!studentData) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="flex-1 p-4">
      <div className="flex gap-4 h-full">
        <div className="flex-1 flex flex-col gap-4 shadow-sm">
          <div className="flex gap-4">
            <div className="bg-sti-yellow p-4 rounded-md w-1/3">
              <h1 className="text-lg">{studentData.sentBy}</h1>
              <p className="text-sm text-gray-600 mt-1">
                Case #: {studentData.caseNumber}
              </p>
              <div className="mt-4 space-y-2">
                <div className="text-sm">
                  <span>Incident Type: </span>
                  <span>{studentData.typeOfIncident}</span>
                </div>
                <div className="text-sm">
                  <span>Program: </span>
                  <span>{studentData.studentGrade}</span>
                </div>
                <div className="text-sm">
                  <span>Student involve: </span>
                  <span>{studentData.offenderName}</span>
                </div>
                <div className="text-sm">
                  <span>Section: </span>
                  <span>{studentData.studentSection}</span>
                </div>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-md">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-400">Date reported</span>
                </div>
                <p className="mt-1">{formatDate(studentData.created_at)}</p>
              </div>
              <div className="bg-white p-4 rounded-md">
                <div className="flex items-center gap-2">
                  <Gavel className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-400">Sanction</span>
                </div>
                <p className="mt-1">{studentData.caseSanction || "-"}</p>
              </div>
              <div className="bg-white p-4 rounded-md">
                <div className="flex items-center gap-2">
                  <NotepadText className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-400">Resolution</span>
                </div>
                <p className="mt-1">{studentData.caseResolution || "-"}</p>
              </div>
              <div className="bg-white p-4 rounded-md">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-400">Resolution date</span>
                </div>
                <p className="mt-1">-</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md p-6 flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl">Narrative report</h2>
              <CaseDocumentationDialog caseId={id} />
            </div>
            <div className="space-y-2">
              <p className="text-sm">Name: {studentData.studentName}</p>
              <p className="text-sm">
                Date: {formatDate(studentData.created_at)}
              </p>
              <p className="text-sm">
                Incident Type: {studentData.typeOfIncident}
              </p>
              <div className="space-y-2">
                <p className="text-sm mt-10">
                  Describe the incident: {studentData.incidentDescription}
                </p>
                <div className="flex gap-3 pt-5">
                  {studentData.fileEvidence ? (
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleOpenImage(studentData.fileEvidence)
                        }
                      >
                        <Link className="h-4 w-4 mr-2" />
                        View Attachment
                      </Button>
                    </div>
                  ) : (
                    "No Document"
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-80 shrink-0">
          <div className="bg-white rounded-md shadow-sm p-4 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Case Tracking</h2>
            <CaseTrackingOngoing caseId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
