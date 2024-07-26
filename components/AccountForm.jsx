"use client";

import { saveSession } from "@/lib/Session";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "./utils/Spinner";
import Link from "next/link";
import BackendUrl from "./utils/BackendUrl";

export default function AccountForm({ session }) {
  const router = useRouter();

  const [account, setAccount] = useState(null);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
  });
  const [errors, setErrors] = useState({
    submit: "",
    firstname: "",
    lastname: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAccount();
  }, []);

  async function fetchAccount() {
    try {
      const res = await fetch(`${BackendUrl()}/accounts/id/${session.user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.accessToken}`,
        }
      });

      if (!res.ok) {
        throw new Error()
      }

      const data = await res.json();

      if (data.success === false) {
        throw new Error();
      }

      setAccount(data.data);
      setFormData({
        firstname: data.data.firstname,
        lastname: data.data.lastname,
        email: data.data.email
      });
    } catch (error) {
      setErrors({ submit: "Ein Fehler ist aufgetreten. Bitte versuche es erneut." });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    let newErrors = {};

    if (formData.firstname === "") {
      newErrors.firstname = "Bitte gib deinen Vornamen ein.";
    }

    if (formData.lastname === "") {
      newErrors.lastname = "Bitte gib deinen Nachnamen ein.";
    }

    if (formData.email === "") {
      newErrors.email = "Bitte gib deine E-Mail Adresse ein.";
    }

    if (formData.email !== "") {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Bitte gib eine gültige E-Mail Adresse ein.";
      }
    }

    if (Object.keys(newErrors).length !== 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    setErrors({});

    const body = {
      firstname: formData.firstname,
      lastname: formData.lastname,
      email: formData.email,
    }

    try {
      const res = await fetch(`${BackendUrl()}/accounts`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + session.accessToken,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        const token = res.headers.get("accesstoken").split(" ")[1];

        await saveSession(token);

        window.location.reload();
      } else {
        if (data.type === "email-in-use") {
          setLoading(false);
          setErrors({ email: data.message });
          return;
        }

        throw new Error();
      }
    } catch (error) {
      setErrors({ submit: "Ein Fehler ist aufgetreten. Bitte versuche es erneut." });
      setLoading(false);
    }
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function checkChanges() {
    if (!account) {
      return false;
    }

    if (formData.firstname !== account.firstname || formData.lastname !== account.lastname || formData.email !== account.email) {
      return true;
    }

    return false;
  }

  function reset() {
    setFormData({
      firstname: account.firstname,
      lastname: account.lastname,
      email: account.email
    });
    setErrors({});
  }

  return (
    <div className="flex flex-col max-w-md w-full">
      {errors.submit && (
        <div className="rounded-[15px] bg-error px-4 py-2 text text-sm text-background text-center mb-5">
          {errors.submit}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className={"input-form space-y-4"}
      >
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
        <div className="w-full">
          <button className={"btn w-full group " + (checkChanges() ? "btn-primary" : "btn-disabled")} type="submit">
            <Spinner className={"fill-primary group-hover:fill-background transition-default " + (loading ? "mr-3" : "hidden")} />
            Speichern
          </button>
          <p className={"text mt-3 " + (checkChanges() ? "text-accent cursor-pointer" : "text-muted pointer-events-none cursor-default")} onClick={reset}>
            Zurücksetzten
          </p>
        </div>
      </form>
    </div>
  )
}