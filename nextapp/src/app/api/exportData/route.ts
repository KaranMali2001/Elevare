import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

import PDFDocument from "pdfkit";
import { NextRequest, NextResponse } from "next/server";
import { PassThrough } from "stream";

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
  console.log("before pdf");
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
  return NextResponse.json(pdfStream, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=exported_data.pdf",
    },
  });
}
