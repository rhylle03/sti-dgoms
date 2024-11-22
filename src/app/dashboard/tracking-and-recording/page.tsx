"use client";

import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Edit, Filter, Search, SortAsc, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Student = {
  id: number;
  studentName: string;
  caseNumber: string;
  hearingNewStatus: string;
  typeOfIncident: string;
  offenderName: string;
  sentBy: string;
};

const columns = [
  {
    header: "Student Name",
    accessor: "studentNumber",
  },
  {
    header: "Case number",
    accessor: "caseNumber",
    className: "md:table-cell",
  },
  {
    header: "Incident Type",
    accessor: "typeOfIncident",
    className: "lg:table-cell",
  },
  {
    header: "Offender Name",
    accessor: "offenderName",
    className: "lg:table-cell",
  },
  {
    header: "Status",
    accessor: "typeOfIncident",
    className: "lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const ITEMS_PER_PAGE = 10;

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${month}-${day}-${year}`;
};

const NewIncidentList = () => {
  const [viewReport, setStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);

  const fetchStudents = async (page: number) => {
    try {
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from("sti_dgoms_case")
        .select("*", { count: "exact" })
        .eq("caseActionStatus", "For Decision")
        .range(start, end);

      if (error) {
        console.error("Error fetching data:", error.message);
        return;
      }

      if (data) {
        const formattedStudents = data.map((student: any) => ({
          id: student.id,
          studentName: student.studentName,
          caseNumber: student.caseNumber,
          programCourse: student.programCourse,
          hearingNewStatus: student.hearingNewStatus,
          typeOfIncident: student.typeOfIncident,
          offenderName: student.offenderName,
          sentBy: student.sentBy,
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
    fetchStudents(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  const renderRow = (item: Student) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-100 p-4"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.sentBy}</h3>
        </div>
      </td>
      <td className="md:table-cell">{item.caseNumber}</td>
      <td className="md:table-cell">{item.typeOfIncident}</td>
      <td className="md:table-cell">{item.offenderName}</td>
      <td className="md:table-cell">{item.hearingNewStatus}</td>
      <td>
        <div className="flex items-center gap-2">
          <>
            <Link href={`/dashboard/tracking-and-recording/${item.id}`}>
              <button className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100">
                <Edit size={16} color="black" />
              </button>
            </Link>
            <button
              onClick={() => {
                setSelectedCaseId(item.id);
                setIsConfirmDeleteOpen(true);
              }}
              className="w-7 h-7 flex items-center justify-center"
            >
              <Trash size={16} color="red" />
            </button>
          </>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="md:block text-lg font-semibold">
          Tracking and recording actions{" "}
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-4 self-end"></div>
        </div>
      </div>

      <Table columns={columns} renderRow={renderRow} data={viewReport} />
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

export default NewIncidentList;
