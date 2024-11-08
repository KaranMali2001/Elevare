import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/db";
import axios from "axios";

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body) {
    return NextResponse.json({ message: "Body is empty" }, { status: 400 });
  }

  try {
    let res = await prisma.userFiles.create({
      data: {
        fileName: body.fileName,
        filePath: body.url,
        fileType: body.fileType,
        emailAddress: body.emailAddress,
      },
    });
    const llmCustomKnowledgeType = {
      file_url: body.url,
      file_name: body.fileName,
      type: body.fileType,
      user_name: body.emailAddress,
    };

    res = await axios.post(
      process.env.LLM_URL + "api/post/add_custom_knowledge/",
      llmCustomKnowledgeType,
    );

    return NextResponse.json(
      { message: "Post request successful" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error while creating Prisma entry" },
      { status: 500 },
    );
  }
}
