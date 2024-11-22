"use client";

import VisitUserDialog from "@/dialog/VisitUserDialog";
import { supabase } from "@/utils/supabase/client";
import { format, formatDistanceToNow } from "date-fns";
import { parseISO } from "date-fns";
import { useEffect, useState } from "react";

const itemsPerPage = 7;

const Users = () => {
  const [data, setData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: fetchedData, error } = await supabase
          .from("users")
          .select("*");
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
        {currentData.map((users) => (
          <div className="flex justify-between border-b-2" key={users.id}>
            <div className="flex py-5">
              <div></div>
              <div className="pl-2 w-[20em]">
                <p className="font-bold text-lg">
                  {users.firstName} {users.lastName}
                </p>
                <span className="font-normal text-base">
                  Date: {format(parseISO(users.created_at), "MM/dd/yyyy")}{" "}
                  &nbsp;
                  {formatDistanceToNow(parseISO(users.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>

            <div className="my-auto">
              <VisitUserDialog
                username={users.username}
                firstName={users.firstName}
                lastName={users.lastName}
                password={users.password}
                userType={users.userType}
              ></VisitUserDialog>
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

export default Users;
