"use client";
import { useEffect, useState } from "react";
import { Ellipsis } from "lucide-react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "@/utils/supabase/client"; // Ensure you have the correct path to supabase client

const StudentChart = () => {
  const [boysCount, setBoysCount] = useState<number>(0);
  const [girlsCount, setGirlsCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("gender");

        if (error) throw error;

        const boys = data?.filter((item) => item.gender === "Male").length || 0;
        const girls = data?.filter((item) => item.gender === "Female").length || 0;

        setBoysCount(boys);
        setGirlsCount(girls);
        setTotalCount(boys + girls);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);


  const boysPercentage = totalCount > 0 ? ((boysCount / totalCount) * 100).toFixed(2) : "0";
  const girlsPercentage = totalCount > 0 ? ((girlsCount / totalCount) * 100).toFixed(2) : "0";

  const data = [
    {
      name: "Total",
      count: totalCount,
      fill: "white",
    },
    {
      name: "Girls",
      count: girlsCount,
      fill: "#F4D03F",
    },
    {
      name: "Boys",
      count: boysCount,
      fill: "#0B5793",
    },
  ];

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Students</h1>
        <Ellipsis />
      </div>
      <div className="relative w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
   
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-sti-blue rounded-full" />
          <h1 className="font-bold">{boysCount}</h1>
          <h2 className="text-xs text-gray-300">Boys ({boysPercentage}%)</h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-sti-yellow rounded-full" />
          <h1 className="font-bold">{girlsCount}</h1>
          <h2 className="text-xs text-gray-300">Girls ({girlsPercentage}%)</h2>
        </div>
      </div>
    </div>
  );
};

export default StudentChart;
