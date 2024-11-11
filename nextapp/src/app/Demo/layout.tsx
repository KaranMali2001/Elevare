import DashboardHeader from "@/components/DashboardHeader";
import SideBar from "@/components/SideBar";
import { DEFAULT_EMAIL } from "@/constants";
import prisma from "@/lib/db";

async function layout({ children }: any) {
  const res = await prisma.users.findFirst({
    where: {
      emailAddress: DEFAULT_EMAIL,
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
      <DashboardHeader />{" "}
      <div className="flex h-[91vh] overflow-hidden bg-[rgb(242,242,247)] ">
        <SideBar categories={categories} mailCount={res?.emailsCnt || 0} />
        {children}
      </div>
    </>
  );
}

export default layout;
