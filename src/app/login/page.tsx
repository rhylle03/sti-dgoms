import LoginButton from "@/components/auth/LoginButton";
import React from "react";

export default async function Login() {
  return (
    <div>
      <div className="bg-sti-yellow w-100 h-3"></div>
      <div className="bg-sti-blue w-100 h-[60px] flex items-center">
        <h1 className="m-auto text-center text-white text-xl font-bold">
          Discliplinary and Guidance Office Management System
        </h1>
      </div>
      <div className="md:flex mt-10 items-center justify-center h-[80vh]">
        <div className="md:w-[30em] m-auto justify-center align-middle">
          <LoginButton />
        </div>
      </div>
    </div>
  );
}
