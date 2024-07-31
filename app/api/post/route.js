import BackendUrl from "@/components/utils/BackendUrl";
import Now from "@/components/utils/TimeNow";
import DBConnect from "@/lib/DBConnect";
import { decrypt, encrypt } from "@/lib/Session";
import Account from "@/model/Account";
import Post from "@/model/Post";
import { genSalt, hash } from "bcrypt";
import { NextResponse } from "next/server";

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

  try {
    const validateAccount = await Account.findOne({
      _id: payload.id,
    });
    if (!validateAccount) {
      return NextResponse.json(
        { success: false, message: "Account nicht gefunden" },
        { status: 404 }
      );
    }
    if (!validateAccount.emailVerified) {
      return NextResponse.json(
        { success: false, message: "Email nicht verifiziert" },
        { status: 403 }
      );
    }

    // TODO: Add image upload to Azure

    const postBody = {
      createdAt: Now(),
      title: reqBody.title,
      image: "",
      accountId: payload.id,
    };
    const post = await Post.create(postBody);

    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Es gab einen Fehler beim erstellen des Posts",
      },
      { status: 500 }
    );
  }
}
