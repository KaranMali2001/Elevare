import { emailFullFormat } from "@/actions/getFullFormat";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const emailID = searchParams.get("id");
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("Token")?.value;

  const email = await emailFullFormat(emailID || "", accessToken || "");

  return NextResponse.json({ res: email });
};
