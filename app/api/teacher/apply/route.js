import Now from "@/components/utils/TimeNow";
import DBConnect from "@/lib/DBConnect";
import { decrypt } from "@/lib/Session";
import TeacherApplication from "@/model/TeacherApplication";
import { BlobServiceClient } from "@azure/storage-blob";
import { NextResponse } from "next/server";

const bufferToStream = (buffer) => {
  const { Readable } = require("stream");
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

export async function POST(request) {
  await DBConnect();

  const jwtToken = request.headers.get("authorization");

  const payload = await decrypt(jwtToken);

  if (!payload) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  try {
    const validateApplication = await TeacherApplication.findOne({
      accountId: payload.id,
    });
    if (validateApplication) {
      if (validateApplication.accepted === null) {
        return NextResponse.json(
          {
            success: false,
            type: "application-in-progress",
            message: "Du hast bereits eine Bewerbung eingereicht",
          },
          { status: 400 }
        );
      } else if (validateApplication.accepted === true) {
        return NextResponse.json(
          {
            success: false,
            type: "application-accepted",
            message: "Du bist bereits als Lehrperson akzeptiert",
          },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          {
            success: false,
            type: "application-rejected",
            message:
              "Du hast bereits eine Bewerbung eingereicht, die abgelehnt wurde",
          },
          { status: 400 }
        );
      }
    }

    const formData = await request.formData();
    const file = formData.get("blob");

    const blobName = payload.id + "-" + Now().getTime() + "-" + file.name;
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_CONNECTION_STRING
    );
    const containerClient = blobServiceClient.getContainerClient(
      "teacher-applications"
    );
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

    const body = {
      createdAt: Now(),
      updatedAt: null,
      url: blockBlobClient.url,
      accepted: null,
      message: "",
      accountId: payload.id,
    };

    await TeacherApplication.create(body);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Es gab einen Fehler beim bewerben",
      },
      { status: 500 }
    );
  }
}
