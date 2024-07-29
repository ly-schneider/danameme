import { useContext, useEffect, useState } from "react";
import { RegisterContext } from "./RegisterHandler";
import Spinner from "../utils/Spinner";
import Link from "next/link";
import BackendUrl from "../utils/BackendUrl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faEye, faEyeSlash, faXmarkCircle } from "@fortawesome/free-regular-svg-icons";

export default function PasswordPage() {
  let { formData, setFormData, setCurrentPage } = useContext(RegisterContext);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    submit: "",
    password: "",
    passwordLength: null,
    passwordUpperLowerCase: null,
    passwordNumber: null,
    passwordSpecial: null,
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [passwordLength, setPasswordLength] = useState(null);
  const [passwordUpperLowerCase, setPasswordUpperLowerCase] = useState(null);
  const [passwordNumber, setPasswordNumber] = useState(null);
  const [passwordSpecial, setPasswordSpecial] = useState(null);

  useEffect(() => {
    setErrors((prev) => ({ ...prev, password: "" }));

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

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrors({
      submit: "",
      firstname: "",
      lastname: "",
      username: "",
      usernameLength: null,
      usernameChars: null,
      terms: "",
    });

    const localErrors = {};

    let localPasswordLength = null;
    let localPasswordUpperLowerCase = null;
    let localPasswordNumber = null;
    let localPasswordSpecial = null;

    if (formData.password === "") {
      localErrors.password = "Bitte geben Sie Ihr Passwort ein.";
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

    if (confirmPassword === "") {
      localErrors.confirmPassword = "Bitte bestätigen Sie Ihr Passwort.";
    }

    if (formData.password !== confirmPassword) {
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

    setCurrentPage(3);
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
              Passwort
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <label
              className={"text font-normal " + (confirmPassword != "" ? "up" : "")}
              htmlFor="confirmPassword"
            >
              Passwort bestätigen
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
  );
}