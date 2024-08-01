"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Spinner from "./utils/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import BackendUrl from "./utils/BackendUrl";

export default function PostForm({ session }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    image: null,
  });
  const [errors, setErrors] = useState({
    submit: "",
    title: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image")) {
      setErrors({ ...errors, image: "Datei muss ein Bild sein" });
      return;
    }

    if (file.size > 1024 * 1024 * 10) {
      setErrors({ ...errors, image: "Bild darf maximal 10MB gross sein" });
      return;
    }

    setFormData({ ...formData, image: file });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrors({ submit: "", title: "", image: "" });

    let newErrors = {};

    if (formData.title === "") {
      newErrors.title = "Bitte gib einen Titel an";
    }

    if (Object.keys(newErrors).length !== 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      // Turn the File Object into a data:image URL
      const imageUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(formData.image);
      });

      const res = await fetch(`${BackendUrl()}/post`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          title: formData.title,
          image: imageUrl,
        }),
      });

      if (!res.ok || res.status !== 201) {
        throw new Error();
      }

      const data = await res.json();

      if (!data.success) {
        throw new Error();
      }

      setLoading(false);
      router.push("/post/" + data.data._id);
    } catch (error) {
      setErrors({ submit: "Es gab einen Fehler" });
      setLoading(false);
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
                (errors.title ? " border-error" : " border-text")
              }
              type="text"
              autoComplete="off"
              name="title"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <label
              className={"text font-normal " + (formData.title != "" ? "up" : "")}
              htmlFor="title"
            >
              Titel
            </label>
          </div>
          <span className="mt-1 text-sm text text-error">
            {errors.title}
          </span>
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="fileInput"
            className={"w-full btn btn-simple justify-start cursor-pointer hover:bg-primary hover:border-transparent" + (errors.image ? " border-error" : " border-text")}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Bild {formData.image ? "ersetzen" : "hinzufügen"}
            <input
              type="file"
              id="fileInput"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
          <span className="mt-1 text-sm text text-error">
            {errors.image}
          </span>
        </div>
        {formData.image && (
          <div>
            <img
              src={URL.createObjectURL(formData.image)}
              alt="Vorschau"
              className="w-auto max-h-[28rem] rounded-[15px]"
            />
            <button onClick={() => setFormData({ ...formData, image: null })} className="mt-2 cursor-pointer text text-secondary hover:underline">
              Bild entfernen
            </button>
          </div>
        )}
        <button className="btn btn-primary w-full" type="submit">
          <Spinner className={"fill-text transition-default " + (loading ? "mr-3" : "hidden")} />
          Posten
        </button>
      </form>
    </div>
  )
}