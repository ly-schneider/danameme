import DBConnect from "@/lib/DBConnect";
import { decrypt } from "@/lib/Session";
import Account from "@/model/Account";
import TeacherApplication from "@/model/TeacherApplication";
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
    const account = await Account.findOne({
      _id: id,
    });
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

    const application = await TeacherApplication.findOne({
      accountId: payload.id,
    });
    if (!application) {
      return NextResponse.json(
        {
          success: false,
          message: "No application found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: application },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Es gab einen Fehler beim Datenabruf",
      },
      { status: 500 }
    );
  }
}
