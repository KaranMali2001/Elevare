"use server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { signIn } from "../lib/auth";
export async function signInAction() {
  await signIn("google", { redirectTo: "/dashboard" });
}
export async function signOutAction() {
  console.log("inside signout action");
  const cookieStore = await cookies();
  cookieStore.delete("Token");
  cookieStore.delete("expiresAt");
  cookieStore.delete("karan"); //delete token from cookies
  const res = new NextResponse();
}
