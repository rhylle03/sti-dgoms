import { X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type Props = {
  title: string;
  onClose: () => void;
  onOk: () => void;
  children: React.ReactNode;
  disableOk?: boolean;
};

export default function Dialog({
  title,
  onClose,
  onOk,
  children,
  disableOk,
}: Props) {
  const searchParams = useSearchParams();
  const dialogRef = useRef<null | HTMLDialogElement>(null);
  const showDialog = searchParams.get("showDialog");
  const router = useRouter();

  useEffect(() => {
    if (showDialog === "true") {
      dialogRef.current?.showModal();
    } else if (showDialog === "false") {
      dialogRef.current?.close();
    }
  }, [showDialog]);

  const closeDialog = () => {
    dialogRef.current?.close();
    onClose();
    router.back();
  };

  const clickOk = () => {
    onOk();
    dialogRef.current?.close();
  };

  return showDialog === "true" ? (
    <dialog ref={dialogRef} className="rounded-md">
      <div className="w-[30em] p-5">
        <div className="flex justify-between border-b-2 py-3">
          <p className="font-bold">{title}</p>
          <button onClick={closeDialog}>
            <X />
          </button>
        </div>
        <div className="py-3">{children}</div>
        <div className="flex justify-center">
          <button
            onClick={clickOk}
            disabled={disableOk}
            className={`p-3 rounded-md mt-5 ${
              disableOk ? "bg-gray-300" : "bg-sti-yellow"
            }`}
          >
            I Understand
          </button>
        </div>
      </div>
    </dialog>
  ) : null;
}
