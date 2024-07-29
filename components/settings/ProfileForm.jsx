"use client";

import { useContext, useEffect, useState } from "react";
import Spinner from "../utils/Spinner";
import { SettingsContext } from "./SettingsHandler";
import ProfileImage from "../ProfileImage";
import { Skeleton } from "../ui/skeleton";
import ProfileImageUploader from "../ProfileImageUploader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import BackendUrl from "../utils/BackendUrl";

export default function ProfileForm() {
  let { session, originalData, formData, setFormData } = useContext(SettingsContext);

  const [errors, setErrors] = useState({
    submit: "",
    username: "",
  });
  const [loading, setLoading] = useState(false);
  const [usernameLength, setUsernameLength] = useState(null);
  const [usernameChars, setUsernameChars] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function hasChanges() {
    return (
      formData.username !== originalData.username ||
      croppedImage !== null
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErrors({
      submit: "",
      username: "",
    });

    if (!hasChanges()) {
      setLoading(false);
      return;
    }

    const localErrors = {}

    let localUsernameLength = null;
    let localUsernameChars = null;

    if (formData.username === "") {
      localErrors.username = "Benutzername darf nicht leer sein";
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

      if (localUsernameLength === true && localUsernameChars === true && formData.username !== originalData.username) {
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
          localErrors.submit = "Es gab einen Fehler beim überprüfen!";
        }
      }
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
      if (formData.username !== originalData.username) {
        const res = await fetch(`${BackendUrl()}/account/id/${session.user.id}/profile`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({ username: formData.username }),
        });

        if (!res.ok) {
          throw new Error();
        }
      }

      // TODO: Implement profile image upload api

      // if (croppedImage) {
      //   const imageData = new FormData();
      //   imageData.append("profileImage", croppedImage);

      //   const resImg = await fetch(`${BackendUrl()}/account/id/${session.user.id}/profile-image`, {
      //     method: "POST",
      //     headers: {
      //       "Authorization": `Bearer ${session.accessToken}`,
      //     },
      //     body: imageData,
      //   });

      //   if (!resImg.ok) {
      //     throw new Error();
      //   }
      // }

      setLoading(false);
      setErrors({ submit: "" });
    } catch (error) {
      setLoading(false);
      setErrors({ submit: "Es gab ein Fehler beim speichern" });
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
        <div className="flex flex-col mt-1">
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
          <span className="mt-1 ms-0.5 text-sm text text-error">
            {errors.username}
          </span>
          <ul className="flex flex-col gap-2 text text-sm mt-1.5 mb-2">
            <li className={"flex flex-row gap-1.5 items-center " + (usernameLength === null ? "text-muted" : usernameLength === true ? "text-success" : "text-error")}>
              <FontAwesomeIcon icon={usernameLength ? faCheckCircle : faXmarkCircle} />
              Mindestens 3, maximal 15 Zeichen
            </li>
            <li className={"flex flex-row gap-1.5 items-center " + (usernameChars === null ? "text-muted" : usernameChars === true ? "text-success" : "text-error")}>
              <FontAwesomeIcon icon={usernameChars ? faCheckCircle : faXmarkCircle} />
              Nur 'aA', '0-9', '_', '.', '-' erlaubt
            </li>
          </ul>
        </div>
        <ProfileImageUploader profileImage={formData.profileImage} croppedImage={croppedImage} setCroppedImage={setCroppedImage} />
        <button className={"btn w-full " + (hasChanges() ? "btn-primary" : "btn-disabled")} type="submit">
          <Spinner className={"fill-text transition-default " + (loading ? "mr-3" : "hidden")} />
          Speichern
        </button>
      </form>
    </div>
  )
}