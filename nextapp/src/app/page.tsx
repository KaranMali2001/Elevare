import { MailboxLandingPageComponent } from "@/components/mailbox-landing-page";

export default async function Page() {
  const request = await fetch(
    `https://ipinfo.io/json?token=${process.env.IP_TOKEN_INFO}`
  );
  const jsonResponse = await request.json();

  console.log("hello", jsonResponse.ip, jsonResponse.country);
  console.log("ADDED FOR TESTING OF CODE RABBIT");
  return (
    <>
      <MailboxLandingPageComponent />
    </>
  );
}
