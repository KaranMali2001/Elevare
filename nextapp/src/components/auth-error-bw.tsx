"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export function AuthErrorBw({ onTryAgain }: { onTryAgain: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-700">
      <Card className="w-full max-w-md mx-4 bg-white dark:bg-gray-800 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center text-gray-800 dark:text-gray-100">
            <AlertCircle className="w-6 h-6 mr-2 text-gray-600 dark:text-gray-300 animate-pulse" />
            Authentication Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
            We encountered an issue during the authentication process.
          </p>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
            Do not worry, these things happen. We are here to help you get back
            on track.
          </p>
          <p className="text-center text-gray-700 dark:text-gray-200 font-semibold">
            Would you like to give it another try? Sometimes, thats all it
            takes!
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={onTryAgain}
            className="bg-gray-800 hover:bg-gray-900 dark:bg-gray-200 dark:hover:bg-gray-100 text-white dark:text-gray-800 font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-300"
          >
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
