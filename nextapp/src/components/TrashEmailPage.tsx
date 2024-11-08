"use client";

import { fetchTrashMails } from "@/actions/fetchTrashMails";
import { trashEmailsAtom, trashNextPageToken } from "@/recoil/trashAtom";
import { dateFormatter } from "@/utils/dateFormatter";
import { decodeHTMLEntities } from "@/utils/decodeHTMLEntities";
import { textFromHtml } from "@/utils/textFromHtml";
import Link from "next/link";
import { useEffect, useTransition } from "react";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import SpinnerMini from "./SpinnerMini";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

function TrashEmailPage({
  trashMails,
  nextPageToken,
}: {
  trashMails: EmailFullFormat[];
  nextPageToken: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [displayMails, setDisplayMails] = useRecoilState(trashEmailsAtom);
  const [nextPageMailsToken, setNextPageMailsToken] =
    useRecoilState(trashNextPageToken);
  useEffect(() => {
    setDisplayMails((cur) => (cur.length === 0 ? [...trashMails] : [...cur]));
    setNextPageMailsToken((cur) => (cur.length === 0 ? nextPageToken : cur));
  }, []);
  function handleLoadMore(nextPage: string) {
    startTransition(async () => {
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
      }
    });
  }
  return (
    <div className="flex-1 flex flex-col my-2 ">
      {displayMails.length === 0 && nextPageMailsToken.length === 0 ? (
        <SpinnerMini />
      ) : (
        <ScrollArea className="flex-1 w-full">
          <div className="p-4 space-y-4">
            {displayMails.length > 0 ? (
              displayMails.map((email: EmailFullFormat, index: number) => (
                <Card
                  key={index}
                  className="relative w-full transition-all duration-300 ease-in-out hover:shadow-md hover:scale-[1.01] border border-gray-300"
                >
                  <CardContent className="p-4">
                    <Link href={`/dashboard/${email.id}`} className="flex-1">
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
                          {dateFormatter(email.date)}
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
            {
              <form
                className="py-2"
                action={() => {
                  handleLoadMore(nextPageMailsToken);
                }}
              >
                {nextPageMailsToken && (
                  <Button
                    disabled={isPending}
                    className={`${isPending && "opacity-50 cursor-not-allowed"}`}
                    type="submit"
                  >
                    {isPending ? <SpinnerMini /> : "Load more"}
                  </Button>
                )}
              </form>
            }
          </div>
        </ScrollArea>
      )}
    </div>
  );
}

export default TrashEmailPage;
