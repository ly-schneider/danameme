"use client";

import { useEffect, useState } from "react";
import Post from "./Post";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useRouter, useSearchParams } from "next/navigation";
import CommentForm from "../comment/CommentForm";
import Comment from "../comment/Comment";

export default function PostList({ posts, session }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [openedPost, setOpenedPost] = useState(null);

  useEffect(() => {
    if (searchParams.get("post")) {
      setOpenedPost(posts.find((post) => post._id === searchParams.get("post")));
    }
  }, [searchParams.get("post")]);

  return (
    <div className="flex flex-col xl:flex-row gap-0 h-full py-10 pt-20 nav:pt-10">
      <div className="max-w-md h-full w-full flex-grow-0 flex-shrink-0">
        <ul className="custom-scrollbar flex flex-col gap-16 h-full w-full pe-6 overflow-y-scroll">
          {posts.map((post) => (
            <li key={post._id} className="flex flex-col gap-8">
              <Post post={post} session={session} setOpenedPost={setOpenedPost} />
              {openedPost && post._id == openedPost._id && (
                <div className="block xl:hidden">
                  <div>
                    <CommentForm post={openedPost} session={session} />
                  </div>
                  <div>
                    <ul className="flex flex-col gap-10">
                      {openedPost.comments.map((comment) => (
                        <li key={comment._id}>
                          <Comment post={openedPost} comment={comment} session={session} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      {openedPost && (
        <div className="hidden xl:flex flex-col max-w-md ps-6 custom-scrollbar h-full w-full pe-6 overflow-y-scroll">
          <div className="mb-4">
            <button className="text-white text-2xl" onClick={() => {
              router.push("/");
              setOpenedPost(null)
            }}><FontAwesomeIcon icon={faXmark} /></button>
          </div>
          <Post post={openedPost} session={session} setOpenedPost={setOpenedPost} isFromOpenedPost={true} />
        </div>
      )}
    </div>
  );
}