"use client";

import { mdiArrowDownBold, mdiArrowDownBoldOutline, mdiArrowUpBold, mdiArrowUpBoldOutline } from "@mdi/js";
import Icon from "@mdi/react";
import BackendUrl from "./utils/BackendUrl";
import { useEffect, useState } from "react";

export default function PostVotes({ post, session }) {
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownvoted] = useState(false);

  useEffect(() => {
    if (post.upvotes.includes(session.user.id)) {
      setUpvoted(true);
    } else if (post.downvotes.includes(session.user.id)) {
      setDownvoted(true);
    }
  }, [post, session])

  async function handleVote(type) {
    try {
      // Locally update the post object
      if (type === "up") {
        if (upvoted) {
          post.upvotes = post.upvotes.filter((id) => id !== session.user.id);
        } else {
          post.upvotes.push(session.user.id);
          post.downvotes = post.downvotes.filter((id) => id !== session.user.id);
        }
        setUpvoted(!upvoted);
        setDownvoted(false);
      } else if (type === "down") {
        if (downvoted) {
          post.downvotes = post.downvotes.filter((id) => id !== session.user.id);
        } else {
          post.downvotes.push(session.user.id);
          post.upvotes = post.upvotes.filter((id) => id !== session.user.id);
        }
        setDownvoted(!downvoted);
        setUpvoted(false);
      }

      const res = await fetch(`${BackendUrl()}/posts/id/${post._id}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ type }),
      });

      if (!res.ok || res.status !== 200) {
        console.error("Fehler beim Abstimmen")

        // Reset the post object
        if (type === "up") {
          if (upvoted) {
            post.upvotes = post.upvotes.filter((id) => id !== session.user.id);
          } else {
            post.upvotes.push(session.user.id);
            post.downvotes = post.downvotes.filter((id) => id !== session.user.id);
          }
          setUpvoted(!upvoted);
          setDownvoted(false);
        } else if (type === "down") {
          if (downvoted) {
            post.downvotes = post.downvotes.filter((id) => id !== session.user.id);
          } else {
            post.downvotes.push(session.user.id);
            post.upvotes = post.upvotes.filter((id) => id !== session.user.id);
          }
          setDownvoted(!downvoted);
          setUpvoted(false);
        }

        return
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <button onClick={() => handleVote("up")} className="text flex flex-row items-center gap-0.5"><Icon path={upvoted ? mdiArrowUpBold : mdiArrowUpBoldOutline} size={1.25} />{post.upvotes.length}</button>
      <button onClick={() => handleVote("down")} className="text flex flex-row items-center gap-0.5"><Icon path={downvoted ? mdiArrowDownBold : mdiArrowDownBoldOutline} size={1.25} />{post.downvotes.length}</button>
    </>
  )
}