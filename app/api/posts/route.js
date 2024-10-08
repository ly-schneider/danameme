import Now from "@/components/utils/TimeNow";
import DBConnect from "@/lib/Mongoose";
import { decrypt } from "@/lib/Session";
import Account from "@/model/Account";
import Comment from "@/model/Comment";
import Post from "@/model/Post";
import { BlobServiceClient } from "@azure/storage-blob";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request) {
  await DBConnect();

  const jwtToken = request.headers.get("authorization");
  const payload = await decrypt(jwtToken);

  if (!payload) {
    return NextResponse.json(
      { success: false, message: "Nicht berechtigt" },
      { status: 403 }
    );
  }

  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("account", "username profileImage", Account);

    const postIds = posts.map((post) => post._id);
    const comments = await Comment.find({ post: { $in: postIds } }).populate(
      "account",
      "username profileImage",
      Account
    );

    const commentsByPostId = comments.reduce((acc, comment) => {
      acc[comment.post] = acc[comment.post] || [];
      acc[comment.post].push(comment);
      return acc;
    }, {});

    const postsWithComments = posts.map((post) => {
      return {
        ...post.toObject(),
        comments: commentsByPostId[post._id] || [],
      };
    });

    return NextResponse.json(
      { success: true, data: postsWithComments },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Es gab einen Fehler beim laden der Posts",
      },
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

export async function POST(request) {
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

    if (!validateAccount.emailVerified) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { success: false, message: "Email nicht verifiziert" },
        { status: 403 }
      );
    }

    const post = new Post({
      createdAt: Now(),
      title: reqBody.title,
      account: payload.id,
    });

    await post.save({ session });

    let imageUrl = null;

    if (reqBody.image) {
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

      imageUrl = `https://${process.env.IMAGE_URL}/posts/${file.name}-${time}.${
        file.type.split("/")[1]
      }`;
    }

    await Post.updateOne(
      { _id: post._id },
      { $set: { image: imageUrl } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json({ success: true, data: post }, { status: 201 });
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
