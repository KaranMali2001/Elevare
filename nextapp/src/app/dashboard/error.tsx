"use client"; // Error boundaries must be Client Components

import ErrorPage from "@/components/ui/ErrorPage";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const session = useSession();
  const router = useRouter();
  if (session.data?.user?.email) {
    console.log("session user is", session);
    router.push("/dashboard");
  }
  return <ErrorPage message={error.message} />;
}
