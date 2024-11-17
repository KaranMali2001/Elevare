import { formatEmailInEmailFullFormat } from "@/utils/formatEmailInEmailFullFormat";
import { NextResponse } from "next/server";
import "server-only";
export async function emailFullFormat(
  id: string,
  accessToken: string,
  requestFrom?: string,
) {
  if (!accessToken || !id) {
    return NextResponse.json(
      { error: "Access token and email ID are required" },
      { status: 400 },
    );
  }
  try {
    const response = await fetch(
      `https://www.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch email details");
    }

    const data = await response.json();
    // console.log("email full format", data.payload.parts.parts);
    let email: EmailFullFormat = await formatEmailInEmailFullFormat(data);

    if (requestFrom === "idPage") return NextResponse.json({ res: email });
    else return email;
  } catch (error: any) {
    if (requestFrom === "idPage") return NextResponse.json({ res: error });
    else return error;
  }
}
