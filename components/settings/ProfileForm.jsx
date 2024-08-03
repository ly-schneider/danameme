"use client";

import { useContext, useEffect, useState } from "react";
import Spinner from "../utils/Spinner";
import { SettingsContext } from "./SettingsHandler";
import ProfileImageUploader from "../ProfileImageUploader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import BackendUrl from "../utils/BackendUrl";

export default function ProfileForm() {
  let { session, originalData, setOriginalData, formData, setFormData } = useContext(SettingsContext);

  const [errors, setErrors] = useState({
    submit: "",
    username: "",
  });
  const [loading, setLoading] = useState(false);
  const [usernameLength, setUsernameLength] = useState(null);
  const [usernameChars, setUsernameChars] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

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
      localErrors.username = "Bitte gib deinen Benutzernamen ein";
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
        const res = await fetch(`${BackendUrl()}/accounts/id/${session.user.id}/profile`, {
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

        setFormData({ ...formData, username: formData.username });
        setOriginalData({ ...originalData, username: formData.username });
      }

      if (croppedImage) {
        const resImg = await fetch(`${BackendUrl()}/accounts/id/${session.user.id}/profile-image`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({ profileImage: croppedImage }),
        });

        if (!resImg.ok) {
          throw new Error();
        }
      }

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
          <span className="mt-1 text-sm text text-error">
            {errors.username}
          </span>
          {formData.username !== originalData.username && (
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
          )}
        </div>
        <ProfileImageUploader formData={formData} croppedImage={croppedImage} setCroppedImage={setCroppedImage} />
        <button className={"btn w-full " + (hasChanges() ? "btn-primary" : "btn-disabled")} type="submit">
          <Spinner className={"fill-text transition-default " + (loading ? "mr-3" : "hidden")} />
          Speichern
        </button>
      </form>
    </div>
  )
}