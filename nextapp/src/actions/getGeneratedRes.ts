"use server";

import { GENERATE_LIMIT } from "@/constants";
import prisma from "@/lib/db";

export async function getGeneratedRes(ReqObject: generatedResponse) {
  //checking condition that if generated count is greater
  const res = await prisma.analytics.findFirst({
    where: {
      userEmailAddress: ReqObject.username,
    },
    select: {
      dailyGeneratedCount: true,
    },
  });

  if (res?.dailyGeneratedCount && res?.dailyGeneratedCount >= GENERATE_LIMIT) {
    console.log("daily target for generator is reached");
    throw new Error(`Daily generated count is greater than ${GENERATE_LIMIT}`);
  }
  try {
    //@ts-ignore

    if (ReqObject.data.previous_body === undefined || null) {
      const res = await fetch(`${process.env.LLM_URL}api/post/compose/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensure the server knows to expect JSON
        },
        body: JSON.stringify(ReqObject), // Convert the request object to JSON
      });
      if (!res.ok) throw new Error(JSON.stringify(await res.json()));
      const data = await res.json();

      const res2 = await prisma.analytics.update({
        where: {
          userEmailAddress: ReqObject.username,
        },
        data: {
          dailyGeneratedCount: { increment: 1 },
          totalGenerated: { increment: 1 },
        },
      });
      console.log("res from generate without analytics is ", res2);
      return data.response;
    } else {
      const res = await fetch(
        //error in this line
        `${process.env.LLM_URL}api/post/genrate/without_thread/ `,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Ensure the server knows to expect JSON
          },
          body: JSON.stringify(ReqObject), // Convert the request object to JSON
        },
      );

      if (!res.ok) throw new Error(JSON.stringify(await res.json()));
      const data = await res.json();

      const res2 = await prisma.analytics.update({
        where: {
          userEmailAddress: ReqObject.username,
        },
        data: {
          dailyGeneratedCount: { increment: 1 },
          totalGenerated: { increment: 1 },
        },
      });

      console.log("res from generate without analytics is ", res2);

      return data.response;
    }
  } catch (error) {
    throw error;
  }
}
