import BackendUrl from "@/components/utils/BackendUrl";
import DBConnect from "@/lib/DBConnect";
import { decrypt, encrypt } from "@/lib/Session";
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

  if (!reqBody.email) {
    return NextResponse.json(
      { success: false, message: "E-Mail darf nicht leer sein" },
      { status: 400 }
    );
  }

  if (!reqBody.firstname) {
    return NextResponse.json(
      { success: false, message: "Vorname darf nicht leer sein" },
      { status: 400 }
    );
  }

  if (!reqBody.lastname) {
    return NextResponse.json(
      { success: false, message: "Nachname darf nicht leer sein" },
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

    if (reqBody.email !== account.email) {
      const validateAccountEmail = await Account.findOne({
        email: reqBody.email,
      });
      if (validateAccountEmail) {
        return NextResponse.json(
          { success: false, message: "E-Mail ist bereits registriert" },
          { status: 409 }
        );
      }
    }

    await Account.updateOne(
      { _id: id },
      {
        $set: {
          email: reqBody.email,
          firstname: reqBody.firstname,
          lastname: reqBody.lastname,
          emailVerified:
            reqBody.email === account.email ? account.emailVerified : false,
        },
      }
    ).exec();

    if (reqBody.email !== account.email) {
      const payload = {
        id: id,
        email: reqBody.email,
        emailVerified: false,
      };

      const newJwtToken = await encrypt(payload);

      const res = await fetch(`${BackendUrl()}/accounts/email-verification`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${newJwtToken}`,
        },
      });

      if (!res.ok || res.status !== 200) {
        throw new Error();
      }

      return NextResponse.json(
        { success: true },
        { status: 200, headers: { accessToken: `Bearer ${newJwtToken}` } }
      );
    } else {
      return NextResponse.json({ success: true }, { status: 200 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Es gab einen Fehler beim aktualisieren" },
      { status: 500 }
    );
  }
}