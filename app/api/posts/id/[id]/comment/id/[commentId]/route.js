import DBConnect from "@/lib/Mongoose";
import { decrypt } from "@/lib/Session";
import Comment from "@/model/Comment";
import Post from "@/model/Post";
import { NextResponse } from "next/server";

export async function PATCH(request, context) {
  await DBConnect();

  const reqBody = await request.json();
  const jwtToken = request.headers.get("authorization");
  const payload = await decrypt(jwtToken);

  if (!payload) {
    return NextResponse.json(
      { success: false, message: "Nicht berechtigt" },
      { status: 403 }
    );
  }

  if (!reqBody.content) {
    return NextResponse.json(
      { success: false, message: "Content muss vorhanden sein" },
      { status: 400 }
    );
  }

  if (!reqBody.commentId) {
    return NextResponse.json(
      { success: false, message: "Comment ID muss vorhanden sein" },
      { status: 400 }
    );
  }

  try {
    const comment = await Comment.findById(reqBody.commentId);
    if (!comment) {
      return NextResponse.json(
        { success: false, message: "Kommentar nicht gefunden" },
        { status: 404 }
      );
    }
    if (comment.account.toString() !== payload.id) {
      return NextResponse.json(
        { success: false, message: "Nicht berechtigt" },
        { status: 403 }
      );
    }

    comment.content = reqBody.content;

    await comment.save();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Es gab einen Fehler beim speichern des Kommentars",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  await DBConnect();

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

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json(
        { success: false, message: "Kommentar nicht gefunden" },
        { status: 404 }
      );
    }
    if (comment.account.toString() !== payload.id) {
      return NextResponse.json(
        { success: false, message: "Nicht berechtigt" },
        { status: 403 }
      );
    }

    await Comment.findByIdAndDelete(commentId);

    // Remove from post.comments array
    const post = await Post.findByIdAndUpdate(id, {
      $pull: { comments: commentId },
    });
    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post nicht gefunden" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Es gab einen Fehler beim löschen des Kommentars",
      },
      { status: 500 }
    );
  }
}
