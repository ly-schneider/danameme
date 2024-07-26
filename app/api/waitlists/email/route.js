import DBConnect from "@/lib/DBConnect";
import Account from "@/model/Account";
import Waitlist from "@/model/Waitlist";
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
    const waitlist = await Waitlist.findOne({ email: email });
    if (!waitlist) {
      return NextResponse.json(
        { success: false, message: "E-Mail Adresse ist nicht eingetragen" },
        { status: 404 }
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
