import DBConnect from "@/lib/DBConnect";
import { decrypt } from "@/lib/Session";
import Account from "@/model/Account";
import { NextResponse } from "next/server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  await DBConnect();

  const jwtToken = request.headers.get("authorization");

  const payload = await decrypt(jwtToken);

  if (!payload) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  try {
    const account = await Account.findOne({
      _id: payload.id,
    });

    const customer = await stripe.customers.create({
      name: `${account.firstname} ${account.lastname}`,
      email: account.email,
      metadata: {
        accountId: account._id.toString(),
      },
    });

    await Account.updateOne(
      { _id: account._id },
      { stripeCustomerId: customer.id }
    ).exec();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to create stripe customer" },
      { status: 500 }
    );
  }
}
