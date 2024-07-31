import Now from "@/components/utils/TimeNow";
import DBConnect from "@/lib/DBConnect";
import { decrypt } from "@/lib/Session";
import Account from "@/model/Account";
import { BlobServiceClient } from "@azure/storage-blob";
import { NextResponse } from "next/server";

function bufferToStream(buffer) {
  const { Readable } = require("stream");
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

export async function PATCH(request, context) {
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

  if (!reqBody.profileImage) {
    return NextResponse.json(
      { success: false, message: "Profilbild muss vorhanden sein" },
      { status: 400 }
    );
  }

  if (!reqBody.profileImage.startsWith("data:image")) {
    return NextResponse.json(
      { success: false, message: "Profilbild muss ein Blob sein" },
      { status: 400 }
    );
  }

  try {
    const account = await Account.findById(id);
    if (!account) {
      return NextResponse.json(
        { success: false, message: "Account nicht gefunden" },
        { status: 404 }
      );
    }
    if (payload.id !== account._id.toString()) {
      return NextResponse.json(
        { success: false, message: "Nicht berechtigt" },
        { status: 403 }
      );
    }

    // Fetch the Blob from the Blob URL
    const response = await fetch(reqBody.profileImage);
    const blob = await response.blob();

    // Convert the Blob to a File
    const file = new File([blob], payload.id, { type: blob.type });

    const fileTypeToExtension = {
      "image/jpeg": "jpg",
      "image/png": "png",
    };

    const fileType = fileTypeToExtension[file.type];
    if (!fileType) {
      return NextResponse.json(
        { success: false, message: "Dateityp nicht unterstützt" },
        { status: 400 }
      );
    }

    const time = Now().getTime();

    const blobName =
      "profile-images/" + file.name + "-" + time + "." + fileType;
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

    const imageUrl =
      process.env.IMAGE_URL +
      "/profile-images/" +
      file.name +
      "-" +
      time +
      "." +
      fileType;

    await Account.updateOne(
      { _id: id },
      { $set: { profileImage: imageUrl } }
    ).exec();

    // Delete the old profile image from the Blob Storage
    const oldProfileImage = account.profileImage.split("/").pop();
    const oldBlockBlobClient = containerClient.getBlockBlobClient(
      "profile-images/" + oldProfileImage
    );
    await oldBlockBlobClient.deleteIfExists();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Es gab einen Fehler beim aktualisieren" },
      { status: 500 }
    );
  }
}
