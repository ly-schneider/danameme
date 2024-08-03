import DBConnect from "@/lib/Mongoose";
import { decrypt } from "@/lib/Session";
import Account from "@/model/Account";
import Post from "@/model/Post";
import { NextResponse } from "next/server";

export async function GET(request, context) {
  await DBConnect();

  const username = context.params.username;
  const jwtToken = request.headers.get("authorization");
  const payload = await decrypt(jwtToken);

  if (!payload) {
    return NextResponse.json(
      { success: false, message: "Nicht berechtigt" },
      { status: 403 }
    );
  }

  try {
    let account = await Account.findOne({ username: username });
    if (!account) {
      return NextResponse.json(
        { success: false, message: "Account konnte nicht gefunden werden" },
        { status: 200 }
      );
    }
    account.password = undefined;
    account.email = undefined;
    account.firstname = undefined;
    account.lastname = undefined;
    account.emailVerified = undefined;
    account.__v = undefined;

    const posts = await Post.find({ account: account._id })
      .sort({
        createdAt: -1,
      })
      .populate("account", "username profileImage", Account);

    const body = {
      account: account,
      posts: posts,
    };

    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Es gab einen Fehler beim Datenabruf!" },
      { status: 500 }
    );
  }
}
