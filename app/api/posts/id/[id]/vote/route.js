import DBConnect from "@/lib/Mongoose";
import { decrypt } from "@/lib/Session";
import Account from "@/model/Account";
import Post from "@/model/Post";
import { NextResponse } from "next/server";

async function handleVote(post, userId, voteType) {
  const upvoteIndex = post.upvotes.indexOf(userId);
  const downvoteIndex = post.downvotes.indexOf(userId);

  const poster = await Account.findById(post.account);

  if (voteType === "up") {
    if (upvoteIndex !== -1) {
      post.upvotes.splice(upvoteIndex, 1);
      poster.karma -= 1;
    } else {
      if (downvoteIndex !== -1) {
        post.downvotes.splice(downvoteIndex, 1);
        poster.karma += 1;
      }
      post.upvotes.push(userId);
      poster.karma += 1;
    }
  } else if (voteType === "down") {
    if (downvoteIndex !== -1) {
      post.downvotes.splice(downvoteIndex, 1);
      poster.karma += 1;
    } else {
      if (upvoteIndex !== -1) {
        post.upvotes.splice(upvoteIndex, 1);
        poster.karma -= 1;
      }
      post.downvotes.push(userId);
      poster.karma -= 1;
    }
  }

  await post.save();
  if (userId !== poster._id.toString()) {
    await poster.save();
  }
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

    await handleVote(post, payload.id, reqBody.type);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Es gab einen Fehler beim abstimmen" },
      { status: 500 }
    );
  }
}
