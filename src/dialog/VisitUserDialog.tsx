"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { useRouter } from "next/navigation";

export default function VisitUserDialog({
  username,
  firstName,
  lastName,
  password,
  userType,
}: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [incidentStatus, setIncidentStatus] = useState("");
  const router = useRouter();

  const handleDelete = async () => {
    const { data, error } = await supabase
      .from("users")
      .delete()
      .eq("username", username);

    if (error) {
      console.error("Error deleting row:", error);
    } else {
      console.log("Row deleted:", data);
      setIsOpen(false);
      window.location.reload();
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <div className="px-6 py-3 bg-green-800 text-white rounded-full mr-6">
          View User
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="mb-3">
              <p>
                {firstName} {lastName}
              </p>
            </div>
          </DialogTitle>
          <DialogDescription>
            <div>
              <div>
                <p>
                  <span>Username:</span> {username}
                </p>
                <p>
                  <span>Password:</span> {password}
                </p>
                <p>
                  <span>User Type:</span> {userType}{" "}
                </p>

                <p className="text-center mt-4">
                  <span className="text-red-500">
                    {" "}
                    {userType === "System Admin"
                      ? "Warning do not delete an admin login without a backup"
                      : ""}{" "}
                  </span>
                </p>
              </div>
              <div className="mt-4">
                <button
                  className="bg-red-600 px-5 py-3 text-white rounded-md hover:bg-red-400"
                  onClick={handleDelete}
                >
                  {" "}
                  Delete{" "}
                </button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
