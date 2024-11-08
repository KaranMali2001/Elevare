"use client";

import { getMailsSendViaElevare } from "@/actions/getMailsSendViaElevare";
import Skelton from "@/components/Skelton";
import SpinnerMini from "@/components/SpinnerMini";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  maxSendMailCount,
  sendEmailsAtom,
  sendEmailsDBpageNumber,
} from "@/recoil/sendAtom";
import { dateFormatter } from "@/utils/dateFormatter";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";

function Page() {
  const [sendEmails, setSendEmails] = useRecoilState(sendEmailsAtom);
  const [pageNumber, setPageNumber] = useRecoilState(sendEmailsDBpageNumber);
  const [maxCountOfEmails, setMaxCountOfEmails] =
    useRecoilState(maxSendMailCount);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function getMails() {
      const res = await fetch(`/api/fetchSendEmails?pageNumber=${pageNumber}`);
      const res2 = await res.json();

      setSendEmails((sendEmails) => {
        if (sendEmails.length === 0) return [...res2.res];
        else return [...sendEmails];
      });
      setPageNumber((cur) => {
        return cur === 1 ? cur + 1 : cur;
      });
    }
    async function getMailCnt() {
      const res = await (await fetch("/api/maxMailCount")).json();

      setMaxCountOfEmails((cur) => (cur === 0 ? res.emailCount : cur));
    }

    startTransition(async () => {
      if (sendEmails.length === 0) await getMails();
      if (maxCountOfEmails === 0) await getMailCnt();
    });
    setInitialLoad(false);
  }, []);
  async function handleLoadMore() {
    setIsLoadingMore(true);
    try {
      const res = await getMailsSendViaElevare(pageNumber);
      setSendEmails((sendEmails) => {
        return [...sendEmails, ...res];
      });
      setPageNumber((cur) => cur + 1);
    } catch (e) {
      toast.error("error while loading more send mails");
    } finally {
      setIsLoadingMore(false);
    }
  }
  if (initialLoad) return <Skelton />;

  if (isPending) return <Skelton />;
  return (
    <div className="flex-1 flex flex-col my-2 ">
      <ScrollArea className="flex-1 w-full">
        <div className="p-4 space-y-4">
          {sendEmails.length > 0 ? (
            sendEmails.map((email: any, index: number) => (
              <Card
                key={index}
                className="relative w-full transition-all duration-300 ease-in-out hover:shadow-md hover:scale-[1.01] border border-gray-300"
              >
                <CardContent className="p-4">
                  <Link
                    href={`/dashboard/id?id=${email.threadId}`}
                    className="flex-1"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold opacity-70 tracking-wider">
                          To: {email.to}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {email.generatedSubject}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 ">
                        {dateFormatter(email.generatedTimeStamp)}
                      </span>
                    </div>

                    <p className="mt-2 text-base tracking-wide">
                      {email?.generatedResponse}
                    </p>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <h2 className="text-xl">No mails to show</h2>
          )}
          {
            <form
              className="py-2"
              action={() => {
                handleLoadMore();
              }}
            >
              {sendEmails.length < maxCountOfEmails && (
                <Button
                  disabled={isPending}
                  className={`${isPending && "opacity-50 cursor-not-allowed"}`}
                  type="submit"
                >
                  {isLoadingMore ? <SpinnerMini /> : "Load more"}
                </Button>
              )}
            </form>
          }
        </div>
      </ScrollArea>
    </div>
  );
}

export default Page;
