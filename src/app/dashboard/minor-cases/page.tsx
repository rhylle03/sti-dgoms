"use client";

import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import { supabase } from "@/utils/supabase/client";
import { Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreateNewReportDialog from "@/dialog/CreateNewReportDialog";

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
  studentSection: string;
  resolutionStatus: string;
  offenderName: string;
  caseNumber: string;
  created_at: string;
  incidentDescription: string;
};

const columns = [
  { header: "Student Name", accessor: "studentName" },
  { header: "Section", accessor: "studentSection", className: "md:table-cell" },
  { header: "Case Record", accessor: "caseRecord", className: "md:table-cell" },
  { header: "Date", accessor: "date", className: "md:table-cell" },
  { header: "Offense", accessor: "offense", className: " lg:table-cell" },
  { header: "Actions", accessor: "action" },
];

const ITEMS_PER_PAGE = 10;

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${month}-${day}-${year}`;
};

const MinorCases = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStudents = async (page: number, search = "") => {
    try {
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      let query = supabase
        .from("sti_dgoms_case")
        .select("*", { count: "exact" })
        .eq("offenseType", "Minor")
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
          studentSection: student.studentSection,
          created_at: student.created_at,
          incidentDescription: student.incidentDescription,
        }));

        setStudents(formattedStudents);
        setTotalPages(Math.ceil((count ?? 0) / ITEMS_PER_PAGE));
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };
  const handleDelete = async () => {
    if (!selectedCaseId) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("sti_dgoms_case")
        .delete()
        .eq("id", selectedCaseId);

      if (error) throw error;

      setIsConfirmDeleteOpen(false);
      setSelectedCaseId(null);
      fetchStudents(currentPage);
    } catch (error) {
      console.error("Error deleting record:", error);
    } finally {
      setIsLoading(false);
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
        </div>
      </td>
      <td className="md:table-cell">{item.studentSection}</td>
      <td className="md:table-cell">{item.offenseType}</td>

      <td className="md:table-cell">{formatDate(item.created_at)}</td>
      <td className="md:table-cell">{item.incidentDescription}</td>
      <td>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedCaseId(item.id);
              setIsConfirmDeleteOpen(true);
            }}
            className="w-7 h-7 flex items-center justify-center"
          >
            <Trash size={16} color="red" />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="md:block text-lg font-semibold">Minor Cases</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-4 self-end">
            <input
              type="text"
              placeholder="Search by student name"
              className="border rounded px-2 py-1"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <CreateNewReportDialog />
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={students} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <Dialog open={isConfirmDeleteOpen} onOpenChange={setIsConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="mb-4">Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this case?</p>
          <DialogFooter className="mt-4">
            <Button
              variant="ghost"
              onClick={() => setIsConfirmDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MinorCases;
