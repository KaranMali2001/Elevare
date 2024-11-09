import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("body is ", body);
  const res = await (
    await fetch(`${process.env.LLM_URL}api/chat/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
  ).json();
  console.log("res", res);
  return NextResponse.json(res[1].content);
}
