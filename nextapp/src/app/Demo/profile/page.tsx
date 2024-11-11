import { EnhancedProfilePageComponent } from "@/components/enhanced-profile-page";
import { DEFAULT_EMAIL } from "@/constants";
import prisma from "@/lib/db";
export const dynamic = "force-dynamic";
export default async function Page() {
  const user: any = await prisma.users.findFirst({
    where: {
      emailAddress: DEFAULT_EMAIL,
    },
  });
  const sentEmails = await prisma.analytics.findFirst({
    where: {
      userEmailAddress: DEFAULT_EMAIL,
    },
    select: {
      totalSent: true,
    },
  });
  console.log("user is ", user);
  user.sentEmail = sentEmails?.totalSent;
  return <EnhancedProfilePageComponent user={user} />;
}
