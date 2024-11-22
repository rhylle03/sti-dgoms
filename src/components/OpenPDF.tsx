"use client";

import { BookOpenText } from "lucide-react";

export default function OpenPDF() {
  const handlePDF = () => {
    window.open(
      "https://utfs.io/f/1Ne5vYQG6gF7mXgPoPezPCbpa3Wd9SOwBx0n7fRJHhLNsErA",
      "_blank"
    );
  };

  return (
    <>
      <button onClick={handlePDF}>
        <BookOpenText />
      </button>
    </>
  );
}
