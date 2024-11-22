"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { Bell } from "lucide-react";
import { X, Reply, Forward, Trash2, Users } from "lucide-react";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

type Notification = {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  studentName: string;
  created_at: string;
};

export default function NotificationHearing({
  studentName,
}: {
  studentName: string;
}) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null); // Track selected notification

  const dropdownRef = useRef<HTMLDivElement>(null);

  // fetch notifications for the desired student
  const fetchNotifications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("notification")
      .select("*")
      .ilike("studentName", `%${studentName}%`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notifications:", error);
    } else {
      setNotifications(
        data?.map((notif) => ({
          ...notif,
          is_read: notif.is_read || false,
        })) || []
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    if (studentName) {
      fetchNotifications();
    }
  }, [studentName]);

  const handleNotificationClick = async (notificationId: number) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, is_read: true } : notif
      )
    );

    const { error } = await supabase
      .from("notification")
      .update({ is_read: true, updated_at: new Date().toISOString() })
      .eq("id", notificationId);

    if (error) {
      console.error("Error updating notification as read:", error);
    }

    const notification = notifications.find(
      (notif) => notif.id === notificationId
    );
    if (notification) {
      setSelectedNotification(notification);
    }

    setShowDropdown(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const unreadCount = notifications.filter((notif) => !notif.is_read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown((prev) => !prev)}
        className="rounded-full w-7 h-7 flex items-center justify-center relative cursor-pointer"
      >
        <Bell />
        {unreadCount > 0 && (
          <div className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-red-500 text-white rounded-full text-xs">
            {unreadCount}
          </div>
        )}
      </button>
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden z-50">
          <ul className="divide-y divide-gray-200">
            {loading ? (
              <li className="p-3 text-center">
                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </li>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <li
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                  className={`p-3 hover:bg-gray-100 cursor-pointer ${
                    notification.is_read ? "bg-gray-100" : ""
                  }`}
                >
                  <p className="text-sm font-semibold">{notification.title}</p>
                  <p className="text-xs text-gray-500">
                    {notification.message}
                  </p>
                </li>
              ))
            ) : (
              <li className="p-3 text-sm text-gray-500">
                No new notifications
              </li>
            )}
          </ul>
        </div>
      )}
      {pageLoading && <Loader />}

      {selectedNotification && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800/50 backdrop-blur-sm z-50">
          <Card className="w-full max-w-2xl bg-white h-auto shadow-lg">
            <div className="flex items-center justify-between bg-blue-600 text-white px-4 py-3 rounded-t-lg">
              <h3 className="text-lg font-medium">
                {selectedNotification.title}
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedNotification(null)}
                className="hover:text-black bg-blue-600"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-sm">From</span>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-medium">
                      {selectedNotification.studentName.charAt(0)}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">
                      {selectedNotification.studentName}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      (
                      {formatDistanceToNow(
                        new Date(selectedNotification.created_at),
                        { addSuffix: true }
                      )}
                      )
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-sm">{selectedNotification.message}</div>
            </div>

            <div className="border-t px-4 py-3 flex justify-between">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    router.push("/program-head/hearing");
                    setSelectedNotification(null);
                  }}
                >
                  <Reply className="h-4 w-4 mr-2" />
                  View hearing date
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
