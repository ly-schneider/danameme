"use server";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function decrypt(bearerToken) {
  if (!bearerToken) return null;
  const token = bearerToken.split(" ")[1];

  try {
    if (!jwt.verify(token, process.env.JWT_SECRET)) {
      console.log("Invalid token");
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }

  const payload = jwt.decode(token);

  const localDate = new Date();
  const nowUtc = localDate.toISOString();
  const now = new Date(nowUtc);

  const time = now.getTime() / 1000;
  if (payload.exp < time) {
    await logout();
    return null;
  }

  return payload;
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
