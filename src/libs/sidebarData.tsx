"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  NotepadText,
  LogOut,
  Bell,
  RefreshCw,
  CircleHelp,
  BadgePlus,
  Users,
  CircleCheckBig,
  SquareChartGantt,
  GalleryVertical,
  Gavel,
  LayoutDashboardIcon,
  ScrollText,
  BookText,
  CalendarArrowUp,
  Mail,
  Calendar,
  SquareCheckBig,
  CalendarCheck,
  ChartBar,
} from "lucide-react";

const sidebarItemsStudent = [
  {
    text: "Dashboard",
    icon: <LayoutDashboardIcon />,
    active: "/student-portal",
    redirect: "/student-portal",
  },
  {
    text: "View Offenses",
    icon: <BookText />,
    active: "/student-portal/view-offenses",
    redirect: "/student-portal/view-offenses",
  },
  {
    text: "Submit Incident Report",
    icon: <Bell />,
    active: "/student-portal/submit-incident-report",
    redirect: "/student-portal/submit-incident-report?showDialog=true",
  },
  {
    text: "Submit Good Moral Request",
    icon: <RefreshCw />,
    active: "/student-portal/good-moral-request",
    redirect: "/student-portal/good-moral-request",
  },
];

export { sidebarItemsStudent };

const sidebarItemsDO = [
  {
    text: "Dashboard",
    icon: <LayoutDashboard />,
    active: "/dashboard",
    redirect: "/dashboard",
  },
  {
    text: "Student Records",
    icon: <NotepadText />,
    active: "/dashboard/student-records",
    redirect: "/dashboard/student-records",
  },
  {
    text: "Minor Cases",
    icon: <BookText />,
    active: "/dashboard/minor-cases",
    redirect: "/dashboard/minor-cases",
  },
  {
    text: "View Reports",
    icon: <Bell />,
    active: "/dashboard/view-report",
    redirect: "/dashboard/view-report",
  },
  {
    text: "Solved Cases",
    icon: <CircleCheckBig />,
    active: "/dashboard/solved-cases",
    redirect: "/dashboard/solved-cases",
  },
  {
    text: "Subject for Hearing",
    icon: <CalendarArrowUp />,
    active: "/dashboard/subject-for-hearing",
    redirect: "/dashboard/subject-for-hearing",
  },
  {
    text: "Set Hearing",
    icon: <SquareChartGantt />,
    active: "/dashboard/set-hearing",
    redirect: "/dashboard/set-hearing",
  },
  {
    text: "Ongoing Cases",
    icon: <RefreshCw />,
    active: "/dashboard/ongoing-cases",
    redirect: "/dashboard/ongoing-cases",
  },
  {
    text: "Tracking and Recording Action",
    icon: <Gavel />,
    active: "/dashboard/tracking-and-recording",
    redirect: "/dashboard/tracking-and-recording",
  },
  {
    text: "Send Message",
    icon: <Mail />,
    active: "/dashboard/send-message",
    redirect: "/dashboard/send-message",
  },
];

export { sidebarItemsDO };

const sidebarItemsGA = [
  {
    text: "Dashboard",
    icon: <LayoutDashboard />,
    active: "/dashboard",
    redirect: "/dashboard",
  },
  {
    text: "Student Records",
    icon: <NotepadText />,
    active: "/dashboard/student-records",
    redirect: "/dashboard/student-records",
  },

  {
    text: "View Reports",
    icon: <Bell />,
    active: "/dashboard/view-report",
    redirect: "/dashboard/view-report",
  },
  {
    text: "Appointments",
    icon: <CircleCheckBig />,
    active: "/dashboard/appointments",
    redirect: "/dashboard/appointments",
  },
  {
    text: "Good Moral",
    icon: <CircleCheckBig />,
    active: "/dashboard/good-moral-applications",
    redirect: "/dashboard/good-moral-applications",
  },
];

export { sidebarItemsGA };

const sidebarItemsSchoolAdmin = [
  {
    text: "Dashboard",
    icon: <LayoutDashboard />,
    active: "/academic-head",
    redirect: "/academic-head",
  },
  {
    text: "Student Records",
    icon: <NotepadText />,
    active: "/academic-head/student-records",
    redirect: "/academic-head/student-records",
  },
  {
    text: "Good Moral Request Status",
    icon: <CircleCheckBig />,
    active: "/academic-head/good-moral-status",
    redirect: "/academic-head/good-moral-status",
  },
  {
    text: "Generate Reports",
    icon: <ChartBar />,
    active: "/academic-head/generate-report",
    redirect: "/academic-head/generate-report",
  },
  {
    text: "Hearing",
    icon: <CalendarCheck />,
    active: "/academic-head/hearing",
    redirect: "/academic-head/hearing",
  },
];

export { sidebarItemsSchoolAdmin };

const sidebarItemsTeacher = [
  {
    text: "Dashboard",
    icon: <LayoutDashboard />,
    active: "/teacher-portal",
    redirect: "/teacher-portal",
  },
  {
    text: "Submit Incident Report",
    icon: <NotepadText />,
    active: "/teacher-portal/submit-report",
    redirect: "/teacher-portal/submit-report?showDialog=true",
  },
  {
    text: "Case status",
    icon: <SquareCheckBig />,
    active: "/teacher-portal/case-status",
    redirect: "/teacher-portal/case-status",
  },
];

export { sidebarItemsTeacher };

const sidebarItemsPH = [
  {
    text: "Dashboard",
    icon: <LayoutDashboard />,
    active: "/program-head",
    redirect: "/program-head",
  },
  {
    text: "Submit Incident Report",
    icon: <NotepadText />,
    active: "/program-head/submit-report",
    redirect: "/program-head/submit-report?showDialog=true",
  },
  {
    text: "Case status",
    icon: <SquareCheckBig />,
    active: "/program-head/case-status",
    redirect: "/program-head/case-status",
  },
  {
    text: "Hearing",
    icon: <Calendar />,
    active: "/program-head/hearing",
    redirect: "/program-head/hearing",
  },
];

export { sidebarItemsPH };
