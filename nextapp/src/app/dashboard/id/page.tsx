"use client";
import getEmailIdsByThreadId from "@/actions/getEmailIdsByThreadId";
import IdPageGenerateNav from "@/components/IdPageGenerateNav";
import { EmailPage } from "@/components/email-page";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sideBarOpen } from "@/recoil/atom";
import { ArrowLeft, ChevronDown, ChevronLeft, ChevronUp } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";

type Message = {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  sizeEstimate: number;
  historyId: string;
  internalDate: string;
};

export default function EmailClient() {
  const [isResponseBoxOpen, setIsResponseBoxOpen] = useState(true);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [threadSummery, setThreadSummery] = useState("");
  const [emailIds, setEmailIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSiderBarOpen, setIsSideBarOpen] = useRecoilState(sideBarOpen);
  // const [emails, setEmails] = useRecoilState(emailsAtom);
  const [currentEmail, setCurrentEmail] = useState<EmailFullFormat>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const threadId = searchParams.get("id");
  useEffect(() => {
    const fetchEmailsByThreadId = async () => {
      try {
        const { messages } = await getEmailIdsByThreadId(threadId!);

        const ids = messages.map((message: Message) => message.id);

        setEmailIds(ids);
        const response = await fetch(`/api/emailFullFormat?id=${ids.at(-1)}`);
        const { res } = await response.json();
        setCurrentEmail(res);
        const res2 = await fetch("/api/getThreadSummery", {
          method: "POST",
          body: JSON.stringify({ ids, threadId }),
        });
        const data = await res2.json();
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
            {emailIds.map((mailID, i) => (
              <EmailPage key={mailID} id={mailID} />
            ))}
          </ScrollArea>
        </div>
      </ScrollArea>
      {isResponseBoxOpen ? (
        <IdPageGenerateNav
          setIsResponseBoxOpen={setIsResponseBoxOpen}
          //@ts-ignore
          currentEmail={currentEmail}
        />
      ) : null}
    </div>
  );
}
