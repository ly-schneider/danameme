import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProfileImage from "../ProfileImage";
import { faEllipsisH, faPen } from "@fortawesome/free-solid-svg-icons";
import CalcTimeAgo from "../utils/CalcTimeAgo";
import PostVotes from "./PostVotes";
import Link from "next/link";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import PostDeleteAction from "./PostDeleteAction";

export default function Post({ post, session }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row justify-between items-center">
        <Link href={`/profil/${post.account.username}`} className="flex flex-row items-center gap-3">
          <ProfileImage src={post.account.profileImage} width={48} height={48} className="" alt={`Profilbild von ${post.account.username}`} />
          <p className="text text-base">{post.account.username}</p>
        </Link>
        <div className="flex flex-row items-center gap-3">
          <p className="text text-muted text-sm">{CalcTimeAgo(post.createdAt)}</p>
          {session.user.id === post.account._id && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <FontAwesomeIcon icon={faEllipsisH} className="text-muted text-xl" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href={`/post/${post._id}/edit`} className="flex flex-row items-center gap-2 text">
                    <FontAwesomeIcon icon={faPen} />
                    <p>Bearbeiten</p>
                  </Link>
                </DropdownMenuItem>
                <PostDeleteAction post={post} session={session} />
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <Link href={`/post/${post._id}`} className="flex flex-col gap-3">
        <div>
          <h4 className="text text-xl font-bold">{post.title}</h4>
        </div>
        <div>
          <img
            src={post.image + "?auto=format&auto=compress&cs=srgb"}
            alt={`Bild von ${post.title}`}
            className="w-auto max-h-[28rem] rounded-[10px]"
          />
        </div>
      </Link>
      <div className="flex flex-row items-center gap-3">
        <PostVotes post={post} session={session} />
        <Link href={`/post/${post._id}`} className="ms-1.5 text flex flex-row items-center gap-2"><FontAwesomeIcon icon={faComment} className="text-2xl" />{post.comments.length}</Link>
      </div>
    </div>
  )
}