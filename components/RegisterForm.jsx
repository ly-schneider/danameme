"use client";

import { saveSession } from "@/lib/Session";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Spinner from "./utils/Spinner";
import Link from "next/link";
import BackendUrl from "./utils/BackendUrl";
import { toast } from "sonner";

export default function RegisterForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    passwordRepeat: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);
  const [errors, setErrors] = useState({
    submit: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    passwordRepeat: "",
  });
  const [loading, setLoading] = useState(false);

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
    } else {
      try {
        const res = await fetch(
          `${BackendUrl()}/accounts/email?email=${formData.email}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        ).then((res) => res.json());

        if (res.status == false) {
          newErrors.email = "Diese E-Mail Adresse wird bereits verwendet.";
        }
      } catch (error) {
        newErrors.email = "Ein Fehler ist bei der Überprüfung aufgetreten.";
      }
    }

    if (formData.email !== "") {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Bitte gib eine gültige E-Mail Adresse ein.";
      }
    }

    if (formData.password === "") {
      newErrors.password = "Bitte gib dein Passwort ein.";
    }

    if (formData.passwordRepeat === "") {
      newErrors.passwordRepeat = "Bitte bestätige dein Passwort.";
    }

    if (formData.password !== formData.passwordRepeat) {
      newErrors.passwordRepeat = "Die Passwörter stimmen nicht überein.";
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
      password: formData.password,
    }

    try {
      const res = await fetch(`${BackendUrl()}/accounts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error();
      }

      if (data.waitlistMessage !== "") {
        const messageData = data.waitlistMessage.split("\n");

        if (messageData.length == 1) {
          toast(<p className="text text-sm">{messageData[0]}</p>, {
            duration: Infinity,
          })
        } else {
          toast(<div className="flex flex-col gap-2"><p className="text text-sm">{messageData[0]}</p><p className="text text-xs">{messageData[1]}</p></div>, {
            duration: Infinity,
          })
        }
      }

      if (data.success) {
        const token = res.headers.get("accesstoken").split(" ")[1];

        const stripeRes = await fetch(`${BackendUrl()}/stripe/create-customer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });

        if (!stripeRes.ok) {
          throw new Error();
        }

        await saveSession(token);

        router.push("/");
      } else {
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

  return (
    <div className="flex flex-col w-full mt-5">
      {errors.submit && (
        <div className="rounded-[15px] bg-error px-4 py-2 text text-sm text-background text-center mb-5">
          {errors.submit}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className={"input-form space-y-4"}
      >
        <div className="flex flex-col xs:flex-row justify-between gap-3 gap-y-4">
          <div className="flex flex-col w-full xs:w-1/2">
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
                className={
                  "text font-normal " + (formData.firstname != "" ? "up" : "")
                }
                htmlFor="firstname"
              >
                Vorname
              </label>
            </div>
            <span className="mt-1 ms-0.5 text-sm text text-error">
              {errors.firstname}
            </span>
          </div>
          <div className="flex flex-col w-full xs:w-1/2">
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
                className={
                  "text font-normal " + (formData.lastname != "" ? "up" : "")
                }
                htmlFor="lastname"
              >
                Nachname
              </label>
            </div>
            <span className="mt-1 ms-0.5 text-sm text text-error">
              {errors.lastname}
            </span>
          </div>
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
          <p className="text text-sm mt-1 ms-0.5">
            Nutze die gleiche E-Mail Adresse wie bei der Warteliste für die Vorteile!
          </p>
        </div>
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
              className="cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
              icon={showPassword ? faEyeSlash : faEye}
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
          <span className="mt-1 ms-0.5 text-sm text text-error">
            {errors.password}
          </span>
        </div>
        <div className="flex flex-col relative">
          <div className="flex flex-col form-item relative">
            <input
              className={
                "bg-background" +
                (errors.passwordRepeat ? " border-error" : " border-text")
              }
              type={showPasswordRepeat ? "text" : "password"}
              name="passwordRepeat"
              autoComplete="new-password"
              id="passwordRepeat"
              value={formData.passwordRepeat}
              onChange={handleChange}
            />
            <label
              className={
                "text font-normal " + (formData.passwordRepeat !== "" ? "up" : "")
              }
              htmlFor="passwordRepeat"
            >
              Passwort bestätigen
            </label>
            <FontAwesomeIcon
              className="cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
              icon={showPasswordRepeat ? faEyeSlash : faEye}
              onClick={() => setShowPasswordRepeat(!showPasswordRepeat)}
            />
          </div>
          <span className="mt-1 ms-0.5 text-sm text text-error">
            {errors.passwordRepeat}
          </span>
        </div>
        <div className="w-full">
          <button className="btn btn-primary w-full group" type="submit">
            <Spinner className={"fill-primary group-hover:fill-background transition-default " + (loading ? "mr-3" : "hidden")} />
            Registrieren
          </button>
          <p className="text mt-3">
            Du hast bereits einen Account?{" "}
            <Link className="text-accent" href="/login">
              Melde dich an
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}