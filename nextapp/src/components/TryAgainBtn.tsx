"use client";
import { RefreshCw } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

function TryAgainBtn({ handler }: any) {
  const [isLoading, setIsLaoding] = useState(false);
  return (
    <Button
      onClick={() => {
        setIsLaoding(true);
        handler();
      }}
      variant="outline"
      className={`w-full sm:w-auto ${isLoading && "opacity-50 cursor-not-allowed"}`}
      disabled={isLoading}
    >
      <RefreshCw className="mr-2 h-4 w-4" />
      Try Again
    </Button>
  );
}

export default TryAgainBtn;
