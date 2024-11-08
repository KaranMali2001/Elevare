// import React from 'react'
"use client";
import { Button } from "@/components/ui/button";
import { Mail, AlertTriangle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface ErrorPageProps {
  statusCode?: number;
  message?: string;
}

export default function ErrorPage({
  statusCode = 400,
  message = "Oops! There is some error.",
}: ErrorPageProps) {
  const router = useRouter();
  const [isLoading, startTransition] = useTransition();
  const handleTryAgain = () => {
    startTransition(() => router.refresh());
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-8">
          <Mail className="h-16 w-16 text-indigo-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Error {statusCode}
          </h1>
          <p className="text-xl text-gray-600">{message}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button
            onClick={handleTryAgain}
            variant="outline"
            className={`w-full sm:w-auto ${isLoading && "opacity-50 cursor-not-allowed"}`}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button
            asChild
            className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-600"
          >
            <Link href="/support">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Contact support
            </Link>
          </Button>
        </div>
      </div>
      <div className="mt-16 text-center">
        <p className="text-sm text-gray-500">
          If you believe this is a mistake, please contact our support team.
        </p>
      </div>
    </div>
  );
}
