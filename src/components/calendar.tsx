"use client";

import { Calendar } from "@/components/ui/calendar";
import React from "react";

export default function calendar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <div className="w-[full] mb-4 justify-center">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="box"
      />
    </div>
  );
}
