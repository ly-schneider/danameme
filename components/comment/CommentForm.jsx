"use client";

import { useEffect, useRef, useState } from "react";
import BackendUrl from "../utils/BackendUrl";
import { useRouter } from "next/navigation";
import Spinner from "../utils/Spinner";

export default function CommentForm({ post, session, comment = null, setIsEditing = null }) {
  const router = useRouter();

  const [content, setContent] = useState(comment ? comment.content : "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 6}px`;
    }
  }, [content]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!content) {
      setError("Kommentar muss vorhanden sein");
      return;
    }

    try {
      const res = await fetch(`${BackendUrl()}/posts/id/${post._id}/comment${comment ? "/id/" + comment._id : ""}`, {
        method: comment ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          content,
          commentId: comment ? comment._id : null
        }),
      });

      if (!res.ok) {
        setError("Es gab einen Fehler beim speichern des Kommentars");
        return;
      }

      setContent("");
      setLoading(false);
      router.refresh();

      if (setIsEditing) {
        setIsEditing(false);
      }
    } catch (error) {
      setLoading(false);
      setError("Es gab einen Fehler beim speichern des Kommentars");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <textarea
        className={
          "border-2 bg-background focus:outline-none focus:border-primary rounded-[10px] p-[10px_16px] placeholder:text placeholder:text-mutedLight min-h-12 text overflow-hidden resize-y" +
          (error ? " border-error" : " border-muted")
        }
        type="text"
        name="content"
        id="content"
        rows={1}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Schreibe einen Kommentar"
        ref={textareaRef}
      />
      <span className="text-sm text text-error">
        {error}
      </span>
      <div className="flex justify-end gap-2 items-center">
        {comment && (
          <button
            className="btn text-sm px-5 hover:text-mutedLight"
            type="button"
            onClick={() => setIsEditing(false)}
          >
            Abbrechen
          </button>
        )}
        <button className={"btn text-sm px-5 " + (content ? "btn-primary" : "btn-disabled")} type="submit">
          <Spinner className={"fill-text transition-default " + (loading ? "mr-3" : "hidden")} />
          {comment ? "Aktualisieren" : "Kommentieren"}
        </button>
      </div>
    </form>
  );
}