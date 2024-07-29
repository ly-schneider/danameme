"use server";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import * as jose from "jose";
import Now from "@/components/utils/TimeNow";

export async function decrypt(bearerToken) {
  if (!bearerToken) return null;
  const token = bearerToken.split(" ")[1];

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  try {
    const { payload } = await jose.jwtVerify(token, secret);

    const time = Now().getTime() / 1000;
    if (payload.exp < time) {
      await logout();
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
}

export async function encrypt(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "10d" }); // Token expires in 10 days
}

export async function saveSession(token) {
  // Setting the expires to 10 days
  const expires = new Date(new Date().setDate(new Date().getDate() + 10));

  cookies().set("session", token, { expires, httpOnly: true });
}

export async function logout() {
  // Destroy the session
  cookies().set("session", "", { expires: new Date(0) });
}

export async function getSession() {
  const token = cookies().get("session")?.value;
  if (!token) return null;

  const user = await decrypt("Bearer " + token);
  if (!user) return null;

  const obj = {
    accessToken: token,
    user,
  };
  return obj;
}
