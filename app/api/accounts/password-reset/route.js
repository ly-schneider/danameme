import Now from "@/components/utils/TimeNow";
import DBConnect from "@/lib/Mongoose";
import { decrypt } from "@/lib/Session";
import Account from "@/model/Account";
import PasswordReset from "@/model/PasswordReset";
import { genSalt, hash } from "bcrypt";
import Mailgun from "mailgun.js";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

const saltRounds = 10;

const API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;

const mailgun = new Mailgun(FormData).client({
  url: "https://api.eu.mailgun.net",
  username: "api",
  key: API_KEY,
});

export async function GET(request) {
  await DBConnect();

  const searchParams = request.nextUrl.searchParams;
  const guid = searchParams.get("guid");

  if (!guid) {
    return NextResponse.json(
      { success: false, message: "GUID/Token muss vorhanden sein" },
      { status: 400 }
    );
  }

  try {
    const passwordReset = await PasswordReset.findOne({
      guid: guid,
    });
    if (!passwordReset) {
      return NextResponse.json(
        { success: false, type: "bad-token", message: "Ungültiger Token" },
        { status: 400 }
      );
    }

    const validUntil = new Date(passwordReset.validUntil);
    // Weird thing to fix timezone issue and parse date to UTC
    validUntil.setMinutes(
      validUntil.getMinutes() - validUntil.getTimezoneOffset()
    );

    if (Now() > validUntil) {
      return NextResponse.json(
        {
          success: false,
          type: "expired-token",
          message: "Der Token ist abgelaufen",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Es gab einen Fehler beim überprüfen",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  await DBConnect();

  const reqBody = await request.json();

  if (!reqBody.email) {
    return NextResponse.json(
      { success: false, message: "E-Mail muss vorhanden sein" },
      { status: 400 }
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const validateAccountEmail = await Account.findOne({
      email: reqBody.email,
    });
    if (!validateAccountEmail) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        {
          success: false,
          type: "no-account",
          message: "E-Mail Adresse ist nicht registriert",
        },
        { status: 404 }
      );
    }

    let guid = "";
    do {
      // Using crypto uuid but using it as a guid
      guid = crypto.randomUUID();
    } while (await PasswordReset.findOne({ guid: guid, email: reqBody.email }));

    await PasswordReset.create(
      [
        {
          guid: guid,
          email: reqBody.email,
          validUntil: Now().getTime() + 30 * 60 * 1000, // 30 minutes
        },
      ],
      { session }
    );

    await sendEmailVerification(reqBody.email, guid);

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    session.endSession();
    return NextResponse.json(
      {
        success: false,
        message: "Es gab einen Fehler beim generieren des Tokens",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  await DBConnect();

  const reqBody = await request.json();

  const jwtToken = request.headers.get("authorization");

  if (!reqBody.password) {
    return NextResponse.json(
      { success: false, message: "Neues Passwort muss vorhanden sein" },
      { status: 400 }
    );
  }

  const salt = await genSalt(saltRounds);
  const hashedPassword = await hash(reqBody.password, salt);

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    if (jwtToken) {
      const payload = await decrypt(jwtToken);

      if (!payload) {
        await session.abortTransaction();
        session.endSession();
        return NextResponse.json(
          { success: false, message: "Nicht berechtigt" },
          { status: 403 }
        );
      }

      await Account.updateOne(
        { _id: payload.id },
        {
          $set: {
            password: hashedPassword,
          },
        },
        { session }
      ).exec();
    } else {
      if (!reqBody.guid) {
        await session.abortTransaction();
        session.endSession();
        return NextResponse.json(
          { success: false, message: "GUID/Token muss vorhanden sein" },
          { status: 400 }
        );
      }

      const passwordReset = await PasswordReset.findOne({
        guid: reqBody.guid,
      });
      if (!passwordReset) {
        await session.abortTransaction();
        session.endSession();
        return NextResponse.json(
          { success: false, type: "bad-token", message: "Ungültiger Token" },
          { status: 400 }
        );
      }

      const validUntil = new Date(passwordReset.validUntil);
      // Weird thing to fix timezone issue and parse date to UTC
      validUntil.setMinutes(
        validUntil.getMinutes() - validUntil.getTimezoneOffset()
      );

      if (Now() > validUntil) {
        await session.abortTransaction();
        session.endSession();
        return NextResponse.json(
          {
            success: false,
            type: "expired-token",
            message: "Der Token ist abgelaufen",
          },
          { status: 400 }
        );
      }

      const account = await Account.findOne({
        email: passwordReset.email,
      });
      if (!account) {
        await session.abortTransaction();
        session.endSession();
        return NextResponse.json(
          { success: false, message: "Account nicht gefunden" },
          { status: 404 }
        );
      }

      await PasswordReset.deleteOne({ guid: reqBody.guid }, { session }).exec();

      await Account.updateOne(
        { _id: account._id },
        {
          $set: {
            password: hashedPassword,
          },
        },
        { session }
      ).exec();
    }

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    session.endSession();
    return NextResponse.json(
      {
        success: false,
        message: "Es gab einen Fehler beim zurücksetzen des Passworts",
      },
      { status: 500 }
    );
  }
}

async function sendEmailVerification(email, guid) {
  let htmlContent =
    "<!DOCTYPE html>" +
    '<html lang="de">' +
    "<head>" +
    '<meta charset="UTF-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">' +
    '<link rel="stylesheet" href="https://use.typekit.net/lzg0gqg.css">' +
    "<style>" +
    ":root {" +
    "--colorBackground: #13252a;" +
    "--colorPrimary: #b43f3f;" +
    "--colorText: #f8eded;" +
    "}" +
    "body, html {" +
    "margin: 0;" +
    "padding: 0;" +
    "box-sizing: border-box;" +
    "background-color: var(--colorBackground);" +
    "}" +
    "h1 {" +
    'font-family: "effra-cc", sans-serif;' +
    "font-weight: 700;" +
    "font-style: normal;" +
    "color: var(--colorText);" +
    "}" +
    "p, .btn {" +
    'font-family: "darkmode-on", sans-serif;' +
    "font-optical-sizing: auto;" +
    "font-weight: 600;" +
    "font-style: normal;" +
    "font-size: 14px;" +
    "color: var(--colorText);" +
    "}" +
    ".btn-container {" +
    "display: flex;" +
    "flex-direction: column;" +
    "gap: 0.5rem;" +
    "margin: 2rem 0;" +
    "}" +
    ".btn-container p {" +
    "margin: 0;" +
    "color: #636363;" +
    "}" +
    ".btn {" +
    "padding: 0.8rem 2.5rem;" +
    "border-radius: 10px;" +
    "display: flex;" +
    "justify-content: center;" +
    "align-items: center;" +
    "width: auto;" +
    "transition: all 0.3s;" +
    "background-color: var(--colorPrimary);" +
    "color: var(--colorText);" +
    "text-decoration: none;" +
    "}" +
    ".btn:hover {" +
    "background-color: #8c2f2f;" +
    "}" +
    ".wrapper {" +
    "margin: 0 auto;" +
    "max-width: 500px;" +
    "padding: 50px 40px;" +
    "height: calc(100vh - 100px);" +
    "display: flex;" +
    "flex-direction: column;" +
    "}" +
    ".brand-logo {" +
    "width: 250px;" +
    "display: block;" +
    "}" +
    ".container {" +
    "margin-top: 40px;" +
    "}" +
    ".my {" +
    "font-size: 34px;" +
    "margin: 40px 0;" +
    "}" +
    ".copyright {" +
    "font-size: 12px;" +
    "padding: 50px 0px;" +
    "text-align: center;" +
    "}" +
    "@media screen and (max-width: 560px) {" +
    ".wrapper {" +
    "padding: 40px 20px;" +
    "}" +
    "}" +
    "</style>" +
    "</head>" +
    "<body>" +
    '<div class="wrapper">' +
    '<img src="https://lh3.googleusercontent.com/drive-viewer/AKGpihbZMmkLIRtavkOzmvWv7LwHCBWRLbuvCaWmc2MhgzSwK7LKW885mPG5EgFz340xpd2dgqzh5TPF-pnZ5IKvnWrmko4hIEWqmxs=w1920-h940-rw-v1" alt="DANAMEME Logo" class="brand-logo">' +
    '<div class="container">' +
    "<p>Klicke auf den Knopf um dein Passwort zurückzusetzen</p>" +
    '<div class="btn-container">' +
    '<a target="_blank" href="' +
    process.env.NEXT_PUBLIC_API_URL.replace("/api", "") +
    "/passwort-reset?token=" +
    guid +
    '" class="btn">Passwort zurücksetzen</a>' +
    "<p>Token: " +
    guid +
    "</p>" +
    "</div>" +
    "<p>Dieser Token ist 30 Minuten lang gültig. <br /><br />Wenn du diesen Token nicht angefordert hast, kannst du diese E-Mail ignorieren, da deine E-Mail-Adresse u. U. versehentlich von einer anderen Person eingegeben wurde.<br /><br />- Dein DANAMEME Team</p>" +
    "</div>" +
    '<p class="copyright">© 2024 DANAMEME, All rights reserved.</p>' +
    "</div>" +
    "</body>" +
    "</html>";

  await mailgun.messages.create(DOMAIN, {
    to: email,
    from: "DANAMEME <no-reply@danameme.ch>",
    subject: "Passwort zurücksetzen",
    text: "Passwort zurücksetzen",
    html: htmlContent,
  });
}
