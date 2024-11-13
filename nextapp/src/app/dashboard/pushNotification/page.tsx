"use client";
import { AuthErrorBw } from "@/components/auth-error-bw";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { useState } from "react";

function Page() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const session = useSession();
  const router = useRouter();
  if (
    session?.data?.user?.email !== "karansignup5599@gmail.com" &&
    session?.data?.user?.email !== "techkaran5599@gmail.com"
  ) {
    return (
      <div>
        <AuthErrorBw
          onTryAgain={() => {
            router.push("/");
          }}
        />
      </div>
    );
  }
  async function postNotification() {
    const res = await fetch("/api/pushNotification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        description: description,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to post notification");
    }
  }
  return (
    <div>
      <h1>Push Notification</h1>
      <p>This is the push notification page.</p>
      <input
        type="text"
        placeholder="Enter Title To notify"
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      <input
        type="text"
        placeholder="Enter Description To notify"
        onChange={(e) => setDescription(e.target.value)}
      />
      <br />
      <Button
        className=" bg-black text-white"
        variant={"secondary"}
        onClick={postNotification}
      >
        Post Notification
      </Button>
    </div>
  );
}

export default Page;
