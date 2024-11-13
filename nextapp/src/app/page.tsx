import { MailboxLandingPageComponent } from "@/components/mailbox-landing-page";
import prisma from "@/lib/db";

export default async function Page() {
  // async function revokeAccessToken() {
  //   // Revoke the token using Google's revocation endpoint
  //   const res = await fetch("https://oauth2.googleapis.com/revoke", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //     },
  //     body: `token="1//0gs8fibewClNdCgYIARAAGBASNwF-L9IrIt1Q-EMDcdOX4x3AIXGhlakYmRgmto0ovfNRIHdmZOOa78gMCKg8z_4-5cvxLKi_1-g`,
  //   });
  //   console.log(res);
  // }
  // await revokeAccessToken();

  return (
    <>
      <MailboxLandingPageComponent />
    </>
  );
}
