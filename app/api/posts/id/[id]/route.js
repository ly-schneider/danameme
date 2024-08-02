import Now from "@/components/utils/TimeNow";
import DBConnect from "@/lib/Mongoose";
import { decrypt } from "@/lib/Session";
import Account from "@/model/Account";
import Comment from "@/model/Comment";
import Post from "@/model/Post";
import { BlobServiceClient } from "@azure/storage-blob";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request, context) {
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

  try {
    const post = await Post.findById(id)
      .populate("account", "username profileImage", Account)
      .populate({
        path: "comments",
        populate: {
          path: "account",
          select: "username profileImage",
          model: Account,
        },
        select: "createdAt account content upvotes downvotes",
        model: Comment,
      });
    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post nicht gefunden" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Es gab einen Fehler beim laden" },
      { status: 500 }
    );
  }
}

function bufferToStream(buffer) {
  const { Readable } = require("stream");
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

export async function PATCH(request, context) {
  await DBConnect();

  const id = context.params.id;
  const reqBody = await request.json();
  const jwtToken = request.headers.get("authorization");
  const payload = await decrypt(jwtToken);

  if (!payload) {
    return NextResponse.json(
      { success: false, message: "Nicht berechtigt" },
      { status: 403 }
    );
  }

  if (!reqBody.title) {
    return NextResponse.json(
      { success: false, message: "Titel muss vorhanden sein" },
      { status: 400 }
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const validateAccount = await Account.findOne({ _id: payload.id });
    if (!validateAccount) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { success: false, message: "Account nicht gefunden" },
        { status: 404 }
      );
    }

    const post = await Post.findById(id);
    if (!post) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { success: false, message: "Post nicht gefunden" },
        { status: 404 }
      );
    }

    let imageUrl = reqBody.image;

    if (reqBody.image.startsWith("data:image")) {
      const response = await fetch(reqBody.image);
      const blob = await response.blob();
      const file = new File([blob], post._id, { type: blob.type });

      if (!file.type.startsWith("image")) {
        await session.abortTransaction();
        session.endSession();
        return NextResponse.json(
          { success: false, message: "Dateityp nicht unterstützt" },
          { status: 400 }
        );
      }

      const time = Now().getTime();
      const blobName = `posts/${file.name}-${time}.${file.type.split("/")[1]}`;
      const blobServiceClient = BlobServiceClient.fromConnectionString(
        process.env.AZURE_CONNECTION_STRING
      );
      const containerClient = blobServiceClient.getContainerClient("images");
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      const arrayBuffer = await file.arrayBuffer();
      const fileBuffer = Buffer.from(arrayBuffer);

      await blockBlobClient.uploadStream(
        bufferToStream(fileBuffer),
        fileBuffer.length,
        5,
        {
          blobHTTPHeaders: { blobContentType: file.type },
        }
      );

      imageUrl = `${process.env.IMAGE_URL}/posts/${file.name}-${time}.${
        file.type.split("/")[1]
      }`;

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
    }

    post.title = reqBody.title;
    post.image = imageUrl;

    await post.save();

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json({ success: true, data: post }, { status: 200 });
  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    session.endSession();
    return NextResponse.json(
      {
        success: false,
        message: "Es gab einen Fehler beim erstellen des Posts",
      },
      { status: 500 }
    );
  }
}

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
    if (post.account.toString() !== payload.id) {
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
