"use client";
import { fetchTrashMails } from "@/actions/fetchTrashMails";
import Skelton from "@/components/Skelton";
import SpinnerMini from "@/components/SpinnerMini";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { trashEmailsAtom, trashNextPageToken } from "@/recoil/trashAtom";
import { dateFormatter } from "@/utils/dateFormatter";
import { decodeHTMLEntities } from "@/utils/decodeHTMLEntities";
import { textFromHtml } from "@/utils/textFromHtml";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import "react-loading-skeleton/dist/skeleton.css";
import { useRecoilState } from "recoil";
function Page() {
  const [isPending, startTransition] = useTransition();
  const [initialLoad, setInitialLoad] = useState(true);
  const [displayMails, setDisplayMails] = useRecoilState(trashEmailsAtom);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [nextPageMailsToken, setNextPageMailsToken] =
    useRecoilState(trashNextPageToken);
  console.log("send Mails", displayMails);
  useEffect(() => {
    console.log("Hello");
    async function getTrashMails() {
      startTransition(async () => {
        if (displayMails.length == 0 && nextPageMailsToken === "InitialState") {
          const res = await (await fetch("/api/fetchTrashMails")).json();
          setDisplayMails((cur) => [...res.formattedEmails]);
          setNextPageMailsToken((cur) => res.pageToken);
          console.log("res", res);
        }
      });
    }
    getTrashMails();
    setInitialLoad(false);
  }, []);
  async function handleLoadMore(nextPage: string) {
    setIsLoadingMore(true);
    try {
      const res = await fetchTrashMails(nextPage);
      const { data, pageToken } = res;
      setDisplayMails((displayMails: EmailFullFormat[]) => [
        ...displayMails,
        ...data,
      ]);
      setNextPageMailsToken(pageToken);
    } catch (e) {
      toast.error("There some error while loading Send mails");
    } finally {
      setIsLoadingMore(false);
    }
  }
  if (initialLoad) return <Skelton />;
  return (
    <>
      {isPending == true ? (
        <Skelton />
      ) : (
        <div className="flex-1 flex flex-col my-2 ">
          <ScrollArea className="flex-1 w-full">
            <div className="p-4 space-y-4">
              {displayMails.length > 0 ? (
                displayMails.map((email: EmailFullFormat, index: number) => (
                  <Card
                    key={index}
                    className="relative w-full transition-all duration-300 ease-in-out hover:shadow-md hover:scale-[1.01] border border-gray-300"
                  >
                    <CardContent className="p-4">
                      <Link
                        href={`/dashboard/id?id=${email.id}`}
                        className="flex-1"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold opacity-70 tracking-wider">
                              Sender: {email.from}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {textFromHtml(email.subject)}
                            </p>
                          </div>
                          <span className="text-xs text-gray-400 ">
                            {dateFormatter(email.date.toString())}
                            {email.date.toLocaleString()}
                          </span>
                        </div>

                        <p className="mt-2 text-base tracking-wide">
                          {decodeHTMLEntities(email.snippet)}
                        </p>
                      </Link>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <h2 className="text-xl">No mails to show</h2>
              )}
              {nextPageMailsToken !== "InitialState" &&
                nextPageMailsToken !== "" && (
                  <Button
                    disabled={isLoadingMore}
                    className={`p-2 ${isLoadingMore && "opacity-50 cursor-not-allowed"}`}
                    type="submit"
                    onClick={() => {
                      handleLoadMore(nextPageMailsToken);
                    }}
                  >
                    {isLoadingMore ? <SpinnerMini /> : "Load more"}
                  </Button>
                )}
            </div>
          </ScrollArea>
        </div>
      )}
    </>
  );
}

export default Page;
