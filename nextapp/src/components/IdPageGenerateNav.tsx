"use client";
import { getGeneratedRes } from "@/actions/getGeneratedRes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { removeEscapeSequence } from "@/utils/getEmailsFormatForLLM";
import { textFromHtml } from "@/utils/textFromHtml";
import { ChevronRight, RotateCcw, Send } from "lucide-react";
import { useSession } from "next-auth/react";
import { startTransition, useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import toast from "react-hot-toast";
import sendMail from "@/actions/sendMail";
import axios from "axios";
import { DEFAULT_EMAIL } from "@/constants";
const intialGenerateOptions = {
  composeLanguage: "English",
  writingStyle: "Passive",
  emailTone: "Casual",
  wordCount: "Short",
  useCustomKnowledge: false,
  prompt: "",
};

const IdPageGenerateNav = ({
  setIsResponseBoxOpen,
  currentEmail,
  url,
}: {
  setIsResponseBoxOpen: any;
  currentEmail: EmailFullFormat;
  url: string;
}) => {
  const session = useSession();
  const [generatedText, setGeneratedText] = useState<{
    subject: string;
    body: string;
  }>({ subject: "", body: "" });
  const [generateOptions, setGenerateOptions] = useState(intialGenerateOptions);
  const [isPending, startTransition] = useTransition();
  let userEmailAddress: string;
  if (url.startsWith("/Demo")) {
    userEmailAddress = DEFAULT_EMAIL;
  } else {
    userEmailAddress = session.data?.user?.email || "";
  }
  // console.log("currentMail", currentEmail);
  async function handleGenerateResponse() {
    startTransition(async () => {
      const ReqObj: any = {
        username: userEmailAddress || "",
        custom_knowledge: generateOptions.useCustomKnowledge,
        data: {
          previous_subject: currentEmail?.subject || "", //orinal mail subject
          previous_body:
            removeEscapeSequence(currentEmail?.textPlain) ||
            removeEscapeSequence(currentEmail?.body) ||
            removeEscapeSequence(textFromHtml(currentEmail?.textHtml)) ||
            "",
          sender: currentEmail?.from || "",
          response: generateOptions.prompt,
          receiver: userEmailAddress || "",
          organization: "XYZ",
          response_writing_style: generateOptions.writingStyle,
          length: generateOptions.wordCount,
          compose_language: generateOptions.composeLanguage,

          response_tone: generateOptions.emailTone,
        },
      };
      console.log("ReqObj", ReqObj);

      try {
        const response = await getGeneratedRes(ReqObj);
        // console.log("response", response);
        if (response) {
          setGeneratedText(response);
          setGenerateOptions((cur) => {
            return { ...cur, prompt: "" };
          });
        }
      } catch (e: any) {
        if (e.message.startsWith("Daily generated count "))
          toast.error("You Have reached daily genrate limit");
      }
    });
  }
  async function handleSend() {
    //@ts-ignore
    startTransition(async () => {
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
        setGeneratedText((cur) => {
          return { subject: "", body: "" };
        });
      }
    });
  }
  return (
    <ScrollArea>
      <div className="bg-white border-l p-4 overflow-auto">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <p className="text-xl font-bold">Generate Email</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsResponseBoxOpen(false)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Input
                className={`border border-gray-300 placeholder:text-slate-500 disabled:cursor-not-allowed`}
                disabled={isPending}
                placeholder="Subject"
                value={generatedText.subject}
                onChange={(e) =>
                  setGeneratedText((cur) => {
                    return { ...cur, subject: e.target.value };
                  })
                }
              />
              <Textarea
                // className="min-h-[200px] rounded-md"
                className={` border border-gray-300 min-h-[150px] placeholder:text-slate-500 disabled:cursor-not-allowed`}
                disabled={isPending}
                value={generatedText.body}
                onChange={(e) =>
                  setGeneratedText((cur) => {
                    return { ...cur, body: e.target.value };
                  })
                }
                placeholder="Generated email content will appear here..."
              />
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-language">Compose Language</Label>
                <Select
                  onValueChange={(e) =>
                    setGenerateOptions((cur: any) => {
                      return { ...cur, composeLanguage: e };
                    })
                  }
                >
                  <SelectTrigger
                    id="email-language"
                    className="w-[180px] rounded-md"
                  >
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="marathi">Marathi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="writing-style">Writing style</Label>
                <Select
                  onValueChange={(e) =>
                    setGenerateOptions((cur: any) => {
                      return { ...cur, writingStyle: e };
                    })
                  }
                >
                  <SelectTrigger
                    id="writing-style"
                    className="w-[180px] rounded-md"
                  >
                    <SelectValue placeholder="Select Writing Style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aggressive">Aggressive</SelectItem>
                    <SelectItem value="passive">Passive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="email-tone">Select email tone</Label>
                <Select
                  onValueChange={(e) =>
                    setGenerateOptions((cur: any) => {
                      return { ...cur, emailTone: e };
                    })
                  }
                >
                  <SelectTrigger
                    id="email-tone"
                    className="w-[180px] rounded-md"
                  >
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="word-count">Length</Label>
                <Select
                  onValueChange={(e) =>
                    setGenerateOptions((cur: any) => {
                      return { ...cur, wordCount: e };
                    })
                  }
                >
                  <SelectTrigger
                    id="word-count"
                    className="w-[180px] rounded-md"
                  >
                    <SelectValue placeholder="Select length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="long">Long</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="custom-knowledge">Use Custom Knowledge</Label>
                <Switch
                  onClick={() => {
                    setGenerateOptions((cur: any) => {
                      return {
                        ...cur,
                        useCustomKnowledge: !cur.useCustomKnowledge,
                      };
                    });
                  }}
                  id="custom-knowledge"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="mt-4">
          <Input
            placeholder="Enter your reply prompt.."
            className="rounded-md"
            value={generateOptions.prompt}
            onChange={(e) =>
              setGenerateOptions((cur) => {
                return { ...cur, prompt: e.target.value };
              })
            }
          />
          <div className="flex justify-between mt-4">
            <Button
              className="w-[48%] rounded-md  disabled:cursor-not-allowed"
              disabled={isPending}
              onClick={handleGenerateResponse}
            >
              Generate
            </Button>
            <Button
              className="w-[48%] rounded-md  disabled:cursor-not-allowed"
              disabled={isPending}
              onClick={handleSend}
            >
              <Send className="mr-2 h-4 w-4" /> Send
            </Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default IdPageGenerateNav;
