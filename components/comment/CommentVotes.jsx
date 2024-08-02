"use client";

import { mdiArrowDownBold, mdiArrowDownBoldOutline, mdiArrowUpBold, mdiArrowUpBoldOutline } from "@mdi/js";
import Icon from "@mdi/react";
import BackendUrl from "../utils/BackendUrl";
import { useEffect, useState } from "react";

export default function CommentVotes({ post, comment, session }) {
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);

  useEffect(() => {
    if (comment.upvotes.includes(session.user.id)) {
      setUpvoted(true);
    } else if (comment.downvotes.includes(session.user.id)) {
      setDownvoted(true);
    }
  }, [comment, session])

  async function handleVote(type) {
    try {
      // Locally update the post object
      if (type === "up") {
        if (upvoted) {
          comment.upvotes = comment.upvotes.filter((id) => id !== session.user.id);
        } else {
          comment.upvotes.push(session.user.id);
          comment.downvotes = comment.downvotes.filter((id) => id !== session.user.id);
        }
        setUpvoted(!upvoted);
        setDownvoted(false);
      } else if (type === "down") {
        if (downvoted) {
          comment.downvotes = comment.downvotes.filter((id) => id !== session.user.id);
        } else {
          comment.downvotes.push(session.user.id);
          comment.upvotes = comment.upvotes.filter((id) => id !== session.user.id);
        }
        setDownvoted(!downvoted);
        setUpvoted(false);
      }

      const res = await fetch(`${BackendUrl()}/posts/id/${post._id}/comment/id/${comment._id}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ type }),
      });

      if (!res.ok || res.status !== 200) {
        console.error("Es gab einen Fehler beim abstimmen");

        // Reset the post object
        if (type === "up") {
          if (upvoted) {
            comment.upvotes = comment.upvotes.filter((id) => id !== session.user.id);
          } else {
            comment.upvotes.push(session.user.id);
            comment.downvotes = comment.downvotes.filter((id) => id !== session.user.id);
          }
          setUpvoted(!upvoted);
          setDownvoted(false);
        } else if (type === "down") {
          if (downvoted) {
            comment.downvotes = comment.downvotes.filter((id) => id !== session.user.id);
          } else {
            comment.downvotes.push(session.user.id);
            comment.upvotes = comment.upvotes.filter((id) => id !== session.user.id);
          }
          setDownvoted(!downvoted);
          setUpvoted(false);
        }

        return
      }
    } catch (error) {
      console.error("Es gab einen Fehler beim abstimmen");
    }
  }

  return (
    <>
      <button onClick={() => handleVote("up")} className="text flex flex-row items-center gap-0.5"><Icon path={upvoted ? mdiArrowUpBold : mdiArrowUpBoldOutline} size={1.25} />{comment.upvotes.length}</button>
      <button onClick={() => handleVote("down")} className="text flex flex-row items-center gap-0.5"><Icon path={downvoted ? mdiArrowDownBold : mdiArrowDownBoldOutline} size={1.25} />{comment.downvotes.length}</button>
    </>
  )
}