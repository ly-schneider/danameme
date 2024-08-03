import Now from "@/components/utils/TimeNow";
import DBConnect from "@/lib/Mongoose";
import { decrypt } from "@/lib/Session";
import Comment from "@/model/Comment";
import Post from "@/model/Post";
import { NextResponse } from "next/server";

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

  if (!reqBody.content) {
    return NextResponse.json(
      { success: false, message: "Content muss vorhanden sein" },
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

    const comment = new Comment({
      createdAt: Now(),
      post: id,
      account: payload.id,
      content: reqBody.content,
    });

    await comment.save();

    return NextResponse.json({ success: true }, { status: 201 });
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
