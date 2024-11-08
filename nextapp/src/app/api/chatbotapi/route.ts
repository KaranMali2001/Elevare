import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await (
    await fetch(`${process.env.LLM_URL}api/post/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: body }),
    })
  ).json();
  console.log("res", res);
  return NextResponse.json(res);
}
