import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

import PDFDocument from "pdfkit";
import { NextRequest, NextResponse } from "next/server";
import { PassThrough } from "stream";
import { uploadFile } from "@/actions/uploadFile";
import { ObjectCannedACL, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/awsSDK";

export async function POST(req: NextRequest) {
  const { startDate, endDate } = await req.json();
  const session = await auth();
  const email = session?.user?.email;
  const start = new Date(startDate);
  const end = new Date(endDate);

  const res = await prisma.emails.findMany({
    where: {
      userEmailAddress: email || "",
      date: {
        gte: start,
        lte: end,
      },
    },
  });

  const pdfStream = new PassThrough();

  const pdfDoc = new PDFDocument({
    font: "./public/fonts/Helvetica.ttf",
  });

  pdfDoc.pipe(pdfStream);

  const headers = [
    "Subject",
    "Date",
    "From",
    "Summary",
    "Sentiment",
    "Tone",
    "Labels",
  ];

  const columnWidths = [100, 150, 80, 100, 150, 80, 60, 100];
  const startX = 50;
  let currentY = 100;
  headers.forEach((header: any, index: any) => {
    pdfDoc.text(
      header,
      startX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0),
      currentY,
      {
        width: columnWidths[index],
        underline: true,
      }
    );
  });
  currentY += 20;
  res.forEach((mail: any) => {
    const rawData = [
      mail.subject,
      mail.date,
      mail.from,
      mail.longSummary,
      mail.sentiment,
      mail.tone,
    ];
    rawData.forEach((data: any, index: any) => {
      pdfDoc.text(
        data || "N/A",
        startX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0),
        currentY
      );
    });
    currentY += 20;
    if (currentY > 700) {
      // Check for page overflow
      pdfDoc.addPage();
      currentY = 50;
    }
  });

  pdfDoc.end();
  const params = {
    Bucket: "custom-knowledge", // Replace with your Vultr bucket name
    Key: `${email}/${Date.now().toLocaleString("en-IN")}.pdf`, // The key (or name) of the file in the bucket
    Body: pdfStream, // The file content
    ContentType: "pdf", // Set the content type
    ACL: ObjectCannedACL.public_read, // Make the file publicly accessible
  };
  const url = "https://blr1.vultrobjects.com/exportData";
  try {
    console.log("file url is ", url);
    const command = new PutObjectCommand(params);
    const data = await s3.send(command);
    console.log("File uploaded successfully:", data);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
  return NextResponse.json(pdfStream, {
    status: 200,
  });
}
