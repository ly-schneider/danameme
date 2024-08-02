"use client";

import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BackendUrl from "../utils/BackendUrl";
import { useRouter } from "next/navigation";

export default function CommentDeleteAction({ post, comment, session }) {
  const router = useRouter();

  async function handleDelete() {
    try {
      const res = await fetch(`${BackendUrl()}/posts/id/${post._id}/comment/id/${comment._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          commentId: comment._id
        }),
      });

      if (!res.ok || res.status !== 200) {
        console.error("Fehler beim Löschen");
      }

      router.refresh();
    } catch (error) {
      console.error("Fehler beim Löschen");
    }
  }

  return (
    <DropdownMenuItem onClick={handleDelete} className="flex flex-row items-center gap-2 text">
      <FontAwesomeIcon icon={faTrashCan} />
      <p>Löschen</p>
    </DropdownMenuItem>
  )
}