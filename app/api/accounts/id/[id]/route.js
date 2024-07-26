import DBConnect from "@/lib/DBConnect";
import { decrypt } from "@/lib/Session";
import Account from "@/model/Account";
import { NextResponse } from "next/server";

export async function GET(request, context) {
  await DBConnect();

  const id = context.params.id;
  const jwtToken = request.headers.get("authorization");

  const payload = await decrypt(jwtToken);

  if (!payload) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 }
    );
  }

  try {
    const account = await Account.findById(id);
    if (!account) {
      return NextResponse.json(
        { success: false, message: "Account not found" },
        { status: 404 }
      );
    }

    if (payload.id !== account._id.toString()) {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const body = {
      _id: account._id,
      createdAt: account.createdAt,
      email: account.email,
      firstname: account.firstname,
      lastname: account.lastname,
      stripCustomerId: account.stripCustomerId,
      benefit: account.benefit,
    };

    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Fehler beim Datenabruf" },
      { status: 500 }
    );
  }
}
