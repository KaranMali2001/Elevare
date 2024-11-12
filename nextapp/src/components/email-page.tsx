"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useRecoilValue } from "recoil";
import { emailById } from "../recoil/selectors";

export function EmailPage({ mail }: { mail: EmailFullFormat }) {
  const [email, setEmail] = useState<Mail | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const dashBoardEmail = useRecoilValue(emailById(mail.id));

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        // const response = await fetch(`/api/emailFullFormat?id=${id}`);
        const res = {
          ...mail,
          shortSummary: dashBoardEmail?.shortSummary,
          longSummary: dashBoardEmail?.longSummary,
          tone: dashBoardEmail?.tone,
        };
        setEmail(res);
      } catch (error) {
        throw error;
      } finally {
        setLoading(false);
      }
    };
    fetchEmail();
  }, [mail.id]);
  // console.log("Email", email);

  if (loading) return <Skeleton />;
  if (!email) return <div>No email data available.</div>;

  return (
    <div className="m-4">
      <div className="flex p-4 border justify-between rounded-md bg-white">
        <h3>{email?.longSummary || email.snippet}</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>
      {isExpanded && (
        <div>
          <Card>
            <CardHeader>
              <div className="flex flex-wrap gap-2">
                {email?.labels?.map((label) => (
                  <Badge key={label} variant="secondary">
                    {label}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">From: {email.from}</p>
                    <p className="text-sm text-muted-foreground">
                      To: {email.to}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Date:{" "}
                      {new Date(email.date).toLocaleString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* <Button variant="ghost" size="icon">
                      <StarIcon className="h-4 w-4" />
                    </Button> */}
                    {/* <Button variant="ghost" size="icon">
                      <ReplyIcon className="h-4 w-4" />
                    </Button> */}
                    {/* <Button variant="ghost" size="icon">
                      <MoreVerticalIcon className="h-4 w-4" />
                    </Button> */}
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Subject</h3>
                  <p className="text-sm">{email.subject}</p>
                </div>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Summary of mail
                  </h3>
                  <p className="text-sm whitespace-pre-wrap">
                    {email.longSummary || email.snippet}
                  </p>
                </div>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Body</h3>
                  {email.textHtml !== "" ? (
                    <div
                      className="text-sm"
                      dangerouslySetInnerHTML={{ __html: email.textHtml }}
                    />
                  ) : email.body ? (
                    <div
                      className="text-sm"
                      dangerouslySetInnerHTML={{ __html: email.body || "" }}
                    />
                  ) : (
                    email.textPlain
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
