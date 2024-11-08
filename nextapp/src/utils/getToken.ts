"use server";
import { refreshAccessToken } from "@/actions/refreshAccessToken";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { cookies } from "next/headers";

export async function getToken() {
  let accessToken = cookies().get("Token")?.value;
  const expiresAt = cookies().get("expiresAt")?.value || 0;

  const session = await auth();
  const userEmailAddress = session?.user?.email;
  if (Date.now() > Number(expiresAt)) {
    const res = await prisma.users.findFirst({
      where: {
        emailAddress: userEmailAddress || "",
      },
      select: {
        refreshToken: true,
      },
    });

    accessToken = await refreshAccessToken(res?.refreshToken || "");
  }
  return accessToken;
}
