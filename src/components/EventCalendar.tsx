"use client";

import { Ellipsis } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div className="bg-white p-4 rounded-md">
      <Calendar onChange={onChange} value={value} />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4 mt-8">Events</h1>
        <Ellipsis />
      </div>
      <div className="flex flex-col gap-4"></div>
    </div>
  );
};

export default EventCalendar;
