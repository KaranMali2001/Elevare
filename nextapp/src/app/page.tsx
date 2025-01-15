import { FloatingBanner } from "@/components/banner";
import { MailboxLandingPageComponent } from "@/components/mailbox-landing-page";
import axios from "axios";
export const dynamic = "force-dynamic";
export default async function Page() {
  try {
    await axios.get(`${process.env.LLM_URL}`);

    return <MailboxLandingPageComponent />;
  } catch (error) {
    return <FloatingBanner />;
  }
}
