"use server";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GetEmailById(id: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("Token")?.value;

  if (!accessToken || !id) {
    return NextResponse.json(
      { error: "Access token and email ID are required" },
      { status: 400 },
    );
  }
  try {
    const response = await fetch(
      `https://www.googleapis.com/gmail/v1/users/me/messages/${id}?format=raw`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error("Failed to fetch email details raw email format");
    }

    const data = await response.json();
    const b = Buffer.from(data.raw, "base64");
    const rawEmail = b.toString("utf-8");

    return rawEmail;
  } catch (error: any) {
    return error;
  }
}
