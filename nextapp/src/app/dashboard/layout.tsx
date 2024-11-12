import DashboardHeader from "@/components/DashboardHeader";
import SideBar from "@/components/SideBar";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

async function layout({ children }: any) {
  const session = await auth();
  const res = await prisma.users.findFirst({
    where: {
      emailAddress: session?.user?.email || "",
    },
    select: {
      emailsCnt: true,
      categories: true,
    },
  });
  const categories = res?.categories || [];
  //IMP we will fetch it from db
  return (
    <>
      <DashboardHeader />
      <div className="flex h-[91vh] relative overflow-hidden bg-[rgb(242,242,247)] ">
        <SideBar categories={categories} mailCount={res?.emailsCnt || 0} />
        {children}
      </div>
    </>
  );
}

export default layout;
