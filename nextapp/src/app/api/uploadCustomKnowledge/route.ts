import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log("body", JSON.stringify(body));
  const res = await fetch(`${process.env.LLM_URL}P`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  console.log("res", await res.json());
  return NextResponse.json({ success: true });
}
