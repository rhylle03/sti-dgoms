"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";

import {
  Calendar,
  CalendarCheck,
  Gavel,
  Link,
  NotepadText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import CaseTrackingStudent from "@/components/CaseTrackingStudent";

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
  caseReport: string;
  offenseType: string;
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
  specificOffense: string;
  majorCategory: string;
  offenseCategory: string;
  documents: string;
  additional_documents: string;
  documentation_report: string;
  documentation_report_additional: string;
  resolutionStatus: string;
  appeal: string;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US");
};

export default function CaseRecordPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [resolutionStatus, setResolutionStatus] = useState<string | null>(null);

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
          setResolutionStatus(data.resolutionStatus || null);
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
                  <span>Offender Name: </span>
                  <span>{studentData.offenderName}</span>
                </div>
                <div className="text-sm">
                  <span>Course/Year: </span>
                  <span>
                    {studentData.programCourse}-{studentData.studentYear}
                  </span>
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
                  <span className="text-sm text-gray-400">Appeal</span>
                  {studentData.appeal}
                </div>
                <p className="mt-1">-</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md p-6 flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl">Narrative report</h2>
            </div>
            <div className="space-y-2 max-w-[70em]">
              <p className="text-sm break-words overflow-wrap break-word">
                Name: {studentData.studentName}
              </p>
              <p className="text-sm break-words overflow-wrap break-word">
                Date: {formatDate(studentData.created_at)}
              </p>
              <p className="text-sm break-words overflow-wrap break-word">
                Incident Type: {studentData.typeOfIncident}
              </p>
              <p className="text-sm break-words overflow-wrap break-word">
                When did the incident occur? {studentData.whenIncidentOccur}
              </p>

              <p className="text-sm break-words overflow-wrap break-word">
                Describe the incident: {studentData.incidentDescription}
              </p>
              <div className="flex gap-3 pt-5">
                {studentData.fileEvidence ? (
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenImage(studentData.fileEvidence)}
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
            <p className="text-sm font-semibold mt-6 break-words overflow-wrap break-word">
              Case hearing documentation:{" "}
              <span className="font-normal">
                {studentData.caseDocumentation}
              </span>
            </p>
            <div className="flex gap-3 pt-5">
              {studentData.documentation_report ? (
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleOpenImage(studentData.documentation_report)
                    }
                  >
                    <Link className="h-4 w-4 mr-2" />
                    View Document
                  </Button>
                </div>
              ) : (
                "No Document"
              )}
            </div>
            <p className="text-sm font-semibold break-words overflow-wrap break-word mt-8">
              Disciplinary Action:
            </p>
            <p className="text-sm break-words overflow-wrap break-word mt-2">
              {studentData.offenseType}
            </p>
            <p className="text-sm break-words overflow-wrap break-word mt-2">
              {studentData.typeOfIncident}
            </p>
            <p className="text-sm break-words overflow-wrap break-word mt-2">
              {studentData.caseSanction}
            </p>
            <p className="text-sm break-words overflow-wrap break-word mt-2">
              {studentData.majorCategory}
            </p>
            <p className="text-sm break-words overflow-wrap break-word mt-2">
              {studentData.specificOffense}
            </p>
            <p className="text-sm break-words overflow-wrap break-word mt-2">
              {studentData.offenseCategory}
            </p>
            <p className="text-sm font-semibold break-words overflow-wrap break-word mt-8">
              Case documentation:
            </p>
            <p className="text-sm break-words overflow-wrap break-word mt-2">
              {studentData.caseReport}
            </p>
          </div>
        </div>
        <div className="w-80 shrink-0">
          <div className="bg-white rounded-md shadow-sm p-4 sticky top-4">
            <h2 className="text-xl font-bold mb-4">Case Tracking</h2>
            <CaseTrackingStudent caseId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
