"use client";

import { getGeneratedRes } from "@/actions/getGeneratedRes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, Trash2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

import { getEmailsWithPaginationFromDB } from "@/actions/getEmailsWithPaginationFromDB";
import sendMail from "@/actions/sendMail";
import {
  categoryfilter,
  dbPageNumberAtom,
  emailsAtom,
  sideBarOpen,
  tab,
} from "@/recoil/atom";
import { dateFormatter } from "@/utils/dateFormatter";
import { getDashBoardMailsFromQueueElement } from "@/utils/getDashBoardMailsFromQueueElement";
import { getOneEmailForOneThread } from "@/utils/getOneEmailForOneThread";
import { getToken } from "@/utils/getToken";
import { storeRealTimeEmails } from "@/utils/storeRealTimeEmails";
import axios from "axios";
import { getCookie, setCookie } from "cookies-next";

import { DEFAULT_EMAIL } from "@/constants";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import GenerateCustomizationOptions from "./GenerateCustomizationOptions";
import ModalBody from "./ModalBody";
import ModalHeader from "./ModalHeader";
import ModalWindowContainer from "./ModalWindowContainer";
import Overlay from "./Overlay";
import Skelton from "./Skelton";
import SpinnerMini from "./SpinnerMini";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
export function EmailClientComponent({
  mails,
  queue,
  dbMailCnt,
  PageNumber,
  firstTimeFetched,
  threadIdSet,
  categories,
}: {
  mails: DashBoardEmail[];
  queue: EmailFullFormat[][];
  dbMailCnt: number;
  PageNumber: number | undefined;
  firstTimeFetched: boolean;
  threadIdSet: Set<string>;
  categories: Set<string>;
}) {
  let userEmailAddress: string;
  const url = usePathname();
  const session = useSession();

  if (url.startsWith("/Demo")) {
    userEmailAddress = DEFAULT_EMAIL;
  } else {
    userEmailAddress = session.data?.user?.email || "";
  }
  // recoil states
  const [emails, setEmails] = useRecoilState(emailsAtom);
  const [dbPageNumber, setdbPageNumber] = useRecoilState(dbPageNumberAtom);
  const [filter, setFilter] = useRecoilState(categoryfilter);
  const [isSideBarOpen, setIsSideBarOpen] = useRecoilState(sideBarOpen);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // useStates
  const [filteredMails, setFilteredMails] = useState<any[]>([]);
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [isQuickReplyOpen, setIsQuickReplyOpen] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [currentEmail, setCurrentEmail] = useState<DashBoardEmail>();
  const [isFilteringMails, setIsFilteringMails] = useState(false);
  const [generatedText, setGeneratedText] = useState<{
    subject: string;
    body: string;
  }>({ subject: "", body: "" });
  const [reqBody, setReqBody] = useState({
    response_writing_style: "normal",
    compose_language: "English",
    format: "text",

    response_tone: "Official",
    length: "medium",
  });
  const [displayMails, setDisplayMails] = useState(emails);
  const [isPending, statTransition] = useTransition();
  const [curTab, setCurTab] = useRecoilState(tab);

  useEffect(() => {
    const expiresAt = Number(getCookie("expiresAt") || 0);
    if (Date.now() > Number(expiresAt)) {
      console.log("Hii");
      //@ts-ignore
      async function getAccesToken() {
        const accesToken = await getToken(url);
        setCookie("Token", accesToken);
        setCookie("expiresAt", String(new Date().getTime() + 3600000));
      }
      getAccesToken();
    }
    setInitialLoad(false);
  }, []);
  useEffect(() => {
    if (filter.size === 0) {
      setDisplayMails((cur) => [...emails]);

      return;
    }
    async function filterQuery() {
      setIsFilteringMails(true);
      try {
        const res = await fetch("/api/filterQuery", {
          method: "POST",
          //@ts-ignore
          body: JSON.stringify({ filter: [...filter] }),
        });
        const res2 = await res.json();

        setFilteredMails((cur) => [...res2.res]);
        if (filter.has("Others")) {
        }
      } catch (e) {
        toast.error("there is some error while updating display mails");
      } finally {
        setIsFilteringMails(false);
      }
    }
    filterQuery();
  }, [categories, emails, filter]);

  useEffect(() => {
    if (emails.length === 0) setEmails((email) => [...mails]);
    else {
      //@ts-ignore
      setEmails((emails) => {
        const map = new Map<string, DashBoardEmail>();
        const temp = [];

        for (let i = 0; i < mails.length; i++) {
          map.set(mails[i].id, mails[i]);
        }
        for (let i = 0; i < emails.length; i++) {
          map.set(emails[i].id, emails[i]);
        }
        //@ts-ignore
        for (let [key, value] of map) {
          temp.push(value);
        }
        return temp;
      });
    }
    if (PageNumber) {
      setdbPageNumber((cur) => (PageNumber > dbPageNumber ? PageNumber : cur));
    }
    const urlArr = window.location.href.split("/");
    if (urlArr[urlArr.length - 1] === "dashborad") setCurTab("Inbox");
  }, []); //provided empty dependancy array because we want this effect to run on only intial render
  const handleDelete = async () => {
    try {
      console.log("currentEmail", currentEmail?.id);
      const res = await axios.delete("/api/deleteEmail", {
        data: {
          id: currentEmail?.id || "",
          userEmailAddress: userEmailAddress || "",
        },
      });
      if (res.status === 200) {
        toast.success("Mail Delete successfully", {
          duration: 3000,
          position: "top-center",
        });
        setDisplayMails((cur) =>
          cur.filter((mail) => mail.id !== currentEmail?.id)
        );
      }
    } catch (error) {
      toast.error("Some error while deleting mail");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };
  async function handleLoadMore(fromDB: boolean) {
    try {
      setIsLoadingMore(true);
      if (!fromDB) {
        const dashBoardEmail: DashBoardEmail[] =
          await getDashBoardMailsFromQueueElement(queue[0], userEmailAddress);
        let underProcessEmailIds: string[] = [];
        for (let i = 1; i < queue.length; i++) {
          for (let j = 0; j < queue[i].length; j++) {
            underProcessEmailIds.push(queue[i][j].id);
          }
        }
        const res = await storeRealTimeEmails(
          dashBoardEmail,
          undefined,
          userEmailAddress,
          underProcessEmailIds
        );
        if (res) {
          queue.shift();
          let temp = getOneEmailForOneThread(dashBoardEmail, threadIdSet);
          setEmails((emails) => [...emails, ...temp]);
        }
      } else {
        let emailFromDB: DashBoardEmail[] = [];
        if (firstTimeFetched) {
          //this block will run if we get some fresh emails at initial render
          emailFromDB = await getEmailsWithPaginationFromDB(
            dbPageNumber,
            userEmailAddress,
            mails.length //here we only need intial mails cnt to skip over therefore instead of emails state we are using mails
          );
        } else {
          emailFromDB = await getEmailsWithPaginationFromDB(
            dbPageNumber,
            userEmailAddress
          ); //if we does not fetched single new mail then this block will run
        }

        let temp = getOneEmailForOneThread(emailFromDB, threadIdSet);
        setEmails((emails) => [...emails, ...temp]);
        setdbPageNumber((page) => page + 1);
      }
    } catch (e: any) {
      toast(e.message);
    } finally {
      setIsLoadingMore(false);
    }
  }

  async function handleSend() {
    //@ts-ignore
    statTransition(async () => {
      if (generatedText.subject.length == 0) {
        toast.error("Your mail subject is empty please fill it before sending");
        return;
      }
      if (generatedText.body.length === 0) {
        toast.error("Your mail body is empty please fill it before sending");
        return;
      }
      const email: ReplyEmailFormat = {
        id: currentEmail?.id || "",
        threadId: currentEmail?.threadId || "",
        sender: currentEmail?.from || "",
        subject: generatedText.subject,
        body: generatedText.body,
      };
      try {
        const res: {
          id: string;
          labelIds: string[];
          threadId: string;
        } = await sendMail(email);
        const replyEmail: ReplyEmailDBFormat = {
          replyMailId: res.id,
          threadId: res.threadId,
          labels: res.labelIds,
          userEmailAddress: userEmailAddress || "",
          idOfOriginalMail: currentEmail?.id || "",
          generatedSubject: generatedText.subject,
          generatedResponse: generatedText.body,
          generatedTimeStamp: new Date().toISOString(),
          to: currentEmail?.from || "",
        };
        const res1 = await axios.post("/api/storeSendEmail", replyEmail);

        toast.success("Mail send successfully", {
          duration: 3000,
          position: "top-center",
        });
      } catch {
        toast.error("there is some error while sending mail");
      } finally {
        setIsQuickReplyOpen(false);
      }
    });
  }
  async function handleGenerateResponse() {
    //@ts-ignore
    statTransition(async () => {
      const ReqObj: any = {
        username: userEmailAddress || "",
        custom_knowledge: isEnabled,
        data: {
          previous_subject: currentEmail?.subject || "", //orinal mail subject
          previous_body: currentEmail?.longSummary || "", //long summery or mail body
          sender: currentEmail?.from || "",
          response: prompt,
          receiver: userEmailAddress || "",
          organization: "XYZ",
          response_writing_style: reqBody.response_writing_style,
          length: reqBody.length,
          compose_language: reqBody.compose_language,

          response_tone: reqBody.response_tone, //aggresive
        },
      };
      try {
        const response = await getGeneratedRes(ReqObj);
        if (response) {
          setGeneratedText(response);
        }
      } catch (e) {
        throw e;
      }
    });
  }
  const toggleQuickReply = () => {
    setGeneratedText((cur) => {
      return { ...cur, subject: "", body: "" };
    });
    setPrompt("");
    setIsQuickReplyOpen(!isQuickReplyOpen);
  };
  const router = useRouter();

  const finalMails = filter.size > 0 ? filteredMails : displayMails;
  if (isFilteringMails || initialLoad) return <Skelton />;
  if (
    finalMails.length == 0 &&
    mails.length === 0 &&
    emails.length === 0 &&
    filteredMails.length === 0 &&
    displayMails.length === 0
  )
    return <div className="m-auto font-semibold text-3xl">No mails found</div>;
  return (
    <>
      {emails.length === 0 ? (
        <Skelton />
      ) : (
        <div className={` flex-1 flex flex-col`}>
          <ScrollArea className="flex-1 w-full">
            <div className="p-4 space-y-4">
              {finalMails.length > 0 ? (
                finalMails.map((email, index) => (
                  <Card
                    onClick={() => setCurrentEmail(email)}
                    key={index}
                    className="relative w-full transition-all duration-300 ease-in-out hover:shadow-md hover:scale-[1.01] border border-gray-300"
                  >
                    <CardContent className="p-4">
                      <Link
                        href={
                          url.startsWith("/Demo")
                            ? `/Demo/id?id=${email.threadId}`
                            : `/dashboard/id?id=${email.threadId}`
                        }
                        className="flex-1"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold opacity-70 tracking-wider">
                              {email.from}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {email.subject}
                            </p>
                          </div>
                          <span className="text-xs text-gray-400 ">
                            {dateFormatter(email.date)}
                          </span>
                        </div>

                        <p className="mt-2 text-base tracking-wide">
                          {email.longSummary}
                        </p>
                        <div className="mt-3">
                          <p className=" text-sm rounded-full inline bg-[rgb(209,209,214)] text-[rgb(58,58,60)] p-2 ">
                            {email.category}
                          </p>
                        </div>
                      </Link>
                      <Dialog
                        open={isDeleteModalOpen}
                        onOpenChange={setIsDeleteModalOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant={"ghost"}
                            size={"icon"}
                            className="absolute bottom-2 right-9 flex items-center justify-center rounded-full"
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-white">
                          <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete this item? This
                              action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setIsDeleteModalOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleDelete}
                            >
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute bottom-2 right-2 flex items-center justify-center rounded-full"
                        onClick={toggleQuickReply}
                      >
                        <ChevronRight className="h-4 w-4" />

                        <span className="sr-only">Quick reply</span>
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <h2 className="text-xl">No mails to show</h2>
              )}
              {
                <>
                  {(queue?.length > 0 ||
                    Math.ceil(dbMailCnt / 10) >= dbPageNumber) && (
                    <Button
                      disabled={isLoadingMore}
                      className={`${isLoadingMore && "opacity-50 cursor-not-allowed"}`}
                      type="submit"
                      onClick={() => {
                        if (queue.length == 0) handleLoadMore(true);
                        else handleLoadMore(false);
                      }}
                    >
                      {isLoadingMore ? <SpinnerMini /> : "Load more"}
                    </Button>
                  )}
                </>
              }
            </div>
          </ScrollArea>
        </div>
      )}
      {isQuickReplyOpen && <Overlay toggleModal={toggleQuickReply} />}
      {isQuickReplyOpen && (
        <ModalWindowContainer>
          <ModalHeader
            handleModalClose={toggleQuickReply}
            heading1={"Quick Reply"}
            heading2={currentEmail?.from}
          />
          <ModalBody>
            <GenerateCustomizationOptions
              setReqBody={setReqBody}
              setIsEnabled={setIsEnabled}
              handleSend={handleSend}
              isLoading={isPending}
            />
            <div className="flex-grow p-4 space-y-4  m-2">
              <p className="border border-gray-300 rounded-md text-base px-4 py-2">
                <p>
                  <strong>Summary</strong>
                </p>
                <p className="text-base">{currentEmail?.longSummary}</p>
              </p>
              <p className="border border-gray-300 rounded-md text-base px-4 py-2">
                <p>
                  <strong>From</strong>
                </p>
                <p className="text-base">{currentEmail?.from}</p>
              </p>
              <Input
                className={`border border-gray-300 placeholder:text-slate-500 disabled:cursor-not-allowed`}
                disabled={isPending}
                onChange={(e) =>
                  setGeneratedText((cur) => ({
                    ...cur,
                    subject: e.target.value,
                  }))
                }
                placeholder="Subject"
                value={generatedText.subject}
              />
              <Textarea
                className={` border border-gray-300 placeholder:text-slate-500 disabled:cursor-not-allowed`}
                placeholder="This is where the summary of the content would go. The content here is scrollable if it exceeds the container height."
                rows={10}
                onChange={(e) =>
                  setGeneratedText((curObj) => ({
                    ...curObj,
                    body: e.target.value,
                  }))
                }
                disabled={isPending}
                value={generatedText.body}
              />
              <div className="mb-2 flex gap-2">
                <Input
                  className="rounded-full border border-gray-700 p-4 w-full disabled:cursor-not-allowed"
                  onChange={(e) => setPrompt(e.target.value)}
                  value={prompt}
                  placeholder="Add extra instructions"
                  disabled={isPending}
                />
                <div className="flex justify-end">
                  <Button
                    className="rounded-full disabled:cursor-not-allowed"
                    onClick={handleGenerateResponse}
                    disabled={isPending}
                  >
                    Generate
                  </Button>
                </div>
              </div>
            </div>
          </ModalBody>
        </ModalWindowContainer>
      )}
    </>
  );
}
