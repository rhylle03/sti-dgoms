"use client";

import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Eye, Filter, Search, SortAsc, Trash } from "lucide-react";
import CreateNewReportDialog from "@/dialog/CreateNewReportDialog";
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
  caseId: string;
  studentName: string;
  typeOfIncident: string;
  acceptedDate: string;
  offenderName: string;
  created_at: string;
  sentBy: string;
  caseInput: string;
};

const columns = [
  { header: "Info", accessor: "studentName" },
  { header: "Incident Type", accessor: "typeOfIncident" },
  { header: "Date accepted", accessor: "acceptedDate" },
  { header: "Student involve", accessor: "offenderName" },
  { header: "Date Reported", accessor: "created_at" },
  { header: "Actions", accessor: "action" },
];

const ITEMS_PER_PAGE = 10;

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
};

const NewIncidentListClient = ({ denyModify }: { denyModify: boolean }) => {
  const [viewReport, setViewReport] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchReports = async (page: number) => {
    try {
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from("sti_dgoms_case")
        .select("*", { count: "exact" })
        .eq("caseTracking", "Accepted")
        .range(start, end);

      if (error) {
        console.error("Error fetching data:", error.message);
        return;
      }

      if (data) {
        const formattedReports = data.map((report: any) => ({
          id: report.id,
          studentName: report.studentName,
          typeOfIncident: report.typeOfIncident,
          acceptedDate: report.acceptedDate,
          offenderName: report.offenderName,
          created_at: report.created_at,
          sentBy: report.sentBy,
          caseId: report.caseId,
          caseInput: report.caseReport,
        }));

        setViewReport(formattedReports);
        setTotalPages(Math.ceil((count ?? 0) / ITEMS_PER_PAGE));
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
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
      fetchReports(currentPage);
    } catch (error) {
      console.error("Error deleting record:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const renderRow = (item: Student) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-gray-100"
    >
      <td className="flex items-center gap-4 p-8">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.sentBy}</h3>
        </div>
      </td>
      <td>{item.typeOfIncident}</td>
      <td>{formatDate(item.acceptedDate)}</td>
      <td>{item.offenderName}</td>
      <td>{formatDate(item.created_at)}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/view-report/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center">
              <Eye size={16} color="black" />
            </button>
          </Link>
          {!denyModify && (
            <button
              onClick={() => {
                setSelectedCaseId(item.id);
                setIsConfirmDeleteOpen(true);
              }}
              className="w-7 h-7 flex items-center justify-center"
            >
              <Trash size={16} color="red" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white h-full p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Accepted reports</h1>
        <div className="flex items-center gap-4">
          <CreateNewReportDialog />
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

export default NewIncidentListClient;
