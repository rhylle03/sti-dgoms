"use client";

import { VisitIncidentReportDialog } from "@/dialog/VisitReportDialog";
import { supabase } from "@/utils/supabase/client";
import { format, formatDistanceToNow } from "date-fns";
import { parseISO } from "date-fns";
import { useEffect, useState } from "react";

const itemsPerPage = 10;

const IncidentReport = ({ userSession }: any) => {
  const [data, setData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: fetchedData, error } = await supabase
          .from("sti_dgoms_case")
          .select("*")
          .eq("caseTracking", "Pending");

        if (error) {
          console.error("Error fetching data:", error);
        } else {
          setData(fetchedData || []);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const currentData = data
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <div>
        {currentData.map((cases) => (
          <div className="flex justify-between border-b-2" key={cases.id}>
            <div className="flex py-5">
              <div></div>
              <div className=" w-[20em]">
                <p className="font-bold text-lg">{cases.sentBy}</p>
                <span className="font-normal text-base text-blue-500">
                  Date: {format(parseISO(cases.created_at), "MM/dd/yyyy")}{" "}
                  &nbsp;
                  {formatDistanceToNow(parseISO(cases.created_at), {
                    addSuffix: true,
                  })}
                </span>
                <p>New incident Report </p>
              </div>
              <div className="m-auto">
                <p
                  className={`text-sm text-white m-auto rounded-full px-4 py-1 ml-6 ${
                    cases.newReport === "Accepted"
                      ? "bg-green-600"
                      : "bg-red-500"
                  }`}
                >
                  {cases.newReport === "Accepted" ? "Accepted" : "Pending"}
                </p>
              </div>
            </div>
            <div className="my-auto">
              <VisitIncidentReportDialog
                caseId={cases.id}
                fullName={cases.studentName}
                offenderName={cases.offenderName}
                studentGrade={cases.studentGrade}
                studentSection={cases.studentSection}
                programCourse={cases.programCourse}
                studentYear={cases.studentYear}
                typeOfIncident={cases.typeOfIncident}
                created_at={cases.created_at}
                sentBy={cases.sentBy}
                newReport={cases.newReport}
                userSession={userSession}
              ></VisitIncidentReportDialog>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-l"
        >
          Previous
        </button>
        <span className="px-4 py-2">{`${currentPage} / ${totalPages}`}</span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-r"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default IncidentReport;
