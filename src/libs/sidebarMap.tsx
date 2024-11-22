"use client";

import Sidebar, { SidebarItem } from "@/components/Sidebar";
import {
  sidebarItemsStudent,
  sidebarItemsDO,
  sidebarItemsTeacher,
  sidebarItemsGA,
  sidebarItemsSchoolAdmin,
  sidebarItemsPH,
} from "./sidebarData";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SidebarLogOut, SignOut } from "@/components/auth/SignOutButton";

export default function SidebarStudent() {
  const pathname = usePathname();
  return (
    <Sidebar>
      {sidebarItemsStudent.map((item, index) => (
        <SidebarItem
          key={index}
          text={item.text}
          icon={item.icon}
          active={pathname === item.active}
          redirect={item.redirect}
        />
      ))}
      <SidebarLogOut />
    </Sidebar>
  );
}

export function SidebarDO() {
  const [isStudentRecordsOpen, setIsStudentRecordsOpen] = useState(false);
  const pathname = usePathname();

  const toggleDropdown = () => {
    setIsStudentRecordsOpen((prev) => !prev);
  };

  return (
    <Sidebar>
      {sidebarItemsDO.map((item, index) => (
        <div key={index}>
          <SidebarItem
            text={item.text}
            icon={item.icon}
            active={pathname === item.active}
            redirect={item.redirect}
          />
        </div>
      ))}
      <SidebarLogOut />
    </Sidebar>
  );
}

export function SidebarTeacher() {
  const pathname = usePathname();
  return (
    <Sidebar>
      {sidebarItemsTeacher.map((item, index) => (
        <SidebarItem
          key={index}
          text={item.text}
          icon={item.icon}
          active={pathname === item.active}
          redirect={item.redirect}
        />
      ))}
      <SidebarLogOut />
    </Sidebar>
  );
}

export function SidebarPH() {
  const pathname = usePathname();
  return (
    <Sidebar>
      {sidebarItemsPH.map((item, index) => (
        <SidebarItem
          key={index}
          text={item.text}
          icon={item.icon}
          active={pathname === item.active}
          redirect={item.redirect}
        />
      ))}
      <SidebarLogOut />
    </Sidebar>
  );
}

export function SidebarGA() {
  const [isStudentRecordsOpen, setIsStudentRecordsOpen] = useState(false);
  const pathname = usePathname();

  const toggleDropdown = () => {
    setIsStudentRecordsOpen((prev) => !prev);
  };
  return (
    <Sidebar>
      {sidebarItemsGA.map((item, index) => (
        <div key={index}>
          <SidebarItem
            text={item.text}
            icon={item.icon}
            active={pathname === item.active}
            redirect={item.redirect}
          />
        </div>
      ))}
      <SidebarLogOut />
    </Sidebar>
  );
}

export function SidebarSA() {
  const [isStudentRecordsOpen, setIsStudentRecordsOpen] = useState(false);
  const pathname = usePathname();

  const toggleDropdown = () => {
    setIsStudentRecordsOpen((prev) => !prev);
  };
  return (
    <Sidebar>
      {sidebarItemsSchoolAdmin.map((item, index) => (
        <div key={index}>
          <SidebarItem
            text={item.text}
            icon={item.icon}
            active={pathname === item.active}
            redirect={item.redirect}
          />
        </div>
      ))}
      <SidebarLogOut />
    </Sidebar>
  );
}
