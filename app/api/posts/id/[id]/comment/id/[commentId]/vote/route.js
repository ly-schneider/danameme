import DBConnect from "@/lib/Mongoose";
import { decrypt } from "@/lib/Session";
import Comment from "@/model/Comment";
import Post from "@/model/Post";
import { NextResponse } from "next/server";

async function handleVote(comment, userId, voteType) {
  const upvoteIndex = comment.upvotes.indexOf(userId);
  const downvoteIndex = comment.downvotes.indexOf(userId);

  if (voteType === "up") {
    if (upvoteIndex !== -1) {
      comment.upvotes.splice(upvoteIndex, 1);
    } else {
      if (downvoteIndex !== -1) {
        comment.downvotes.splice(downvoteIndex, 1);
      }
      comment.upvotes.push(userId);
    }
  } else if (voteType === "down") {
    if (downvoteIndex !== -1) {
      comment.downvotes.splice(downvoteIndex, 1);
    } else {
      if (upvoteIndex !== -1) {
        comment.upvotes.splice(upvoteIndex, 1);
      }
      comment.downvotes.push(userId);
    }
  }

  await comment.save();
}

export async function POST(request, context) {
  await DBConnect();

  const reqBody = await request.json();
  const id = context.params.id;
  const commentId = context.params.commentId;
  const jwtToken = request.headers.get("authorization");
  const payload = await decrypt(jwtToken);

  if (!payload) {
    return NextResponse.json(
      { success: false, message: "Nicht berechtigt" },
      { status: 403 }
    );
  }

  if (!reqBody.type || (reqBody.type !== "up" && reqBody.type !== "down")) {
    return NextResponse.json(
      { success: false, message: "Ungültiger Typ" },
      { status: 400 }
    );
  }

  try {
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post nicht gefunden" },
        { status: 404 }
      );
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json(
        { success: false, message: "Kommentar nicht gefunden" },
        { status: 404 }
      );
    }

    await handleVote(comment, payload.id, reqBody.type);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Es gab einen Fehler beim abstimmen" },
      { status: 500 }
    );
  }
}
