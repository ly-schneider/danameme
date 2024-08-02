import DBConnect from "@/lib/Mongoose";
import { decrypt } from "@/lib/Session";
import Post from "@/model/Post";
import { BlobServiceClient } from "@azure/storage-blob";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function DELETE(request, context) {
  await DBConnect();

  const id = context.params.id;
  const jwtToken = request.headers.get("authorization");
  const payload = await decrypt(jwtToken);

  if (!payload) {
    return NextResponse.json(
      { success: false, message: "Nicht berechtigt" },
      { status: 403 }
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const post = await Post.findById(id);
    if (!post) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { success: false, message: "Post nicht gefunden" },
        { status: 404 }
      );
    }
    if (post.accountId.toString() !== payload.id) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { success: false, message: "Nicht berechtigt" },
        { status: 403 }
      );
    }

    await Post.findByIdAndDelete(id, { session });

    if (post.image !== null) {
      const blobServiceClient = BlobServiceClient.fromConnectionString(
        process.env.AZURE_CONNECTION_STRING
      );
      const containerClient = blobServiceClient.getContainerClient("images");
      const oldProfileImage = post.image.split("/").pop();
      const oldBlockBlobClient = containerClient.getBlockBlobClient(
        "posts/" + oldProfileImage
      );
      await oldBlockBlobClient.deleteIfExists();
    }

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    session.endSession();
    return NextResponse.json(
      { success: false, message: "Es gab einen Fehler beim löschen" },
      { status: 500 }
    );
  }
}
