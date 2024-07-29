import { useContext, useState } from "react";
import { RegisterContext } from "./RegisterHandler";
import Spinner from "../utils/Spinner";
import Link from "next/link";
import BackendUrl from "../utils/BackendUrl";

export default function EmailPage() {
  let { formData, setFormData, setCurrentPage } = useContext(RegisterContext);

  const [errors, setErrors] = useState({
    submit: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    setErrors({ submit: "", email: "" });

    if (formData.email === "") {
      setErrors({ email: "Bitte geben Sie Ihre E-Mail Adresse ein." });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BackendUrl()}/accounts/email?email=${formData.email}`, {
        method: "GET",
      });

      if (!res.ok || res.status !== 200) {
        throw new Error();
      }

      const data = await res.json();

      if (data.success) {
        setCurrentPage(2);
      } else {
        setErrors({ email: "Diese E-Mail Adresse ist bereits vergeben." });
        setLoading(false);
      }
    } catch (e) {
      setErrors({ submit: "Es gab einen Fehler beim überprüfen!" });
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
  );
}