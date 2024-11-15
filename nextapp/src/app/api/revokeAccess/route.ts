import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await auth();
  const user = await prisma.users.findFirst({
    where: {
      emailAddress: session?.user?.email || "",
    },
    select: {
      refreshToken: true,
    },
  });
  const cookieStore = await cookies();
  const token = cookieStore.get("Token")?.value;
  {
    const response = await fetch(
      `https://oauth2.googleapis.com/revoke?token=${token}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.status !== 200) {
      console.log("revoke access failed access token");
    } else {
      console.log("revoke access success acccess token");
    }
  }
  {
    const response = await fetch(
      `https://oauth2.googleapis.com/revoke?token=${user?.refreshToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.status !== 200) {
      console.log("revoke access failed Refresh token");
    } else {
      console.log("revoke access success refresh token");
    }
  }
  await prisma.users.update({
    where: {
      emailAddress: session?.user?.email || "",
    },
    data: {
      revokedAccess: true,
    },
  });
  return NextResponse.json({ message: "Access will be Revoked", status: 200 });
}