"use client";
import { AuthErrorBw } from "@/components/auth-error-bw";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <div>
      <AuthErrorBw onTryAgain={() => router.push("/login")} />
    </div>
  );
}
