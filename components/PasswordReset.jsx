"use client";

import { useEffect, useState } from "react";
import Spinner from "./utils/Spinner";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import BackendUrl from "./utils/BackendUrl";
import { faCheckCircle, faEye, faEyeSlash, faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function PasswordReset({ session }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    submit: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validToken, setValidToken] = useState(session ? true : null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLength, setPasswordLength] = useState(null);
  const [passwordUpperLowerCase, setPasswordUpperLowerCase] = useState(null);
  const [passwordNumber, setPasswordNumber] = useState(null);
  const [passwordSpecial, setPasswordSpecial] = useState(null);

  useEffect(() => {
    if (session && searchParams.has("token")) {
      router.replace(pathname);
    }
    if (searchParams.has("token")) {
      verifyToken(searchParams.get("token"));
    }
  }, []);

  useEffect(() => {
    setErrors((prev) => ({ ...prev, password: "", confirmPassword: "" }));

    if (formData.password === "") {
      setPasswordLength(null);
      setPasswordUpperLowerCase(null);
      setPasswordNumber(null);
      setPasswordSpecial(null);
      return;
    }

    if (formData.password.length >= 8) {
      setPasswordLength(true);
    } else if (errors.passwordLength == true && formData.password.length < 8) {
      setPasswordLength(false);
    }

    if (/[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password)) {
      setPasswordUpperLowerCase(true);
    } else if (errors.passwordUpperLowerCase == true && (!/[a-z]/.test(formData.password) || !/[A-Z]/.test(formData.password))) {
      setPasswordUpperLowerCase(false);
    }

    if (/[0-9]/.test(formData.password)) {
      setPasswordNumber(true);
    } else if (errors.passwordNumber == true && !/[0-9]/.test(formData.password)) {
      setPasswordNumber(false);
    }

    if (/[^\da-zA-Z]/.test(formData.password)) {
      setPasswordSpecial(true);
    } else if (errors.passwordSpecial == true && !/[^\da-zA-Z]/.test(formData.password)) {
      setPasswordSpecial(false);
    }
  }, [formData.password]);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function verifyToken(token) {
    try {
      const res = await fetch(`${BackendUrl()}/accounts/password-reset?guid=${token}`, {
        method: "GET",
      });

      console.log(res)

      const data = await res.json();

      if (!res.ok || res.status !== 200) {
        if (data.type === "bad-token") {
          setValidToken({
            success: false,
            message: "Ungültiger Token",
          })
        } else if (data.type === "expired-token") {
          setValidToken({
            success: false,
            message: "Der Token ist abgelaufen",
          })
        } else {
          setValidToken({
            success: false,
            message: "Es gab einen Fehler beim überprüfen",
          })
        }

        return;
      }

      setValidToken(true);
    } catch (error) {
      console.error("An error occurred while fetching the data.");
      setValidToken({
        success: false,
        message: "Es gab einen Fehler beim überprüfen",
      })
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrors({
      submit: "",
      password: "",
      confirmPassword: "",
    });

    const localErrors = {};

    let localPasswordLength = null;
    let localPasswordUpperLowerCase = null;
    let localPasswordNumber = null;
    let localPasswordSpecial = null;

    if (formData.password === "") {
      localErrors.password = "Bitte gib dein neues Passwort ein.";
    } else {
      if (formData.password.length < 8) {
        localPasswordLength = false
      } else {
        localPasswordLength = true;
      }

      if (!/[a-z]/.test(formData.password) || !/[A-Z]/.test(formData.password)) {
        localPasswordUpperLowerCase = false;
      } else {
        localPasswordUpperLowerCase = true;
      }

      if (!/[0-9]/.test(formData.password)) {
        localPasswordNumber = false;
      } else {
        localPasswordNumber = true;
      }

      if (!/[^\da-zA-Z]/.test(formData.password)) {
        localPasswordSpecial = false;
      } else {
        localPasswordSpecial = true;
      }
    }

    if (formData.confirmPassword === "") {
      localErrors.confirmPassword = "Bitte bestätigen dein neues Passwort.";
    }

    if (formData.password !== formData.confirmPassword) {
      localErrors.confirmPassword = "Die Passwörter stimmen nicht überein.";
    }

    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      setLoading(false);
      return;
    }

    if (localPasswordLength === false || localPasswordUpperLowerCase === false || localPasswordNumber === false || localPasswordSpecial === false) {
      setLoading(false);
      setPasswordLength(localPasswordLength);
      setPasswordUpperLowerCase(localPasswordUpperLowerCase);
      setPasswordNumber(localPasswordNumber);
      setPasswordSpecial(localPasswordSpecial);
      return;
    }

    try {
      let res = null;
      if (session) {
        res = await fetch(`${BackendUrl()}/accounts/password-reset`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({
            password: formData.password,
          }),
        });
      } else {
        res = await fetch(`${BackendUrl()}/accounts/password-reset`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: formData.password,
            guid: searchParams.get("token"),
          }),
        });
      }

      console.log(res)

      const data = await res.json();

      if (!res.ok || res.status !== 200) {
        if (data.type === "bad-token") {
          setValidToken({
            success: false,
            message: "Ungültiger Token",
          })
        } else if (data.type === "expired-token") {
          setValidToken({
            success: false,
            message: "Der Token ist abgelaufen",
          })
        } else {
          throw new Error();
        }

        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch (error) {
      console.error("An error occurred");
      setErrors({
        submit: "Es gab einen Fehler beim zurücksetzen deines Passworts.",
        password: "",
        confirmPassword: "",
      });
    }
  }

  if (validToken === null) {
    return (
      <div className="flex flex-col items-center w-full mt-8">
        <Spinner className="fill-text w-10 h-10" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex flex-col w-full mt-5">
        <p className="text mb-4">
          Dein Passwort wurde erfolgreich {session ? "geändert" : "zurückgesetzt"}!
        </p>
        {session ? (
          <Link href="/einstellungen" className="btn btn-primary w-full">
            Zurück zu den Einstellungen
          </Link>
        ) : (
          <Link href="/anmelden" className="btn btn-primary w-full">
            Zurück zur Anmeldung
          </Link>
        )}
      </div>
    );
  }

  if (validToken !== true) {
    return (
      <div className="flex flex-col w-full mt-5">
        <p className="text text-error text-center mb-8"><FontAwesomeIcon icon={faXmarkCircle} className="me-1.5" />{validToken.message}</p>
        <Link href="/passwort-vergessen" className="btn btn-primary w-full">
          Zurück
        </Link>
      </div>
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
        <div className="flex flex-col">
          <div className="flex flex-col form-item relative">
            <input
              className={
                "border-2 bg-background focus:outline-none focus:border-primary " +
                (errors.password ? " border-error" : " border-text")
              }
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
            />
            <label
              className={"text font-normal " + (formData.password != "" ? "up" : "")}
              htmlFor="password"
            >
              Neues Passwort
            </label>
            <FontAwesomeIcon
              className="text cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
              icon={showPassword ? faEyeSlash : faEye}
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
          <span className="mt-1.5 text-sm text text-error">
            {errors.password}
          </span>
          <ul className="flex flex-col gap-2 text text-sm mt-1.5 mb-2">
            <li className={"flex flex-row gap-1.5 items-center " + (passwordLength === null ? "text-muted" : passwordLength === true ? "text-success" : "text-error")}>
              <FontAwesomeIcon icon={passwordLength ? faCheckCircle : faXmarkCircle} />
              Mindestens 8 Zeichen lang
            </li>
            <li className={"flex flex-row gap-1.5 items-center " + (passwordUpperLowerCase === null ? "text-muted" : passwordUpperLowerCase === true ? "text-success" : "text-error")}>
              <FontAwesomeIcon icon={passwordUpperLowerCase ? faCheckCircle : faXmarkCircle} />
              Gross- und Kleinbuchstaben
            </li>
            <li className={"flex flex-row gap-1.5 items-center " + (passwordNumber === null ? "text-muted" : passwordNumber === true ? "text-success" : "text-error")}>
              <FontAwesomeIcon icon={passwordNumber ? faCheckCircle : faXmarkCircle} />
              Mindestens eine Zahl
            </li>
            <li className={"flex flex-row gap-1.5 items-center " + (passwordSpecial === null ? "text-muted" : passwordSpecial === true ? "text-success" : "text-error")}>
              <FontAwesomeIcon icon={passwordSpecial ? faCheckCircle : faXmarkCircle} />
              Mindestens ein Sonderzeichen
            </li>
          </ul>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col form-item relative">
            <input
              className={
                "border-2 bg-background focus:outline-none focus:border-primary " +
                (errors.confirmPassword ? " border-error" : " border-text")
              }
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              name="confirmPassword"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <label
              className={"text font-normal " + (formData.confirmPassword != "" ? "up" : "")}
              htmlFor="confirmPassword"
            >
              Neues Passwort bestätigen
            </label>
            <FontAwesomeIcon
              className="text cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
              icon={showConfirmPassword ? faEyeSlash : faEye}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </div>
          <span className="mt-1.5 text-sm text text-error">
            {errors.confirmPassword}
          </span>
        </div>
        <div className="w-full">
          <button className="btn btn-primary w-full" type="submit">
            <Spinner className={"fill-text " + (loading ? "mr-3" : "hidden")} />
            Weiter
          </button>
        </div>
      </form>
    </div>
  )
}