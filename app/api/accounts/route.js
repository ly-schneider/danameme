import BackendUrl from "@/components/utils/BackendUrl";
import Now from "@/components/utils/TimeNow";
import DBConnect from "@/lib/mongoose";
import { encrypt } from "@/lib/Session";
import Account from "@/model/Account";
import { genSalt, hash } from "bcrypt";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

const saltRounds = 10;

export async function POST(request) {
  await DBConnect();

  const reqBody = await request.json();

  function respondWithError(message) {
    return NextResponse.json({ success: false, message }, { status: 400 });
  }

  if (!reqBody.email) {
    return respondWithError("E-Mail darf nicht leer sein");
  }

  if (!reqBody.password) {
    return respondWithError("Passwort darf nicht leer sein");
  }

  if (reqBody.password.length < 8) {
    return respondWithError("Passwort muss mindestens 8 Zeichen lang sein");
  }

  if (!/[a-z]/.test(reqBody.password) || !/[A-Z]/.test(reqBody.password)) {
    return respondWithError(
      "Passwort muss mindestens einen Gross- und Kleinbuchstaben enthalten"
    );
  }

  if (!/[0-9]/.test(reqBody.password)) {
    return respondWithError("Passwort muss mindestens eine Zahl enthalten");
  }

  if (!/[^\da-zA-Z]/.test(reqBody.password)) {
    return respondWithError(
      "Passwort muss mindestens ein Sonderzeichen enthalten"
    );
  }

  if (!reqBody.firstname) {
    return respondWithError("Vorname darf nicht leer sein");
  }

  if (!reqBody.lastname) {
    return respondWithError("Nachname darf nicht leer sein");
  }

  if (!reqBody.username) {
    return respondWithError("Benutzername darf nicht leer sein");
  }

  if (reqBody.username.length < 3 || reqBody.username.length > 15) {
    return respondWithError(
      "Benutzername muss zwischen 3 und 15 Zeichen lang sein"
    );
  }

  if (!/^[a-zA-Z0-9_.-]+$/.test(reqBody.username)) {
    return respondWithError(
      "Benutzername darf nur 'aA', '0-9', '_', '.', '-' enthalten"
    );
  }

  if (!reqBody.terms) {
    return respondWithError("Sie müssen die Nutzungsbedingungen akzeptieren");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const validateAccountEmail = await Account.findOne({
      email: reqBody.email,
    });
    if (validateAccountEmail) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { success: false, message: "E-Mail ist bereits registriert" },
        { status: 409 }
      );
    }

    const validateAccountUsername = await Account.findOne({
      username: reqBody.username,
    });
    if (validateAccountUsername) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json(
        { success: false, message: "Benutzername ist bereits vergeben" },
        { status: 409 }
      );
    }

    const salt = await genSalt(saltRounds);
    const hashedPassword = await hash(reqBody.password, salt);

    const account = new Account({
      createdAt: Now(),
      firstname: reqBody.firstname,
      lastname: reqBody.lastname,
      username: reqBody.username,
      email: reqBody.email,
      password: hashedPassword,
    });

    await account.save({ session });

    const payload = {
      id: account._id,
      email: account.email,
      emailVerified: false,
    };

    const jwtToken = await encrypt(payload);

    const res = await fetch(`${BackendUrl()}/accounts/email-verification`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    if (!res.ok || res.status !== 200) {
      throw new Error();
    }

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json(
      { success: true },
      { status: 201, headers: { accessToken: `Bearer ${jwtToken}` } }
    );
  } catch (error) {
    console.error(error);
    await session.abortTransaction();
    session.endSession();
    return NextResponse.json(
      {
        success: false,
        message: "Es gab einen Fehler beim registrieren des Accounts",
      },
      { status: 500 }
    );
  }
}
