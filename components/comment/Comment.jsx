"use client"

import Link from "next/link";
import ProfileImage from "../ProfileImage";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CalcTimeAgo from "../utils/CalcTimeAgo";
import { faEllipsisH, faPen } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import CommentForm from "./CommentForm";
import CommentDeleteAction from "./CommentDeleteAction";
import CommentVotes from "./CommentVotes";
import TextareaToReadable from "../utils/TextareaToReadable";

export default function Comment({ post, comment, session }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row justify-between items-center">
        <Link href={`/profil/${comment.account.username}`} className="flex flex-row items-center gap-3">
          <ProfileImage src={comment.account.profileImage} width={48} height={48} className="" alt={`Profilbild von ${comment.account.username}`} />
          <p className="text text-base">{comment.account.username}</p>
        </Link>
        <div className="flex flex-row items-center gap-3">
          <p className="text text-muted text-sm">{CalcTimeAgo(comment.createdAt)}</p>
          {session.user.id === comment.account._id && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <FontAwesomeIcon icon={faEllipsisH} className="text-muted text-xl" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <button onClick={() => setIsEditing(true)} className="flex flex-row items-center gap-2 text">
                    <FontAwesomeIcon icon={faPen} />
                    Bearbeiten
                  </button>
                </DropdownMenuItem>
                <CommentDeleteAction post={post} comment={comment} session={session} />
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      {isEditing ? (
        <CommentForm post={post} session={session} comment={comment} setIsEditing={setIsEditing} />
      ) : (
        <>
          <div>
            <p className="text">{TextareaToReadable(comment.content)}</p>
          </div>
          <div className="flex flex-row items-center gap-3">
            <CommentVotes post={post} comment={comment} session={session} />
          </div>
        </>
      )}
    </div>
  )
}