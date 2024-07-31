"use client";

import { useContext, useState } from "react";
import Spinner from "../utils/Spinner";
import Link from "next/link";
import { SettingsContext } from "./SettingsHandler";
import BackendUrl from "../utils/BackendUrl";
import { mdiAlertOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { saveSession } from "@/lib/Session";

export default function AccountForm() {
  let { session, originalData, setOriginalData, formData, setFormData } = useContext(SettingsContext);

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

  function hasChanges() {
    return (
      formData.email !== originalData.email ||
      formData.firstname !== originalData.firstname ||
      formData.lastname !== originalData.lastname
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrors({
      submit: "",
      email: "",
      firstname: "",
      lastname: "",
    });

    if (!hasChanges()) {
      setLoading(false);
      return;
    }

    const localErrors = {}

    if (formData.email === "") {
      localErrors.email = "Bitte gib deine E-Mail Adresse ein";
    }

    if (formData.firstname === "") {
      localErrors.firstname = "Bitte gib deinen Vornamen ein";
    }

    if (formData.lastname === "") {
      localErrors.lastname = "Bitte gib deinen Nachnamen ein";
    }

    if (formData.email !== originalData.email) {
      try {
        const res = await fetch(`${BackendUrl()}/accounts/email?email=${formData.email}`, {
          method: "GET",
        });

        if (!res.ok || res.status !== 200) {
          throw new Error();
        }

        const data = await res.json();

        if (!data.success) {
          localErrors.email = "Diese E-Mail Adresse ist bereits vergeben";
        }
      } catch (e) {
        localErrors.submit = "Es gab einen Fehler beim überprüfen";
      }
    }

    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BackendUrl()}/accounts/id/${session.user.id}/account`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ email: formData.email, firstname: formData.firstname, lastname: formData.lastname }),
      });

      if (!res.ok) {
        throw new Error();
      }

      if (formData.email !== originalData.email) {
        const token = res.headers.get("accesstoken").split(" ")[1];

        await saveSession(token);
      }

      setFormData({ ...formData, email: formData.email, firstname: formData.firstname, lastname: formData.lastname });
      setOriginalData({ ...originalData, email: formData.email, firstname: formData.firstname, lastname: formData.lastname });
      setLoading(false);
    } catch (e) {
      setErrors({ submit: "Es gab einen Fehler beim aktualisieren" });
    }
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
        <div className="flex flex-col">
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
          <span className="mt-1 text-sm text text-error">
            {errors.email}
          </span>
          {!session?.user.emailVerified && (
            <Link href="/email-verifizieren" className="mt-1 text-sm text text-secondary hover:underline flex flex-row items-center gap-2">
              <Icon path={mdiAlertOutline} size={0.8} />
              E-Mail Adresse verifizieren
            </Link>
          )}
        </div>
        <div className="flex flex-col">
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
          <span className="mt-1 text-sm text text-error">
            {errors.firstname}
          </span>
        </div>
        <div className="flex flex-col">
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
          <span className="mt-1 text-sm text text-error">
            {errors.lastname}
          </span>
        </div>
        <Link href="/passwort-reset" className="text text-secondary hover:underline">
          Passwort ändern
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