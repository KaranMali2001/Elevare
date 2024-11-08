"use client";
import { signInAction } from "@/actions/authAction";
import Image from "next/image";
import { useState } from "react";

function SignInButton() {
  const [isLoading, setIsLaoding] = useState(false);
  return (
    <form>
      <button
        onClick={() => {
          setIsLaoding(true);
          signInAction();
        }}
        className={`flex items-center gap-6 text-lg border text-white border-primary-300 px-10 py-4 font-medium bg-black ${isLoading && "opacity-50 cursor-not-allowed"}`}
        disabled={isLoading}
      >
        <Image
          src="https://authjs.dev/img/providers/google.svg"
          alt="Google logo"
          height="24"
          width="24"
        />
        <span>Continue with Google</span>
      </button>
    </form>
  );
}

export default SignInButton;
