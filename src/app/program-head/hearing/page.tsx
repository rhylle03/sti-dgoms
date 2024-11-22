"use client";

import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { supabase } from "@/utils/supabase/client";
import { Filter, SortAsc } from "lucide-react";

type Student = {
  id: number;
  caseHearingStart: string;
  caseHearingEnd: string;
  sentBy: string;
};

const columns = [
  { header: "Sent By", accessor: "sentBy" },
  {
    header: "Hearing Date",
    accessor: "hearing",
    className: "lg:table-cell",
  },
];

const formatDateTime = (dateString: string) => {
  if (!dateString) return " ";
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return `${formattedDate} at ${formattedTime}`;
};

const ITEMS_PER_PAGE = 10;

const StudentRecord = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchStudents = async (page: number, search = "") => {
    try {
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      let query = supabase.from("notification").select("*", { count: "exact" });

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching data:", error.message);
        return;
      }

      if (data) {
        const formattedStudents = data.map((student: any) => ({
          id: student.id,
          caseHearingStart: student.caseHearingStart,
          caseHearingEnd: student.caseHearingEnd,
          sentBy: student.sentBy,
        }));

        setStudents(formattedStudents);
        setTotalPages(Math.ceil((count ?? 0) / ITEMS_PER_PAGE));
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const renderRow = (item: Student) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-100"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.sentBy}</h3>
        </div>
      </td>
      <td className="md:table-cell">
        {formatDateTime(item.caseHearingStart)} -{" "}
        {formatDateTime(item.caseHearingEnd)}
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="md:block text-lg font-semibold">Hearing</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-4 self-end"></div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={students} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default StudentRecord;
