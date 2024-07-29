"use client";

import { useContext, useState } from "react";
import Spinner from "../utils/Spinner";
import Link from "next/link";
import { SettingsContext } from "./SettingsHandler";

export default function AccountForm() {
  let { originalData, formData, setFormData } = useContext(SettingsContext);

  const [errors, setErrors] = useState({
    submit: "",
    email: "",
    firstname: "",
    lastname: "",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    console.log(formData)
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function hasChanges() {
    return (
      formData.email !== originalData.email ||
      formData.firstname !== originalData.firstname ||
      formData.lastname !== originalData.lastname
    );
  }

  return (
    <div className="flex flex-col w-full mt-5">
      {errors.submit && (
        <div className="rounded-[10px] bg-error px-4 py-2 text text-sm text-center mb-4">
          {errors.submit}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className={"flex flex-col gap-4"}
      >
        <div className="flex flex-col mt-1">
          <div className="flex flex-col form-item">
            <input
              className={
                "border-2 bg-background focus:outline-none focus:border-primary " +
                (errors.email ? " border-error" : " border-text")
              }
              type="email"
              autoComplete="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
            />
            <label
              className={"text font-normal " + (formData.email != "" ? "up" : "")}
              htmlFor="email"
            >
              E-Mail Adresse
            </label>
          </div>
          <span className="mt-1 ms-0.5 text-sm text text-error">
            {errors.email}
          </span>
        </div>
        <div className="flex flex-col mt-1">
          <div className="flex flex-col form-item">
            <input
              className={
                "border-2 bg-background focus:outline-none focus:border-primary " +
                (errors.firstname ? " border-error" : " border-text")
              }
              type="text"
              autoComplete="given-name"
              name="firstname"
              id="firstname"
              value={formData.firstname}
              onChange={handleChange}
            />
            <label
              className={"text font-normal " + (formData.firstname != "" ? "up" : "")}
              htmlFor="firstname"
            >
              Vorname
            </label>
          </div>
          <span className="mt-1 ms-0.5 text-sm text text-error">
            {errors.firstname}
          </span>
        </div>
        <div className="flex flex-col mt-1">
          <div className="flex flex-col form-item">
            <input
              className={
                "border-2 bg-background focus:outline-none focus:border-primary " +
                (errors.lastname ? " border-error" : " border-text")
              }
              type="text"
              autoComplete="family-name"
              name="lastname"
              id="lastname"
              value={formData.lastname}
              onChange={handleChange}
            />
            <label
              className={"text font-normal " + (formData.lastname != "" ? "up" : "")}
              htmlFor="lastname"
            >
              Nachname
            </label>
          </div>
          <span className="mt-1 ms-0.5 text-sm text text-error">
            {errors.lastname}
          </span>
        </div>
        <Link href="/passwort-reset" className="text text-secondary hover:underline">
          Passwort zurücksetzen
        </Link>
        <button className={"btn w-full " + (hasChanges() ? "btn-primary" : "btn-disabled")} type="submit">
          <Spinner className={"fill-text transition-default " + (loading ? "mr-3" : "hidden")} />
          Speichern
        </button>
        <button className="text text-error hover:underline text-start">
          Account löschen
        </button>
      </form>
    </div>
  )
}