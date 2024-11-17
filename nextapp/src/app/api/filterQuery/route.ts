import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import decrypt from "@/utils/decrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const filter = body.filter;
  const session = await auth();

  let res: any = [];
  if (filter.includes("Others")) {
    const cat = await prisma.users.findUnique({
      where: {
        emailAddress: session?.user?.email || "",
      },
      select: {
        categories: true,
      },
    });
    const categories = cat?.categories.map((cat: string) => cat.toLowerCase());
    res = await prisma.emails.findMany({
      where: {
        userEmailAddress: session?.user?.email || "",
        category: {
          notIn: categories,
        },
      },
    });
  }

  for (let i = 0; i < filter.length; i++) {
    res.push(
      await prisma.emails.findMany({
        where: {
          userEmailAddress: session?.user?.email || "",
          category: filter[i].toLowerCase(),
        },
      }),
    );
  }
  res = res.flat();
  for (let i = 0; i < res.length; i++) {
    const decryptedLongSummary = await decrypt(res[i].longSummary || "");

    res[i].longSummary = decryptedLongSummary;
  }

  return NextResponse.json({ res });
}
