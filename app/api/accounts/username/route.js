import DBConnect from "@/lib/Mongoose";
import Account from "@/model/Account";
import { NextResponse } from "next/server";

export async function GET(request) {
  await DBConnect();

  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { success: false, message: "Benutzername ist erforderlich" },
      { status: 400 }
    );
  }

  try {
    const account = await Account.findOne({ username: username });
    if (account) {
      return NextResponse.json(
        { success: false, message: "Benutzername ist bereits eingetragen" },
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
