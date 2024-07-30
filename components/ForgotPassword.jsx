"use client";

import { useState } from "react";
import Spinner from "./utils/Spinner";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({
    submit: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setErrors({ submit: "" });

    if (email === "") {
      setErrors({ submit: "Bitte fülle alle Felder aus" });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/accounts/password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || res.status !== 200) {
        if (data.type === "no-account") {
          setErrors({ email: "E-Mail Adresse ist nicht registriert" });
        } else {
          setErrors({ submit: "Es ist ein Fehler aufgetreten" });
        }
        return;
      }

      setSuccess(true);
    } catch (error) {
      setErrors({ submit: "Es ist ein Fehler aufgetreten" });
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col w-full mt-5">
        <p className="text mb-4">
          Wir haben dir eine E-Mail mit einem Link zum zurücksetzen deines
          Passworts gesendet
        </p>
        <Link href="/anmelden" className="btn btn-primary w-full">
          Zurück zur Anmeldung
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full mt-5">
      <p className="text mb-4">Gib die E-Mail Adresse von deinem Account an</p>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label
              className={"text font-normal " + (email != "" ? "up" : "")}
              htmlFor="email"
            >
              E-Mail Adresse
            </label>
          </div>
          <span className="mt-1.5 text-sm text text-error">
            {errors.email}
          </span>
        </div>
        <button className="btn btn-primary w-full" type="submit">
          <Spinner className={"fill-text " + (loading ? "mr-3" : "hidden")} />
          Weiter
        </button>
        <Link href="/anmelden" className="text text-secondary hover:underline">
          Anmelden
        </Link>
      </form>
    </div>
  )
}