"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  fetchCases,
  fetchConsultation,
  fetchGoodMoral,
} from "@/utils/supabase/fetchdata";
import dayjs from "dayjs";

const mockData = {
  Cases: [
    { id: 1, type: "studentName", description: "", date: "" },
    {
      id: 2,
      type: "Created_at",
      description: "",
      date: "",
    },
    {
      id: 3,
      type: "Offense",
      description: "",
      date: "",
    },
    { id: 4, type: "Section", description: "", date: "" },
    { id: 5, type: "Case", description: "", date: "" },
  ],
  "Good Moral": [
    { id: 1, student: "studentName", status: "Approved", date: "" },
    { id: 2, student: "studentName", status: "Pending", date: "" },
    { id: 3, student: "studentName", status: "Approved", date: "" },
  ],
  Consultation: [
    {
      id: 1,
      student: "Appointment Set By",
      topic: "",
      date: "",
    },
    {
      id: 2,
      student: "Created at",
      topic: "",
      date: "",
    },
    {
      id: 3,
      student: "Filled By",
      topic: "",
      date: "",
    },
  ],
  "Parent Teacher Conference": [
    {
      id: 1,
      student: "",
      teacher: "",
      date: "",
    },
    {
      id: 2,
      student: "",
      teacher: "",
      date: "",
    },
    {
      id: 3,
      student: "",
      teacher: "",
      date: "",
    },
  ],
  Counselling: [
    {
      id: 1,
      student: "",
      issue: "",
      date: "",
    },
    {
      id: 2,
      student: "",
      issue: "",
      date: "",
    },
    {
      id: 3,
      student: "",
      issue: "",
      date: "",
    },
  ],
};

type DataType = keyof typeof mockData;

export default function Dashboard() {
  const [timeFilter, setTimeFilter] = useState("7d");
  const [currentType, setCurrentType] = useState<DataType>("Cases");

  const [caseFilter, setCaseFilter] = useState<"All" | "Major" | "Minor">(
    "All"
  );
  const [goodmoralFilter, setGoodMoralFilter] = useState<
    "total" | "pending" | "approved" | "denied"
  >("total");

  const [loading, setLoading] = useState(false);

  const [casesData, setCasesData] = useState<any[]>([]);
  const [goodMoralData, setGoodMoralData] = useState<any[]>([]);
  const [consultationData, setConsultationData] = useState<any[]>([]);

  const data = mockData[currentType];

  useEffect(() => {
    if (currentType === "Cases" && casesData.length === 0 && !loading) {
      const fetchData = async () => {
        setLoading(true);
        const fetchedData = await fetchCases();
        setCasesData(fetchedData);
        setLoading(false);
      };
      fetchData();
    }
  }, [currentType, casesData.length, loading]);

  useEffect(() => {
    if (
      currentType === "Good Moral" &&
      goodMoralData.length === 0 &&
      !loading
    ) {
      const fetchData = async () => {
        setLoading(true);
        const fetchedData = await fetchGoodMoral();
        setGoodMoralData(fetchedData);
        setLoading(false);
      };
      fetchData();
    }
  }, [currentType, goodMoralData.length, loading]);

  useEffect(() => {
    if (
      currentType === "Consultation" ||
      currentType === "Parent Teacher Conference" ||
      (currentType === "Counselling" &&
        consultationData.length === 0 &&
        !loading)
    ) {
      const fetchData = async () => {
        setLoading(true);
        const fetchedData = await fetchConsultation();
        setConsultationData(fetchedData);
        setLoading(false);
      };
      fetchData();
    }
  }, [currentType, consultationData.length, loading]);

  const filteredData =
    currentType === "Cases"
      ? casesData.filter(
          (item: any) =>
            (caseFilter === "All" || item.offenseType === caseFilter) &&
            (timeFilter === "7d"
              ? dayjs(item.created_at).isAfter(dayjs().subtract(7, "days"))
              : timeFilter === "30d"
              ? dayjs(item.created_at).isAfter(dayjs().subtract(30, "days"))
              : timeFilter === "6m"
              ? dayjs(item.created_at).isAfter(dayjs().subtract(6, "months"))
              : timeFilter === "1y"
              ? dayjs(item.created_at).isAfter(dayjs().subtract(1, "year"))
              : true)
        )
      : currentType === "Good Moral"
      ? goodMoralData.filter(
          (item: any) =>
            (goodmoralFilter === "total" ||
              item.request_status === goodmoralFilter) &&
            (timeFilter === "7d"
              ? dayjs(item.created_at).isAfter(dayjs().subtract(7, "days"))
              : timeFilter === "30d"
              ? dayjs(item.created_at).isAfter(dayjs().subtract(30, "days"))
              : timeFilter === "6m"
              ? dayjs(item.created_at).isAfter(dayjs().subtract(6, "months"))
              : timeFilter === "1y"
              ? dayjs(item.created_at).isAfter(dayjs().subtract(1, "year"))
              : true)
        )
      : currentType === "Consultation"
      ? consultationData.filter(
          (item: any) =>
            item.service === "Consultation" &&
            (timeFilter === "7d"
              ? dayjs(item.created_at).isAfter(dayjs().subtract(7, "days"))
              : timeFilter === "30d"
              ? dayjs(item.created_at).isAfter(dayjs().subtract(30, "days"))
              : timeFilter === "6m"
              ? dayjs(item.created_at).isAfter(dayjs().subtract(6, "months"))
              : timeFilter === "1y"
              ? dayjs(item.created_at).isAfter(dayjs().subtract(1, "year"))
              : true)
        )
      : currentType === "Parent Teacher Conference"
      ? consultationData.filter(
          (item: any) =>
            item.service === "Parent Teacher Conference" &&
            (timeFilter === "7d"
              ? dayjs(item.created_at).isAfter(dayjs().subtract(7, "days"))
              : timeFilter === "30d"
              ? dayjs(item.created_at).isAfter(dayjs().subtract(30, "days"))
              : timeFilter === "6m"
              ? dayjs(item.created_at).isAfter(dayjs().subtract(6, "months"))
              : timeFilter === "1y"
              ? dayjs(item.created_at).isAfter(dayjs().subtract(1, "year"))
              : true)
        )
      : currentType === "Counselling"
      ? consultationData.filter(
          (item: any) =>
            item.service === "Counselling" &&
            (timeFilter === "7d"
              ? dayjs(item.created_at).isAfter(dayjs().subtract(7, "days"))
              : timeFilter === "30d"
              ? dayjs(item.created_at).isAfter(dayjs().subtract(30, "days"))
              : timeFilter === "6m"
              ? dayjs(item.created_at).isAfter(dayjs().subtract(6, "months"))
              : timeFilter === "1y"
              ? dayjs(item.created_at).isAfter(dayjs().subtract(1, "year"))
              : true)
        )
      : data;

  const totalItems = filteredData.length;
  const typeSpecificCounts = {
    Cases: {
      major: filteredData.filter((item: any) => item.offenseType === "Major")
        .length,
      minor: filteredData.filter((item: any) => item.offenseType === "Minor")
        .length,
    },
    "Good Moral": {
      approved: filteredData.filter(
        (item: any) => item.request_status === "approved"
      ).length,
      pending: filteredData.filter(
        (item: any) => item.request_status === "pending"
      ).length,
    },
    Consultation: {},
    "Parent Teacher Conference": {},
    Counselling: {},
  };

  return (
    <div className="mx-auto w-[100%] p-4">
      <div className="mb-6 flex flex-wrap gap-2">
        {Object.keys(mockData).map((type) => (
          <Button
            key={type}
            variant={currentType === type ? "default" : "outline"}
            onClick={() => {
              setCurrentType(type as DataType);
              setCaseFilter("All");
            }}
          >
            {type}
          </Button>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap gap-4">
        <Select onValueChange={setTimeFilter} defaultValue={timeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last Week</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="6m">Last 6 months</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>

        {currentType === "Cases" && (
          <Select
            onValueChange={(value) =>
              setCaseFilter(value as "All" | "Major" | "Minor")
            }
            defaultValue={caseFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter cases" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Cases</SelectItem>
              <SelectItem value="Major">Major Cases</SelectItem>
              <SelectItem value="Minor">Minor Cases</SelectItem>
            </SelectContent>
          </Select>
        )}

        {currentType === "Good Moral" && (
          <Select
            onValueChange={(value) =>
              setGoodMoralFilter(
                value as "total" | "pending" | "approved" | "denied"
              )
            }
            defaultValue={goodmoralFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter cases" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="total">Total</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="denied">Denied</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total {currentType}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
          </CardContent>
        </Card>
        {currentType === "Cases" && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Major Cases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {typeSpecificCounts.Cases.major}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Minor Cases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {typeSpecificCounts.Cases.minor}
                </div>
              </CardContent>
            </Card>
          </>
        )}
        {currentType === "Good Moral" && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {typeSpecificCounts["Good Moral"].approved}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {typeSpecificCounts["Good Moral"].pending}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {currentType === "Cases" && <TableHead>Student</TableHead>}
            {currentType === "Good Moral" && <TableHead>Student</TableHead>}
            {currentType === "Consultation" && (
              <TableHead>Appointment Set By:</TableHead>
            )}
            {currentType === "Parent Teacher Conference" && (
              <TableHead>Appointment Set By:</TableHead>
            )}
            {currentType === "Counselling" && (
              <TableHead>Appointment Set By:</TableHead>
            )}

            <TableHead>Created at</TableHead>

            {currentType === "Cases" && <TableHead>Offense</TableHead>}
            {currentType === "Cases" && <TableHead>Section</TableHead>}
            {currentType === "Cases" && <TableHead>Case</TableHead>}

            {currentType === "Good Moral" && <TableHead>Status</TableHead>}
            {currentType === "Consultation" && <TableHead>Filled By</TableHead>}
            {currentType === "Consultation" && <TableHead>Status</TableHead>}

            {currentType === "Parent Teacher Conference" && (
              <TableHead>Filled By</TableHead>
            )}
            {currentType === "Parent Teacher Conference" && (
              <TableHead>Status</TableHead>
            )}

            {currentType === "Counselling" && <TableHead>Filled By</TableHead>}
            {currentType === "Counselling" && <TableHead>Status</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                {item.offenderName ||
                  item.student_name ||
                  item.user ||
                  item.student}
              </TableCell>
              <TableCell>
                {dayjs(item.created_at).format("MMM D, YYYY")}
              </TableCell>

              {currentType === "Cases" && (
                <TableCell>{item.offenseType}</TableCell>
              )}
              {currentType === "Cases" && (
                <TableCell>{item.studentSection}</TableCell>
              )}
              {currentType === "Cases" && (
                <TableCell>{item.caseInput}</TableCell>
              )}

              {currentType === "Good Moral" && (
                <TableCell className="capitalize">
                  {item.request_status}
                </TableCell>
              )}
              {currentType === "Consultation" && (
                <TableCell>{item.filled_by}</TableCell>
              )}
              {currentType === "Consultation" && (
                <TableCell>{item.request_status}</TableCell>
              )}

              {currentType === "Parent Teacher Conference" && (
                <TableCell>{item.filled_by}</TableCell>
              )}
              {currentType === "Parent Teacher Conference" && (
                <TableCell>{item.request_status}</TableCell>
              )}

              {currentType === "Counselling" && (
                <TableCell>{item.filled_by}</TableCell>
              )}
              {currentType === "Counselling" && (
                <TableCell>{item.request_status}</TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
