"use client";

import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SidebarItemProps {
  icon?: React.JSX.Element;
  text: string;
  active?: boolean;
  redirect: string;
  onClick?: () => void;
}

export default function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-[20em] min-w-[250px] text-white fixed h-full bg-sti-blue flex flex-col p-5">
      <div className="flex items-center mb-5">
        <div className="w-20 m-auto">
          <img src="/sidebarlogoi.jpg" alt="STI Logo" width={50} height={50} />
        </div>
        <div className="pl-4">
          <h1 className="text-2xl font-bold">STI College</h1>
          <p>Disciplinary and Guidance Office Management</p>
        </div>
      </div>
      <div className="pt-5">
        <div>{children}</div>
      </div>
    </div>
  );
}

export function SidebarItem({
  icon,
  text,
  active,
  redirect,
  onClick,
}: SidebarItemProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRedirect = async () => {
    if (onClick) {
      onClick();
      return;
    }

    setLoading(true);
    await router.push(redirect);
    setLoading(false);
  };

  return (
    <li
      className={`flex items-center cursor-pointer p-3 m-2 rounded-md ${
        active ? "bg-sti-yellow text-black" : "hover:bg-sti-yellow"
      }`}
      onClick={handleRedirect}
    >
      {icon}
      <span className="pl-3">{text}</span>
      {loading && <Loader />}
    </li>
  );
}
