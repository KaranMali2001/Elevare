"use server";
import { refreshAccessToken } from "@/actions/refreshAccessToken";
import { DEFAULT_EMAIL } from "@/constants";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { cookies } from "next/headers";

export async function getToken(url: string) {
  const session = await auth();

  let accessToken = cookies().get("Token")?.value || "";
  const expiresAt = cookies().get("expiresAt")?.value || 0;
  let userEmailAddress: string;
  if (url.startsWith("/Demo")) {
    userEmailAddress = DEFAULT_EMAIL;
  } else {
    userEmailAddress = session?.user?.email || "";
  }
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
