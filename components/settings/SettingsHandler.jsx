"use client";

import { createContext, useEffect, useState } from "react";
import AccountForm from "./AccountForm";
import BackendUrl from "../utils/BackendUrl";
import ProfileForm from "./ProfileForm";
import { useSearchParams } from "next/navigation";

export const SettingsContext = createContext();

export default function SettingsHandler({ session }) {
  const searchParams = useSearchParams();

  const [currentPage, setCurrentPage] = useState(1);

  const [originalData, setOriginalData] = useState({
    email: "",
    firstname: "",
    lastname: "",
    username: "",
    profileImage: null,
  });
  const [formData, setFormData] = useState({
    email: "",
    firstname: "",
    lastname: "",
    username: "",
    profileImage: null,
  });

  useEffect(() => {
    fetchAccount();
  }, []);

  useEffect(() => {
    if (searchParams.has("page")) {
      const page = parseInt(searchParams.get("page"));
      if (page === 1 || page === 2) {
        setCurrentPage(page);
      }
    }
  }, [searchParams]);

  async function fetchAccount() {
    try {
      const res = await fetch(`${BackendUrl()}/accounts/id/${session.user.id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${session.accessToken}`,
        }
      });

      if (!res.ok || res.status !== 200) {
        throw new Error()
      }

      const data = await res.json();

      if (data.success === false) {
        throw new Error();
      }

      const body = {
        email: data.data.email,
        firstname: data.data.firstname,
        lastname: data.data.lastname,
        username: data.data.username,
        profileImage: data.data.profileImage,
      }

      setOriginalData({
        ...body
      });
      setFormData({
        ...body
      });
    } catch (error) {
      console.error("An error occurred while fetching the account data.");
    }
  }

  return (
    <div className="mt-6">
      <div className="flex flex-row items-center gap-0 border-b-2 border-muted">
        <button className={"text translate-y-[2px] pb-3 px-4 border-b-2 transition-default hover:border-primary " + (currentPage == 1 ? "border-primary" : "border-transparent")} onClick={() => setCurrentPage(1)}>
          Account
        </button>
        <button className={"text translate-y-[2px] pb-3 px-4 border-b-2 transition-default hover:border-primary " + (currentPage == 2 ? "border-primary" : "border-transparent")} onClick={() => setCurrentPage(2)}>
          Profil
        </button>
      </div>
      <SettingsContext.Provider value={{ session, originalData, setOriginalData, currentPage, setCurrentPage, formData, setFormData }}>
        {currentPage === 1 && <AccountForm />}
        {currentPage === 2 && <ProfileForm />}
      </SettingsContext.Provider>
    </div>
  );
}