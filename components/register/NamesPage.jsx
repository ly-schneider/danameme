import { useContext, useEffect, useState } from "react";
import { RegisterContext } from "./RegisterHandler";
import Spinner from "../utils/Spinner";
import BackendUrl from "../utils/BackendUrl";
import { useRouter } from "next/navigation";
import { saveSession } from "@/lib/Session";
import { faCheckCircle, faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";

export default function NamesPage() {
  const router = useRouter();

  let { formData, setFormData, setCurrentPage } = useContext(RegisterContext);

  const [errors, setErrors] = useState({
    submit: "",
    firstname: "",
    lastname: "",
    username: "",
    usernameLength: null,
    usernameChars: null,
    terms: "",
  });
  const [loading, setLoading] = useState(false);
  const [usernameLength, setUsernameLength] = useState(null);
  const [usernameChars, setUsernameChars] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    setErrors((prev) => ({ ...prev, username: "" }));

    if (formData.username === "") {
      setUsernameLength(null);
      setUsernameChars(null);
      return;
    }

    if (formData.username.length >= 3 && formData.username.length <= 15) {
      setUsernameLength(true);
    } else if (usernameLength == true && (formData.username.length < 3 || formData.username.length > 15)) {
      setUsernameLength(false);
    }

    if (/^[a-zA-Z0-9_.-]+$/.test(formData.username)) {
      setUsernameChars(true);
    } else if (usernameChars == true && !/^[a-zA-Z0-9_.-]+$/.test(formData.username)) {
      setUsernameChars(false);
    }
  }, [formData.username]);

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
      terms: "",
    });

    const localErrors = {}

    let localUsernameLength = null;
    let localUsernameChars = null;

    if (formData.firstname === "") {
      localErrors.firstname = "Bitte gib deinen Vornamen ein";
    }

    if (formData.lastname === "") {
      localErrors.lastname = "Bitte gib deinen Nachnamen ein";
    }

    if (formData.username === "") {
      localErrors.username = "Bitte gib deinen Benutzername ein";
    } else {
      if (formData.username.length < 3 || formData.username.length > 15) {
        localUsernameLength = false;
      } else {
        localUsernameLength = true;
      }

      if (!/^[a-zA-Z0-9_.-]+$/.test(formData.username)) {
        localUsernameChars = false;
      } else {
        localUsernameChars = true;
      }

      if (localUsernameLength === true && localUsernameChars === true) {
        try {
          const res = await fetch(`${BackendUrl()}/accounts/username?username=${formData.username}`, {
            method: "GET",
          });

          if (!res.ok || res.status !== 200) {
            throw new Error();
          }

          const data = await res.json();

          if (data.success == false) {
            localErrors.username = "Dieser Benutzername ist bereits vergeben";
          }
        } catch (e) {
          localErrors.submit = "Es gab einen Fehler beim überprüfen";
        }
      }
    }

    if (!termsAccepted) {
      localErrors.terms = "Bitte akzeptiere die Datenschutzerklärung";
    }

    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      setLoading(false);
      return;
    }

    if (localUsernameLength === false || localUsernameChars === false) {
      setLoading(false);
      setUsernameLength(localUsernameLength);
      setUsernameChars(localUsernameChars);
      return;
    }

    try {
      const res = await fetch(`${BackendUrl()}/accounts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstname: formData.firstname,
          lastname: formData.lastname,
          username: formData.username,
          terms: termsAccepted,
        }),
      });

      if (!res.ok || res.status !== 201) {
        throw new Error();
      }

      const token = res.headers.get("accesstoken").split(" ")[1];

      await saveSession(token);

      router.push("/email-verifizieren");
    } catch (e) {
      setLoading(false);
      setErrors({ submit: "Es gab einen Fehler beim registrieren!" });
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
          <span className="mt-1.5 text-sm text text-error">
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
          <span className="mt-1.5 text-sm text text-error">
            {errors.lastname}
          </span>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col form-item">
            <input
              className={
                "border-2 bg-background focus:outline-none focus:border-primary " +
                (errors.username ? " border-error" : " border-text")
              }
              type="text"
              autoComplete="username"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
            />
            <label
              className={"text font-normal " + (formData.username != "" ? "up" : "")}
              htmlFor="username"
            >
              Benutzername
            </label>
          </div>
          <span className="mt-1.5 text-sm text text-error">
            {errors.username}
          </span>
          <ul className="flex flex-col gap-2 text text-sm mt-1.5 mb-2">
            <li className={"flex flex-row gap-1.5 items-center " + (usernameLength === null ? "text-muted" : usernameLength === true ? "text-success" : "text-error")}>
              <FontAwesomeIcon icon={usernameLength ? faCheckCircle : faXmarkCircle} />
              Mindestens 3, maximal 15 Zeichen
            </li>
            <li className={"flex flex-row gap-1.5 items-center " + (usernameChars === null ? "text-muted" : usernameChars === true ? "text-success" : "text-error")}>
              <FontAwesomeIcon icon={usernameChars ? faCheckCircle : faXmarkCircle} />
              Nur &apos;aA&apos;, &apos;0-9&apos;, &apos;_&apos;, &apos;.&apos;, &apos;-&apos; erlaubt
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2 items-center">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={setTermsAccepted}
            />
            <label htmlFor="terms" className="text text-sm cursor-pointer">
              Ich akzeptiere die{" "}
              <Link href={"/datenschutz"} className="underline" target="_blank">
                Datenschutzerklärung
              </Link>
            </label>
          </div>
          {errors.terms && (
            <span className="text-sm text text-error">
              {errors.terms}
            </span>
          )}
        </div>
        <div className="w-full">
          <button className="btn btn-primary w-full" type="submit">
            <Spinner className={"fill-text " + (loading ? "mr-3" : "hidden")} />
            Registrieren
          </button>
        </div>
      </form>
    </div>
  );
}