import Now from "@/components/utils/TimeNow";
import DBConnect from "@/lib/DBConnect";
import { decrypt, encrypt } from "@/lib/Session";
import Account from "@/model/Account";
import EmailVerification from "@/model/EmailVerification";
import Mailgun from "mailgun.js";
import { NextResponse } from "next/server";

const API_KEY = process.env.MAILGUN_API_KEY;
const DOMAIN = process.env.MAILGUN_DOMAIN;

const mailgun = new Mailgun(FormData).client({
  url: "https://api.eu.mailgun.net",
  username: "api",
  key: API_KEY,
});

export async function POST(request) {
  await DBConnect();

  const jwtToken = request.headers.get("authorization");

  const payload = await decrypt(jwtToken);

  if (!payload) {
    return NextResponse.json(
      { success: false, message: "Nicht berechtigt" },
      { status: 403 }
    );
  }

  try {
    let code = 0;
    do {
      code = Math.floor(100000 + Math.random() * 900000);
    } while (
      await EmailVerification.findOne({ code: code, email: payload.email })
    );

    await EmailVerification.create({
      code: code,
      email: payload.email,
      validUntil: Now().getTime() + 30 * 60 * 1000, // 30 minutes
    });

    sendEmailVerification(payload.email, code);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Es gab einen Fehler beim generieren der Verifikationsmail",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
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

  if (!reqBody.otp) {
    return NextResponse.json(
      { success: false, message: "OTP muss vorhanden sein" },
      { status: 400 }
    );
  }

  try {
    const emailVerification = await EmailVerification.findOne({
      code: reqBody.otp,
      email: payload.email,
    });
    if (!emailVerification) {
      return NextResponse.json(
        { success: false, message: "Ungültiger Bestätigungscode" },
        { status: 400 }
      );
    }

    const localDate = new Date();
    const nowUtc = localDate.toISOString();
    const now = new Date(nowUtc);
    const validUntil = new Date(emailVerification.validUntil);
    // Weird thing to fix timezone issue and parse date to UTC
    validUntil.setMinutes(
      validUntil.getMinutes() - validUntil.getTimezoneOffset()
    );

    await EmailVerification.deleteOne({
      code: reqBody.otp,
      email: payload.email,
    }).exec();

    if (now > validUntil) {
      return NextResponse.json(
        { success: false, message: "Der Bestätigungscode ist abgelaufen" },
        { status: 400 }
      );
    }

    await Account.updateOne(
      { email: payload.email },
      { $set: { emailVerified: true } }
    ).exec();

    const newPayload = {
      id: payload.id,
      email: payload.email,
      emailVerified: true,
    };

    const jwtToken = await encrypt(newPayload);

    return NextResponse.json(
      { success: true },
      { status: 200, headers: { accessToken: `Bearer ${jwtToken}` } }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Es gab einen Fehler beim aktualisieren",
      },
      { status: 500 }
    );
  }
}

async function sendEmailVerification(email, code) {
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
    "p {" +
    'font-family: "darkmode-on", sans-serif;' +
    "font-optical-sizing: auto;" +
    "font-weight: 600;" +
    "font-style: normal;" +
    "font-size: 14px;" +
    "color: var(--colorText);" +
    "}" +
    ".numbers {" +
    'font-family: "lato", sans-serif;' +
    "color: var(--colorPrimary);" +
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
    "<p>Gebe den unten stehenden 6-stelligen Code auf der Website ein.</p>" +
    '<h1 class="my numbers">' +
    code +
    "</h1>" +
    "<p>Dieser Code ist 30 Minuten lang gültig. <br /><br />Wenn du diesen Code nicht angefordert hast, kannst du diese E-Mail ignorieren, da deine E-Mail-Adresse u. U. versehentlich von einer anderen Person eingegeben wurde.<br /><br />- Dein DANAMEME Team</p>" +
    "</div>" +
    '<p class="copyright">© 2024 DANAMEME, All rights reserved.</p>' +
    "</div>" +
    "</body>" +
    "</html>";

  await mailgun.messages.create(DOMAIN, {
    to: email,
    from: "DANAMEME <no-reply@danameme.ch>",
    subject: code + " ist dein DANAMEME Bestätigungscode",
    text: code + " ist dein DANAMEME Bestätigungscode",
    html: htmlContent,
  });
}
