import DBConnect from "@/lib/DBConnect";
import { encrypt } from "@/lib/Session";
import Account from "@/model/Account";
import { compare } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request) {
  await DBConnect();

  const { email, password } = await request.json();

  try {
    // Check if the email is valid
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "E-Mail und Passwort muss vorhanden sein",
        },
        { status: 400 }
      );
    }

    // Check if the email is valid
    const account = await Account.findOne({ email: email });
    if (!account) {
      return NextResponse.json(
        {
          success: false,
          type: "wrong-credentials",
          message: "E-Mail oder Passwort ist falsch",
        },
        { status: 400 }
      );
    }

    // Check if the password is valid
    const match = await compare(password, account.password);
    if (!match) {
      return NextResponse.json(
        {
          success: false,
          type: "wrong-credentials",
          message: "E-Mail oder Passwort ist falsch",
        },
        { status: 400 }
      );
    }

    const payload = {
      id: account._id,
      email: account.email,
      emailVerified: account.emailVerified,
    };

    const jwtToken = await encrypt(payload);

    return NextResponse.json(
      { success: true },
      { status: 200, headers: { accessToken: `Bearer ${jwtToken}` } }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Es gab einen Fehler bei der Anmeldung" },
      { status: 500 }
    );
  }
}
