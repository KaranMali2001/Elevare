"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Page() {
  const session = useSession();
  const router = useRouter();
  if (session.data?.user?.email) {
    router.push("/dashboard");
  }
  return <div>error</div>;
}
