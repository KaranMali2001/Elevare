import { DEFAULT_EMAIL } from "@/constants";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get("search") || "";

  const userEmailAddress = (await auth())?.user?.email || DEFAULT_EMAIL;
  console.log("email", userEmailAddress);
  const res = await prisma.emails.findMany({
    where: {
      userEmailAddress: userEmailAddress || "",
      OR: [
        {
          subject: { contains: query, mode: "insensitive" },
        },

        {
          shortSummary: { contains: query, mode: "insensitive" },
        },
        {
          from: { contains: query, mode: "insensitive" },
        },
      ],
    },
  });

  return NextResponse.json({ res });
}
