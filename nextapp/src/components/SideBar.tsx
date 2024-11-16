"use client";
import { composeEmail } from "@/actions/composeEmail";
import { getGeneratedRes } from "@/actions/getGeneratedRes";
import { sideBarOpen, tab } from "@/recoil/atom";
import axios from "axios";
import { getCookie } from "cookies-next";
import { Menu, Pencil } from "lucide-react";
import { useSession } from "next-auth/react";
import { use, useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import ComposeInputFields from "./ComposeInputFields";
import GenerateCustomizationOptions from "./GenerateCustomizationOptions";
import LoadingBar from "./LoadingBar";
import ModalBody from "./ModalBody";
import ModalHeader from "./ModalHeader";
import ModalWindowContainer from "./ModalWindowContainer";
import Overlay from "./Overlay";
import SideBarFilters from "./SideBarFilters";
import SideBarNavigation from "./SideBarNavigation";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { DEFAULT_EMAIL } from "@/constants";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import Link from "next/link";

function SideBar({
  isDemo,
  categories,
  mailCount,
}: {
  isDemo: boolean;
  categories: string[];
  mailCount: number;
}) {
  const [isSideBarOpen, setIsSideBarOpen] = useRecoilState(sideBarOpen);
  const [curTab, setCurTab] = useRecoilState(tab);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const url = usePathname();

  const session = useSession();
  let userEmailAddress: string;
  if (url.startsWith("/Demo")) {
    userEmailAddress = DEFAULT_EMAIL;
  } else {
    userEmailAddress = session.data?.user?.email || "";
  }
  //Compose form field states
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileScreen, SetIsMobileScreen] = useState(false);
  const [receiver, setReceiver] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
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
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSideBarOpen(false);
      } else {
        setIsSideBarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    if (window.innerWidth < 500) SetIsMobileScreen(true);
  }, []);
  useEffect(() => {
    if (isSideBarOpen) {
      setIsSideBarOpen(true);
    } else setIsSideBarOpen(false);
  }, [isSideBarOpen, setIsSideBarOpen]);

  async function handleGenerateResponse() {
    setIsLoading(true);
    setGeneratedText((cur) => {
      return { ...cur, subject: "", body: "" };
    });
    const ReqObj: any = {
      username: userEmailAddress || "",
      custom_knowledge: isEnabled,
      data: {
        sender: userEmailAddress || "",
        response: prompt,
        receiver: receiver,

        response_writing_style: reqBody.response_writing_style,
        length: reqBody.length,
        compose_language: reqBody.compose_language,

        response_tone: reqBody.response_tone, //aggresive
      },
    };

    try {
      const response = await getGeneratedRes(ReqObj);
      console.log("generate response", response);
      if (response) {
        setGeneratedText(response);
        // setPrompt("");
      }
    } catch (e: any) {
      if (e.message.startsWith("Daily generated count "))
        toast.error("You Have reached daily genrate limit");
    } finally {
      setIsLoading(false);
    }
  }
  async function handleSend() {
    if (receiver.length === 0) {
      toast.error("please enter receiver email address");
      return;
    }
    if (generatedText.subject.length == 0) {
      toast.error("Your mail subject is empty please fill it before sending");
      return;
    }
    if (generatedText.body.length === 0) {
      toast.error("Your mail body is empty please fill it before sending");
      return;
    }

    setIsLoading(true);
    const input = `To: ${receiver}
From: ${userEmailAddress || ""}
Subject: ${generatedText.subject}
Content-Type: text/plain; charset="UTF-8"

${generatedText.body}
`;
    try {
      const res: {
        id: string;
        labelIds: string[];
        threadId: string;
      } = await composeEmail(input, getCookie("Token") || "");
      const replyEmail: ReplyEmailDBFormat = {
        replyMailId: res.id,
        threadId: res.threadId,
        labels: res.labelIds,
        userEmailAddress: userEmailAddress || "",
        idOfOriginalMail: "",
        generatedSubject: generatedText.subject,
        generatedResponse: generatedText.body,
        generatedTimeStamp: new Date().toISOString(),
        to: receiver || "",
      };
      console.log("replyEMail", replyEmail);
      const res1 = await axios.post("/api/storeSendEmail", replyEmail);

      toast.success("Mail send successfully", {
        duration: 3000,
        position: "top-center",
      });
    } catch {
      toast.error("there is some error while sending mail");
    } finally {
      setIsComposeOpen(false);
      setIsLoading(false);
      setGeneratedText((cur) => {
        return { subject: "", body: "" };
      });
      setReceiver("");
    }
  }
  function handleModalClose() {
    setGeneratedText((cur) => {
      return { ...cur, subject: "", body: "" };
    });
    setPrompt("");
    setReceiver("");
    setIsComposeOpen(false);
  }
  function toggleModal() {
    setGeneratedText((cur) => {
      return { ...cur, subject: "", body: "" };
    });
    setPrompt("");
    setReceiver("");
    setIsComposeOpen(false);
  }
  if (isMobileScreen) {
    return (
      <>
        <Sheet open={isSideBarOpen} onOpenChange={setIsSideBarOpen}>
          <SheetContent className="p-4 md:w-[25vw]" side="left">
            <div
              onClick={() => setIsSideBarOpen(false)}
              className="flex flex-col h-[100vh] m-auto py-6"
            >
              <SideBarNavigation
                isSideBarOpen={isSideBarOpen}
                mailCount={mailCount}
                setCurTab={setCurTab}
              />
              <div className="border-t flex flex-col border-gray-300 py-2 ">
                <h3 className="font-semibold text-gray-700 text-base mb-3">
                  Filters
                </h3>
                <SideBarFilters
                  categories={categories}
                  isLoading={isLoading}
                  startTransition={startTransition}
                  curTab={curTab}
                  setCurTab={setCurTab}
                />
              </div>
              <div className="mt-auto justif p-4">
                <Button
                  onClick={() => setIsComposeOpen(true)}
                  className="bg-black text-white w-full flex items-center justify-center gap-2 py-2 rounded-md hover:bg-gray-900 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Pencil className="h-5 w-5" />
                    {isSideBarOpen && <span>Compose</span>}
                  </div>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        {isComposeOpen && (
          <Overlay toggleModal={toggleModal} /> //overlay
        )}
        {isComposeOpen && (
          <ModalWindowContainer>
            <ModalHeader
              handleModalClose={handleModalClose}
              heading1={"Quick Send"}
            />
            <ModalBody>
              <GenerateCustomizationOptions
                setReqBody={setReqBody}
                setIsEnabled={setIsEnabled}
                handleSend={handleSend}
                isLoading={isLoading}
              />

              <ComposeInputFields
                setReceiver={setReceiver}
                receiver={receiver}
                isLoading={isLoading}
                setGeneratedText={setGeneratedText}
                generatedText={generatedText}
                setPrompt={setPrompt}
                prompt={prompt}
                handleGenerateResponse={handleGenerateResponse}
              />
            </ModalBody>
          </ModalWindowContainer>
        )}
      </>
    );
  }

  return (
    <>
      {isPending && <LoadingBar />}
      <div
        className={`${
          isSideBarOpen
            ? " absolute top-0 left-0 h-[91vh] min-w-[30vw] z-10  md:static md:min-w-[20vw] xl:min-w-[15vw]"
            : "w-0 md:w-[7vw] xl:w-[4vw]"
        } border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col  bg-white shadow-md overflow-hidden`}
      >
        <SideBarNavigation
          isSideBarOpen={isSideBarOpen}
          mailCount={mailCount}
          setCurTab={setCurTab}
        />

        {isSideBarOpen && (
          <div className="border-t flex flex-col border-gray-300 p-4">
            <h3 className="font-semibold text-gray-700 text-base mb-3">
              Filters
            </h3>
            <SideBarFilters
              categories={categories}
              isLoading={isLoading}
              startTransition={startTransition}
              curTab={curTab}
              setCurTab={setCurTab}
            />
          </div>
        )}
        <div className="mt-auto justif p-4">
          <Button
            onClick={() => setIsComposeOpen(true)}
            className="bg-black text-white w-full flex items-center justify-center gap-2 py-2 rounded-md hover:bg-gray-900 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              {isSideBarOpen && <span>Compose</span>}
            </div>
          </Button>
        </div>
      </div>
      {isComposeOpen && (
        <Overlay toggleModal={toggleModal} /> //overlay
      )}
      {isComposeOpen && (
        <ModalWindowContainer>
          <ModalHeader
            handleModalClose={handleModalClose}
            heading1={"Quick Send"}
          />
          <ModalBody>
            <GenerateCustomizationOptions
              setReqBody={setReqBody}
              setIsEnabled={setIsEnabled}
              handleSend={handleSend}
              isLoading={isLoading}
            />

            <ComposeInputFields
              setReceiver={setReceiver}
              receiver={receiver}
              isLoading={isLoading}
              setGeneratedText={setGeneratedText}
              generatedText={generatedText}
              setPrompt={setPrompt}
              prompt={prompt}
              handleGenerateResponse={handleGenerateResponse}
            />
          </ModalBody>
        </ModalWindowContainer>
      )}
    </>
  );
}

export default SideBar;
