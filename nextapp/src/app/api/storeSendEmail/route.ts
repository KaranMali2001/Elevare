import { storeSendMail } from "@/utils/storeSendMails";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const res = await storeSendMail(body);
  return NextResponse.json({ res });
}
