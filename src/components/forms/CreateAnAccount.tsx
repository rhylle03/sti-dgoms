"use client";

import Dialog from "@/modals/Dialog";
import { supabase } from "@/utils/supabase/client";
import React, { useRef, useState } from "react";

export default function CreateAnAccount() {
  const formRef = useRef(null);
  const submissionRef = useRef<HTMLFormElement | null>(null);
  const [formMessage, setFormMessage] = useState("");

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {
      username: formData.get("username"),
      password: formData.get("password"),
      userType: formData.get("userType"),
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
    };

    const userType = event.target.userType.value;

    if (userType === "DEFAULT") {
      setFormMessage("Please select a valid user type.");
      return;
    }

    const { data: newRecord, error } = await supabase
      .from("users")
      .insert([data]);

    if (error) {
      console.error("Error inserting data:", error.message);
      setFormMessage("Account Creation Failed");
    } else {
      console.log("Data inserted successfully:", newRecord);
      setFormMessage("Account Created Successfully");
    }

    if (submissionRef.current) {
      submissionRef.current.reset();
    }
  };

  return (
    <div>
      <div className="border-2 rounded-md p-8 bg-sti-blue text-white">
        <p className="text-center text-2xl pb-5">Create an Account</p>
        <form
          ref={submissionRef}
          className="w-[30em] flex flex-col"
          onSubmit={handleSubmit}
        >
          <label>Username:</label>
          <input
            placeholder="Username"
            className="mb-3 p-2 text-black"
            type="text"
            name="username"
            required
          />
          <label>Password:</label>
          <input
            placeholder="Password"
            className="mb-3 p-2 text-black"
            type="text"
            name="password"
            required
          />
          <label>User Type:</label>
          <select
            defaultValue={"DEFAULT"}
            className="text-black mb-3 p-2"
            name="userType"
            required
          >
            <option value="DEFAULT" disabled></option>
            <option value="Discipline Officer">Discipline Officer</option>
            <option value="Guidance Associater">Guidance Associate</option>
            <option value="School Administrator">School Administrator</option>
            <option value="Teacher">Teacher</option>
            <option value="Student">Student</option>
            <option value="System Admin">System Admin</option>
          </select>

          <label>First Name</label>
          <input
            className="mb-3 p-2 text-black"
            type="text"
            name="firstName"
            required
          />
          <label>Last Name</label>
          <input
            className="mb-3 p-2 text-black"
            type="text"
            name="lastName"
            required
          />

          <button
            className={`mt-5 rounded-md bg-sti-yellow p-3 text-lg text-black`}
            type="submit"
          >
            Submit
          </button>
          <div
            ref={formRef}
            className="pt-4 text-lg text-center text-sti-yellow"
          >
            {formMessage}
          </div>
        </form>
      </div>
    </div>
  );
}
