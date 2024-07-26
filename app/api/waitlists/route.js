import Now from "@/components/utils/TimeNow";
import DBConnect from "@/lib/DBConnect";
import Waitlist from "@/model/Waitlist";
import { NextResponse } from "next/server";

export async function POST(request) {
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
    if (waitlist) {
      return NextResponse.json(
        { success: false, message: "E-Mail Adresse ist bereits eingetragen" },
        { status: 409 }
      );
    }

    const count = await Waitlist.countDocuments();

    const body = {
      createdAt: Now(),
      email: email,
      count: count + 1,
      used: false,
    };

    await Waitlist.create(body);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Es gab einen Fehler beim eintragen!" },
      { status: 500 }
    );
  }
}
