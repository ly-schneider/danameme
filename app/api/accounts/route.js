import AccountPage from "@/app/account/page";
import Now from "@/components/utils/TimeNow";
import DBConnect from "@/lib/DBConnect";
import { decrypt, encrypt } from "@/lib/Session";
import Account from "@/model/Account";
import Waitlist from "@/model/Waitlist";
import { genSalt, hash } from "bcrypt";
import { NextResponse } from "next/server";

const saltRounds = 10;

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  await DBConnect();

  const reqBody = await request.json();

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

  if (!reqBody.email) {
    return NextResponse.json(
      { success: false, message: "E-Mail darf nicht leer sein" },
      { status: 400 }
    );
  }

  if (!reqBody.password) {
    return NextResponse.json(
      { success: false, message: "Passwort darf nicht leer sein" },
      { status: 400 }
    );
  }

  try {
    // Check if the email is valid
    const validateAccount = await Account.findOne({ email: reqBody.email });
    if (validateAccount) {
      return NextResponse.json(
        { success: false, message: "E-Mail ist bereits registriert" },
        { status: 409 }
      );
    }

    let benefit = false;

    let message = "";

    const validateWaitlist = await Waitlist.findOne({ email: reqBody.email });
    if (validateWaitlist) {
      if (validateWaitlist.used == false && validateWaitlist.count <= 100) {
        await Waitlist.updateOne(
          { _id: validateWaitlist._id },
          { $set: { used: true } }
        ).exec();

        benefit = true;
        message = "Du hast erfolgreich die Vorteile der Warteliste erhalten!";
      } else if (validateWaitlist.used == true) {
        message =
          "Diese E-Mail Adresse wurde bereits verwendet für die Vorteile der Warteliste!";
      } else if (validateWaitlist.count > 100) {
        message = `Du hast leider als Platz ${validateWaitlist.count} auf der Warteliste nicht die Vorteile erhalten!\nTrotzdem danke für dein Interesse!`;
        await Waitlist.updateOne(
          { _id: validateWaitlist._id },
          { $set: { used: true } }
        ).exec();
      }
    }

    const salt = await genSalt(saltRounds);
    const hashedPassword = await hash(reqBody.password, salt);

    const body = {
      createdAt: Now(),
      firstname: reqBody.firstname,
      lastname: reqBody.lastname,
      email: reqBody.email,
      password: hashedPassword,
      stripeCustomerId: null,
      benefit: benefit,
    };

    const account = await Account.create(body);

    const payload = {
      id: account._id,
      email: account.email,
    };

    const jwtToken = await encrypt(payload);

    return NextResponse.json(
      { success: true, data: account, waitlistMessage: message },
      { status: 201, headers: { accessToken: `Bearer ${jwtToken}` } }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Es gab einen Fehler beim registrieren des Accounts",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  await DBConnect();

  const reqBody = await request.json();
  const jwtToken = request.headers.get("authorization");

  const payload = await decrypt(jwtToken);

  if (!payload) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
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

  if (!reqBody.email) {
    return NextResponse.json(
      { success: false, message: "E-Mail darf nicht leer sein" },
      { status: 400 }
    );
  }

  try {
    const account = await Account.findById(payload.id);
    if (!account) {
      throw new Error();
    }

    if (account.email !== reqBody.email) {
      const validateAccount = await Account.findOne({ email: reqBody.email });
      if (validateAccount) {
        return NextResponse.json(
          {
            success: false,
            type: "email-in-use",
            message: "E-Mail Adresse ist bereits registriert",
          },
          { status: 409 }
        );
      }
    }

    const body = {
      firstname: reqBody.firstname,
      lastname: reqBody.lastname,
      email: reqBody.email,
    };

    Account.updateOne({ _id: payload.id }, { $set: { ...body } }).exec();

    await stripe.customers.update(account.stripeCustomerId, {
      name: `${reqBody.firstname} ${reqBody.lastname}`,
      email: reqBody.email,
      metadata: {
        accountId: account._id.toString(),
      },
    });

    const newPayload = {
      id: account._id,
      email: reqBody.email,
    };

    const jwtToken = await encrypt(newPayload);

    return NextResponse.json(
      { success: true, data: account },
      { status: 200, headers: { accessToken: `Bearer ${jwtToken}` } }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Es gab einen Fehler beim aktualisieren des Accounts",
      },
      { status: 500 }
    );
  }
}
