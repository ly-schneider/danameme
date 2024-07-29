"use client";

import { createContext, useState } from "react";
import EmailPage from "./EmailPage";
import PasswordPage from "./PasswordPage";
import NamesPage from "./NamesPage";

export const RegisterContext = createContext();

export default function RegisterHandler() {
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    username: "",
  });

  return (
    <div className="mt-6">
      <div className="flex flex-row gap-2 justify-between mb-5">
        <hr
          className={
            "w-full border-2 rounded-lg transition-default " +
            (currentPage >= 1 ? "border-primary" : "border-muted")
          }
        />
        <hr
          className={
            "w-full border-2 rounded-lg transition-default " +
            (currentPage >= 2 ? "border-primary" : "border-muted")
          }
        />
        <hr
          className={
            "w-full border-2 rounded-lg transition-default " +
            (currentPage >= 3 ? "border-primary" : "border-muted")
          }
        />
      </div>
      <RegisterContext.Provider value={{ currentPage, setCurrentPage, formData, setFormData }}>
        {currentPage === 1 && <EmailPage />}
        {currentPage === 2 && <PasswordPage />}
        {currentPage === 3 && <NamesPage />}
      </RegisterContext.Provider>
    </div>
  );
}