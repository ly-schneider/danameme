import DBConnect from "@/lib/DBConnect";
import { decrypt } from "@/lib/Session";
import Account from "@/model/Account";
import { NextResponse } from "next/server";

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

  if (!reqBody.username) {
    return NextResponse.json(
      { success: false, message: "Benutzername darf nicht leer sein" },
      { status: 400 }
    );
  }

  if (reqBody.username.length < 3 || reqBody.username.length > 15) {
    return NextResponse.json(
      {
        success: false,
        message: "Benutzername muss zwischen 3 und 15 Zeichen lang sein",
      },
      { status: 400 }
    );
  }

  if (!/^[a-zA-Z0-9_.-]+$/.test(reqBody.username)) {
    return NextResponse.json(
      {
        success: false,
        message: "Benutzername darf nur 'aA', '0-9', '_', '.', '-' enthalten",
      },
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

    if (reqBody.username !== account.username) {
      const validateAccountUsername = await Account.findOne({
        username: reqBody.username,
      });
      if (validateAccountUsername) {
        return NextResponse.json(
          { success: false, message: "Benutzername ist bereits vergeben" },
          { status: 409 }
        );
      }
    }

    await Account.updateOne(
      { _id: id },
      { $set: { username: reqBody.username } }
    ).exec();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Es gab einen Fehler beim aktualisieren" },
      { status: 500 }
    );
  }
}
