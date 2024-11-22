"use client";

import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";
import { Eye, Filter, Search, SortAsc } from "lucide-react";

type Student = {
  id: number;
  studentID: string;
  studentName: string;
  studentEmail?: string;
  offenseType: string;
  studentYear: string;
  programCourse: string;
  contactInfo: string;
  sentBy: string;
  resolutionStatus: string;
  offenderName: string;
  caseNumber: string;
  caseResolutionStatus: string;
};

const columns = [
  { header: "Student Name", accessor: "studentName" },
  { header: "Student ID", accessor: "studentID", className: "md:table-cell" },
  { header: "Case Record", accessor: "caseRecord", className: "md:table-cell" },
  { header: "Case #", accessor: "year", className: "md:table-cell" },
  {
    header: "Resolution status",
    accessor: "resolutionStatus",
    className: "md:table-cell",
  },
  { header: "Course", accessor: "course", className: " lg:table-cell" },
  { header: "Contact", accessor: "contactInfo", className: "lg:table-cell" },
  { header: "Actions", accessor: "action" },
];

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

      let query = supabase
        .from("sti_dgoms_case")
        .select("*", { count: "exact" })
        .eq("caseTracking", "Resolution")
        .range(start, end);

      if (search) {
        query = query.or(
          `offenderName.ilike.%${search}%,studentID.ilike.%${search}%,caseNumber.ilike.%${search}%`
        );
      }

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching data:", error.message);
        return;
      }

      if (data) {
        const formattedStudents = data.map((student: any) => ({
          id: student.id,
          studentID: student.studentID,
          studentName: student.studentName,
          studentEmail: student.email,
          offenseType: student.offenseType,
          studentYear: student.studentYear,
          programCourse: student.programCourse,
          contactInfo: student.contactInfo,
          sentBy: student.sentBy,
          offenderName: student.offenderName,
          caseNumber: student.caseNumber,
          resolutionStatus: student.resolutionStatus,
          caseResolutionStatus: student.caseResolutionStatus,
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
          <h3 className="font-semibold">{item.offenderName}</h3>
          <p className="text-xs text-gray-500">{item?.studentEmail}</p>
        </div>
      </td>
      <td className="md:table-cell">{item.studentID}</td>
      <td className="md:table-cell">{item.offenseType}</td>
      <td className="md:table-cell">{item.caseNumber}</td>
      <td className="md:table-cell">{item.resolutionStatus}</td>
      <td className="md:table-cell">{item.programCourse}</td>
      <td className="md:table-cell">{item.contactInfo}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/student-records/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Eye width={16} height={16} />
            </button>
          </Link>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="md:block text-lg font-semibold">Student Records</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-4 self-end">
            <input
              type="text"
              placeholder="Search by student name"
              className="border rounded px-2 py-1"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
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
