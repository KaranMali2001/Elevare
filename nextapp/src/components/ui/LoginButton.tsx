"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./button";

function LoginButton({ label }: { label: string }) {
  const router = useRouter();
  const [isLoading, setIsLaoding] = useState(false);
  const handleNavigation = (path: string = "/login") => {
    console.log("Clicked");
    setIsLaoding(true);
    router.push(path);
  };
  return (
    <Button
      onClick={() => handleNavigation()}
      className={`ml-4 bg-indigo-600 hover:bg-indigo-700 ${isLoading && "opacity-50 cursor-not-allowed"}`}
      disabled={isLoading}
    >
      {label}
    </Button>
  );
}

export default LoginButton;
