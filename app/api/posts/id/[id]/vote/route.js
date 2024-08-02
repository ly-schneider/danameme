import DBConnect from "@/lib/Mongoose";
import { decrypt } from "@/lib/Session";
import Post from "@/model/Post";
import { NextResponse } from "next/server";

async function handleVote(post, userId, voteType) {
  const upvoteIndex = post.upvotes.indexOf(userId);
  const downvoteIndex = post.downvotes.indexOf(userId);

  if (voteType === "up") {
    if (upvoteIndex !== -1) {
      post.upvotes.splice(upvoteIndex, 1); // Remove existing upvote
    } else {
      if (downvoteIndex !== -1) {
        post.downvotes.splice(downvoteIndex, 1); // Remove existing downvote
      }
      post.upvotes.push(userId); // Add upvote
    }
  } else if (voteType === "down") {
    if (downvoteIndex !== -1) {
      post.downvotes.splice(downvoteIndex, 1); // Remove existing downvote
    } else {
      if (upvoteIndex !== -1) {
        post.upvotes.splice(upvoteIndex, 1); // Remove existing upvote
      }
      post.downvotes.push(userId); // Add downvote
    }
  }

  await post.save();
}

export async function POST(request, context) {
  await DBConnect();

  const reqBody = await request.json();
  const id = context.params.id;
  const jwtToken = request.headers.get("authorization");
  const payload = await decrypt(jwtToken);

  if (!payload) {
    return NextResponse.json(
      { success: false, message: "Nicht berechtigt" },
      { status: 403 }
    );
  }

  const userId = payload.id; // Assuming the payload contains the user ID

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

    await handleVote(post, userId, reqBody.type);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Es gab einen Fehler beim Datenabruf" },
      { status: 500 }
    );
  }
}
