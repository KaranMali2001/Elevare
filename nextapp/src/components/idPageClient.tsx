"use client";
import getEmailIdsByThreadId from "@/actions/getEmailIdsByThreadId";
import IdPageGenerateNav from "@/components/IdPageGenerateNav";
import { EmailPage } from "@/components/email-page";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sideBarOpen } from "@/recoil/atom";
import { ArrowLeft, ChevronDown, ChevronLeft, ChevronUp } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";

export default function IdPageClient() {
  const [isResponseBoxOpen, setIsResponseBoxOpen] = useState(true);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(true);
  const [threadSummery, setThreadSummery] = useState("");
  const [threadEmails, setThreadEmails] = useState<EmailFullFormat[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSiderBarOpen, setIsSideBarOpen] = useRecoilState(sideBarOpen);
  const [currentEmail, setCurrentEmail] = useState<EmailFullFormat>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = usePathname();
  const threadId = searchParams.get("id");
  useEffect(() => {
    const fetchEmailsByThreadId = async () => {
      try {
        const messages = await getEmailIdsByThreadId(threadId!);
        console.log("messages", messages);
        setThreadEmails(messages);
        setCurrentEmail(messages.at(-1));
        let latestNonSentEmailID;
        for (let i = messages.length - 1; i >= 0; i--) {
          if (!messages[i].labels.includes("SENT")) {
            latestNonSentEmailID = messages[i].id;
            break;
          }
        }
        console.log("latest not send email", latestNonSentEmailID);
        const res2 = await fetch("/api/getThreadSummery", {
          method: "POST",
          body: JSON.stringify({ latestNonSentEmailID, threadId, url }),
        });
        console.log("res2 is ingdasgsgaga", res2);
        const data = await res2.json();
        console.log("data", data);
        setThreadSummery(data);
      } catch (error) {
        toast.error("Failed to Summary Thread ");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (threadId) {
      fetchEmailsByThreadId();
    }
    setIsSideBarOpen(false);
  }, [threadId]);

  if (loading) return <LoadingSkeleton />;

  return (
    <div
      className={`grid  w-full bg-gray-100 ${isResponseBoxOpen ? "grid-cols-[1.25fr,1fr]" : "grid-cols-1"}`}
    >
      <ScrollArea>
        <div
          className={`flex gap-3 flex-col transition-all duration-300 ease-in-out `}
        >
          <div className="bg-white border-b sticky top-0 z-10 shadow-md">
            <div className="p-4 flex items-center justify-between">
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
                aria-expanded={isSummaryExpanded}
                aria-controls="summary-content"
              >
                {isSummaryExpanded ? "Hide Summary" : "Show Summary"}
                {isSummaryExpanded ? (
                  <ChevronUp className="ml-2 h-4 w-4" />
                ) : (
                  <ChevronDown className="ml-2 h-4 w-4" />
                )}
              </Button>
              {!isResponseBoxOpen && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsResponseBoxOpen(true)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div
              id="summary-content"
              className={`px-6 pb-4 ${isSummaryExpanded ? "" : "hidden"}`}
            >
              <h2 className="text-3xl font-bold text-primary">
                Thread Summary
              </h2>
              <div className="text-lg text-muted-foreground mt-2">
                <div
                  className="text-xl font-bold"
                  dangerouslySetInnerHTML={{ __html: threadSummery || "" }}
                />
              </div>
            </div>
          </div>
          <ScrollArea>
            {threadEmails.map((mail, i) => (
              <EmailPage key={mail.id} mail={mail} />
            ))}
          </ScrollArea>
        </div>
      </ScrollArea>
      {isResponseBoxOpen && (
        <IdPageGenerateNav
          setIsResponseBoxOpen={setIsResponseBoxOpen}
          //@ts-ignore
          currentEmail={currentEmail}
          url={url}
        />
      )}
    </div>
  );
}
