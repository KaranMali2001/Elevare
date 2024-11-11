import { EmailAnalyticsDashboard } from "@/components/email-analytics-dashboard";
import { DEFAULT_EMAIL } from "@/constants";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
export const dynamic = "force-dynamic";
// Helper function to convert date to IST
const toIST = (date: Date) => {
  return new Date(date.getTime() + (5 * 60 + 30) * 60 * 1000); // Convert to IST (+5:30)
};

export default async function Page() {
  const userEmailAddress = DEFAULT_EMAIL;
  let emailActivityHeatmap: any = [];

  // Query for total summarized emails
  const totalSummerizedEmails = await prisma.analytics.findFirst({
    where: {
      userEmailAddress: userEmailAddress!,
    },
    select: {
      totalSummerized: true,
    },
  });

  // Query for total generated emails
  const totalGeneratedEmails = await prisma.analytics.findFirst({
    where: {
      userEmailAddress: userEmailAddress!,
    },
    select: {
      totalGenerated: true,
    },
  });

  // Query for total sent emails
  const totalSentEmails = await prisma.analytics.count({
    where: {
      userEmailAddress: userEmailAddress!,
    },
    select: {
      totalSent: true,
    },
  });

  // Category Data
  const categoryData: { name: string; value: number }[] = [];
  {
    const categories = await prisma.emails.findMany({
      where: {
        userEmailAddress: userEmailAddress!,
      },
      select: {
        category: true,
      },
    });

    const allCategories = categories.flatMap((item) => item.category);
    const uniqueCategory = allCategories.filter(
      (item, index) => allCategories.indexOf(item) === index
    );

    await Promise.all(
      uniqueCategory.map(async (category) => {
        const res = await prisma.emails.count({
          where: {
            category: category,
          },
        });
        categoryData.push({ name: category!, value: res });
      })
    );
  }

  // Email Volume Data
  const emailVolumeData = [
    { day: "Mon", count: 0 },
    { day: "Tue", count: 0 },
    { day: "Wed", count: 0 },
    { day: "Thu", count: 0 },
    { day: "Fri", count: 0 },
    { day: "Sat", count: 0 },
    { day: "Sun", count: 0 },
  ];

  const res2 = await prisma.emails.findMany({
    where: {
      userEmailAddress: userEmailAddress!,
    },
    select: {
      date: true,
    },
  });

  // Adjust dates to IST before extracting the weekday
  const emailVolume = res2.map((cur) => {
    const emailDate = new Date(cur.date || "");
    const emailIST = toIST(emailDate); // Convert to IST

    // Get the weekday in IST
    return emailIST.toLocaleString("en-US", { weekday: "short" });
  });

  for (let i = 0; i < emailVolume.length; i++) {
    switch (emailVolume[i]) {
      case "Mon":
        emailVolumeData[0].count += 1;
        break;
      case "Tue":
        emailVolumeData[1].count += 1;
        break;
      case "Wed":
        emailVolumeData[2].count += 1;
        break;
      case "Thu":
        emailVolumeData[3].count += 1;
        break;
      case "Fri":
        emailVolumeData[4].count += 1;
        break;
      case "Sat":
        emailVolumeData[5].count += 1;
        break;
      case "Sun":
        emailVolumeData[6].count += 1;
        break;
    }
  }

  const responseTimeData = [
    { category: "Within 1 hour", percentage: 30 },
    { category: "1-4 hours", percentage: 40 },
    { category: "4-24 hours", percentage: 20 },
    { category: "Over 24 hours", percentage: 10 },
  ];

  // Top Contacts
  const topContacts = await prisma.emails.groupBy({
    by: ["from"],
    _count: {
      from: true,
    },
    where: {
      userEmailAddress: userEmailAddress || "",
    },
    orderBy: {
      _count: {
        from: "desc",
      },
    },
  });

  const topContactsData = topContacts.slice(0, 4).map((contact) => ({
    name: contact.from || "",
    count: contact._count.from,
  }));

  // Sentiment Analysis
  const sentimentAnalysis = await prisma.emails.groupBy({
    by: ["sentiment"],
    _count: {
      sentiment: true,
    },
    where: {
      userEmailAddress: userEmailAddress as string,
    },
  });

  // Email volume by hour
  const emailHours = await prisma.emails.findMany({
    where: {
      userEmailAddress: userEmailAddress as string,
    },
    select: {
      date: true,
    },
  });

  const emailVolumeByHour = emailHours.reduce((acc: any, email: any) => {
    const emailDate = toIST(new Date(email.date)); // Convert to IST
    const hour = emailDate.getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {});

  // Combine hourly data
  function combineHourlyData(mailHours: any) {
    const combinedHours = [
      {
        hours: "",
        count: 0,
      },
    ];

    for (let i = 0; i < 24; i += 2) {
      const hourCount1 = mailHours[i] || 0;
      const hourCount2 = mailHours[i + 1] || 0;
      const hr = String(i);
      combinedHours.push({
        hours: hr,
        count: hourCount1 + hourCount2,
      });
    }

    return combinedHours;
  }

  const final = combineHourlyData(emailVolumeByHour).slice(1);

  // Email heatmap
  const emailsData = await prisma.emails.findMany({
    where: {
      userEmailAddress: userEmailAddress as string,
    },
    select: {
      date: true,
    },
  });

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  emailActivityHeatmap = days.map((day) => ({
    name: day,
    "00-04": 0,
    "04-08": 0,
    "08-12": 0,
    "12-16": 0,
    "16-20": 0,
    "20-24": 0,
  }));

  emailsData.forEach((email) => {
    const emailDate = new Date(email.date || "");
    const emailIST = toIST(emailDate);

    const dayIndex = emailIST.getUTCDay();
    const dayName = days[dayIndex === 0 ? 6 : dayIndex - 1];

    const hour = emailIST.getUTCHours();

    let timeSlot = "";
    if (hour >= 0 && hour < 4) timeSlot = "00-04";
    else if (hour >= 4 && hour < 8) timeSlot = "04-08";
    else if (hour >= 8 && hour < 12) timeSlot = "08-12";
    else if (hour >= 12 && hour < 16) timeSlot = "12-16";
    else if (hour >= 16 && hour < 20) timeSlot = "16-20";
    else if (hour >= 20 && hour < 24) timeSlot = "20-24";

    const dayData: any = emailActivityHeatmap.find(
      (day: any) => day.name === dayName
    );
    if (dayData) {
      dayData[timeSlot] += 1;
    }
  });
  const thread = await prisma.threads.findMany({
    where: {
      userEmailAddress: userEmailAddress as string,
    },
    select: {
      threadMailCount: true,
    },
  });

  const threadAnalysis = [
    { name: "Single Email", value: 0 },
    { name: "2-5 Emails", value: 0 },
    { name: "6-10 Emails", value: 0 },
    { name: "11+ Emails", value: 0 },
  ];
  thread.map((item) => {
    if (item.threadMailCount === 1) {
      threadAnalysis[0].value += 1;
    } else if (item.threadMailCount >= 2 && item.threadMailCount <= 5) {
      threadAnalysis[1].value += 1;
    } else if (item.threadMailCount >= 6 && item.threadMailCount <= 10) {
      threadAnalysis[2].value += 1;
    } else if (item.threadMailCount >= 11) {
      threadAnalysis[3].value += 1;
    }
  });
  console.log("threadAnalysis", threadAnalysis);
  return (
    <EmailAnalyticsDashboard
      threadAnalysis={threadAnalysis}
      totalGeneratedEmails={totalGeneratedEmails?.totalGenerated}
      totalSummerizedEmails={totalSummerizedEmails?.totalSummerized}
      totalSentEmails={totalSentEmails.totalSent}
      emailVolumeDataByDay={emailVolumeData}
      responseTimeData={responseTimeData}
      topContactsData={topContactsData}
      categoryData={categoryData}
      sentimentAnalysis={sentimentAnalysis}
      emailVolumeByHour={final}
      emailActivityHeatmap={emailActivityHeatmap}
    />
  );
}
