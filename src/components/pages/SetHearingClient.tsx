"use client";

import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Eye, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SetHearingCommitee from "@/dialog/SetHearingCommitee";

type Student = {
  id: number;
  studentName: string;
  caseNumber: string;
  offenderName: string;
  typeOfIncident: string;
  setForHearing: string;
  sentBy: string;
};

const columns = [
  {
    header: "Case Number",
    accessor: "caseNumber",
  },
  {
    header: "Status",
    accessor: "setForHearing",
    className: "md:table-cell",
  },
  {
    header: "Incident Type",
    accessor: "typeOfIncident",
    className: "md:table-cell",
  },
  {
    header: "Reported by",
    accessor: "sentBy",
    className: "md:table-cell",
  },
  {
    header: "Student involve",
    accessor: "offenderName",
    className: "lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const ITEMS_PER_PAGE = 10;

const NewIncidentList = async ({ user_name }: any) => {
  const [viewReport, setStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);

  const fetchFullName = async (userId: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("firstName, lastName")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching fullName:", error.message);
      return null;
    }

    const fullName = data ? `${data.firstName} ${data.lastName}` : null;
    return fullName;
  };

  const fetchStudents = async (page: number) => {
    try {
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from("sti_dgoms_case")
        .select("*", { count: "exact" })
        .eq("caseTracking", "For Hearing")
        .range(start, end);

      if (error) {
        console.error("Error fetching data:", error.message);
        return;
      }

      if (data) {
        const formattedStudents = await Promise.all(
          data.map(async (student: any) => {
            const fullName = await fetchFullName(student.sentBy);
            return {
              id: student.id,
              studentName: student.studentName,
              caseNumber: student.caseNumber,
              offenderName: student.offenderName,
              typeOfIncident: student.typeOfIncident,
              setForHearing: student.setForHearing,
              sentBy: student.sentBy,
            };
          })
        );

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
      <td className="flex p-8">
        <div className="ml-0">
          <h3 className="font-semibold">{item.caseNumber}</h3>
        </div>
      </td>
      <td className="md:table-cell">{item.setForHearing}</td>
      <td className="md:table-cell">{item.typeOfIncident}</td>
      <td className="md:table-cell">{item.sentBy}</td>
      <td className="md:table-cell">{item.offenderName}</td>

      <td>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/set-hearing/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100">
              <Eye size={16} color="black" />
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
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="md:block text-lg font-semibold">For hearings </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-4 self-end">
            <SetHearingCommitee user_name={user_name} />
          </div>
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
