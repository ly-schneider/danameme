"use client";

import { saveSession } from "@/lib/Session";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Spinner from "./utils/Spinner";
import Link from "next/link";
import BackendUrl from "./utils/BackendUrl";

export default function LoginForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    submit: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if (formData.email === "") {
      setErrors({ email: "Bitte gib deine E-Mail Adresse ein" });
      setLoading(false);
      return;
    }

    if (step === 1) {
      await handleCheckEmail();
    } else {
      await handleLogin();
    }
  }

  async function handleCheckEmail() {
    setErrors({});

    try {
      const res = await fetch(`${BackendUrl()}/auth/email?email=${formData.email}`, {
        method: "GET",
      });

      if (!res.ok) {
        setLoading(false);

        if (res.status === 404) {
          setErrors({ email: "E-Mail Adresse ist nicht registriert" });
          return;
        }

        throw new Error();
      }

      const data = await res.json();

      if (data.success) {
        if (data.type === "migrate") {
          router.push("/passwort-vergessen?migrate=true&email=" + formData.email);
          return;
        }

        setStep(2);
        setLoading(false);
      } else {
        throw new Error();
      }
    } catch (error) {
      setErrors({ submit: "Es gab einen Fehler" });
      setLoading(false);
    }
  }

  async function handleLogin() {
    setLoading(true);

    let newErrors = {};

    if (formData.email === "") {
      newErrors.email = "Bitte gib deine E-Mail Adresse ein";
    }

    if (formData.password === "") {
      newErrors.password = "Bitte gib dein Passwort ein";
    }

    if (Object.keys(newErrors).length !== 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    setErrors({});

    const body = {
      email: formData.email,
      password: formData.password,
    }

    try {
      const res = await fetch(`${BackendUrl()}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        const token = res.headers.get("accesstoken").split(" ")[1];

        await saveSession(token);

        router.push("/");
      } else {
        setLoading(false);
        if (data.type == "wrong-credentials") {
          setErrors({ submit: data.message });
        } else {
          throw new Error();
        }
      }
    } catch (error) {
      setErrors({ submit: "Es gab einen Fehler" });
      setLoading(false);
    }
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        </div>
        {step === 2 && (
          <div className="flex flex-col relative">
            <div className="flex flex-col form-item relative">
              <input
                className={
                  "bg-background " +
                  (errors.password ? "border-error" : "border-text")
                }
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                id="password"
                value={formData.password}
                onChange={handleChange}
              />
              <label
                className={
                  "text font-normal " + (formData.password !== "" ? "up" : "")
                }
                htmlFor="password"
              >
                Passwort
              </label>
              <FontAwesomeIcon
                className="text-text cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
                icon={showPassword ? faEyeSlash : faEye}
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            <span className="mt-1 text-sm text text-error">
              {errors.password}
            </span>
          </div>
        )}
        <button className="btn btn-primary w-full" type="submit">
          <Spinner className={"fill-text transition-default " + (loading ? "mr-3" : "hidden")} />
          {step === 1 ? "Weiter" : "Anmelden"}
        </button>
        <div className="flex flex-row justify-between">
          <Link href="/registrieren" className="text text-secondary hover:underline">
            Registrieren
          </Link>
          <Link href="/passwort-vergessen" className="text text-secondary hover:underline">
            Passwort vergessen
          </Link>
        </div>
      </form>
    </div>
  )
}