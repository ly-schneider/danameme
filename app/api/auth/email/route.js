import DBConnect from "@/lib/Mongoose";
import Account from "@/model/Account";
import { NextResponse } from "next/server";

export async function GET(request) {
  await DBConnect();

  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { success: false, message: "E-Mail Adresse ist erforderlich" },
      { status: 400 }
    );
  }

  try {
    const account = await Account.findOne({ email: email });
    if (!account) {
      return NextResponse.json(
        {
          success: false,
          type: "not-registered",
          message: "E-Mail Adresse ist nicht registriert",
        },
        { status: 404 }
      );
    }

    if (account.password === null) {
      return NextResponse.json(
        { success: true, type: "migrate" },
        { status: 200 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Es gab einen Fehler beim überprüfen!" },
      { status: 500 }
    );
  }
}
