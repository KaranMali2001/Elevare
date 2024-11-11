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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-300 ">
      <Card className="w-full max-w-md mx-4 bg-white  shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center text-gray-800 ">
            <AlertCircle className="w-6 h-6 mr-2 text-gray-600  animate-pulse" />
            Authentication Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600 mb-4">
            We encountered an issue during the authentication process.
          </p>
          <p className="text-center text-gray-600  mb-4">
            Do not worry, these things happen. We are here to help you get back
            on track.
          </p>
          <p className="text-center text-gray-700  font-semibold">
            Would you like to give it another try? Sometimes, thats all it
            takes!
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={onTryAgain}
            className="bg-gray-800 hover:bg-gray-900   text-white  font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 "
          >
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
