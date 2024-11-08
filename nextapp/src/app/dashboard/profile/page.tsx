import { EnhancedProfilePageComponent } from "@/components/enhanced-profile-page";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

export default async function Page() {
  const session = await auth();

  const user: any = await prisma.users.findFirst({
    where: {
      emailAddress: session?.user?.email || "",
    },
  });
  const sentEmails = await prisma.analytics.findFirst({
    where: {
      userEmailAddress: session?.user?.email || "",
    },
    select: {
      totalSent: true,
    },
  });
  user.sentEmail = sentEmails?.totalSent;
  return <EnhancedProfilePageComponent user={user} />;
}
