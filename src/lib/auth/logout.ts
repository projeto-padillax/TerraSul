"use server";
import { cookies } from "next/headers";
export async function logoutUser() {
  const cookieStore = cookies();
  (await cookieStore).delete("session");
}