"use client";

import { useEffect, useState } from "react";
import { Ellipsis } from "lucide-react";
import { supabase } from "@/utils/supabase/client";

interface UserCardProps {
  type: "ongoingCases" | "majorCase" | "minorCase" | "totalcase";
}

const UserCard = ({ type }: UserCardProps) => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (type === "ongoingCases") {
          const { data, error } = await supabase
            .from("sti_dgoms_case")
            .select("incidentStatus")
            .in("incidentStatus", ["Ongoing"]);

          console.log(data);

          if (error) throw error;
          setCount(data.length);
        } else if (type === "majorCase" || type === "minorCase") {
          const { data, error } = await supabase
            .from("sti_dgoms_case")
            .select("id, offenseType");

          if (error) throw error;
          const filteredCount = data?.filter(
            (item) =>
              item.offenseType === (type === "majorCase" ? "Major" : "Minor")
          ).length;
          setCount(filteredCount || 0);
        } else if (type === "totalcase") {
          const { count, error } = await supabase
            .from("sti_dgoms_case")
            .select("id", { count: "exact" });

          if (error) throw error;
          setCount(count || 0);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [type]);

  const typeMap: { [key: string]: string } = {
    ongoingCases: "Ongoing Cases",
    majorCase: "Major Case",
    minorCase: "Minor Case",
    totalcase: "Total Cases",
  };

  const colorMap: { [key: string]: string } = {
    ongoingCases: "bg-green-900",
    majorCase: "bg-black",
    minorCase: "bg-orange-500",
    totalcase: "bg-sti-blue",
  };

  return (
    <div
      className={`rounded-2xl p-4 flex-1 min-w-[130px] ${
        colorMap[type] || "bg-gray-500"
      }`}
    >
      <div className="flex justify-between items-center"></div>
      <h1 className="text-2xl font-semibold text-white my-4">{count}</h1>
      <h2 className="capitalize text-sm font-medium text-white">
        {typeMap[type]}
      </h2>
    </div>
  );
};

export default UserCard;
