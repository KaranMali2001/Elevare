import { MailboxLandingPageComponent } from "@/components/mailbox-landing-page";
export const dynamic = "force-dynamic";
export default async function Page() {
  try {
    // await axios.get(`${process.env.LLM_URL}`);

    return <MailboxLandingPageComponent />;
  } catch (error) {
    // return <FloatingBanner />;
  }
}
