"use client";

import { uploadFile } from "@/actions/uploadFile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DEFAULT_EMAIL } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { dateFormatter } from "@/utils/dateFormatter";
import { deleteFile } from "@/utils/deleteFile";
import { listFolderContents } from "@/utils/listFolderContents";
import axios from "axios";
import { motion } from "framer-motion";
import {
  BarChartIcon,
  CheckIcon,
  ClockIcon,
  CreditCardIcon,
  DatabaseIcon,
  ExternalLinkIcon,
  FileIcon,
  ShieldIcon,
  StarIcon,
  TrashIcon,
  UploadIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PricingModalWindow } from "./pricing-modal";

type UploadedFile = {
  name: string;
  url: string;
};

export function EnhancedProfilePageComponent({ user }: any) {
  const url = usePathname();

  const session = useSession();
  let emailAddress: string;
  if (url.startsWith("/Demo")) {
    emailAddress = DEFAULT_EMAIL;
  } else {
    emailAddress = session.data?.user?.email || "";
  }
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [summarizedMails, setSummarizedMails] = useState(0);
  const [responseGeneratedMails, setResponseGeneratedMails] = useState(0);
  const [dataDeletionTime, setDataDeletionTime] = useState("3mon");
  useEffect(() => {
    async function getFolderContent() {
      const res = await listFolderContents(emailAddress);

      const prevUploaded = res.map((file) => {
        const temp = file?.split("/") || [];
        return {
          name: temp.at(-1) || "",
          url: `${process.env.NEXT_PUBLIC_OBJECT_STORAGE_BASE_URL}${emailAddress}/${temp.at(-1)}`,
        };
      });
      setUploadedFiles((cur) => [...prevUploaded]);
    }
    getFolderContent();
  }, [emailAddress]);
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsUploading(true);
    const file = event.target.files?.[0];
    if (file) {
      try {
        if (file.type === "application/pdf") {
          const url = `${process.env.NEXT_PUBLIC_OBJECT_STORAGE_BASE_URL}${emailAddress}/${file.name}`;
          console.log("url is ", url);
          await uploadFile(file, emailAddress, url);

          setUploadedFiles((uploadedFiles) => {
            const obj = {
              name: file.name,
              url: url,
            };
            return [...uploadedFiles, obj];
          });
          toast({
            title: "File Uploaded",
            description: ` ${file.name} File uploaded successfully`,

            duration: 3000,
          });
        } else if (file.type === "text/plain" || file.name.endsWith(".md")) {
          toast({
            title: "Coming Soon",
            description: "Support for text and markdown files is coming soon!",
            duration: 3000,
          });
        } else {
          toast({
            title: "Invalid File Type",
            description: "Please upload a PDF file.",
            variant: "destructive",
            duration: 3000,
          });
        }
      } catch (error: any) {
        console.error("Error uploading file:", error);
        if (!error.message) {
          toast({
            title: "Error",
            description: "there is a some error while uploading file",
            duration: 3000,
          });
        } else
          toast({
            title: "Error",
            description: error.message,
            duration: 3000,
          });
      }
    }
  };

  const handleDeleteFile = async (fileName: string) => {
    try {
      await deleteFile(`${emailAddress}/${fileName}`);
      setUploadedFiles((prev) => prev.filter((file) => file.name !== fileName));
      toast({
        description: ` ${fileName} File deleted successfully`,

        duration: 3000,
      });
    } catch (error: any) {
      console.log("generated error :", error);
      toast({
        description: ` ${fileName} File deletion failed`,

        duration: 3000,
      });
    }
  };
  async function handleRevokeAccess() {
    console.log("revoke access");
    const res = await axios.get("/api/revokeAccess");
  }
  return (
    <div className="container mx-auto p-4 overflow-auto">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage
                src="/placeholder.svg?height=80&width=80"
                alt="User avatar"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.userName}</CardTitle>
              <CardDescription>{emailAddress}</CardDescription>
              <p className="text-sm text-muted-foreground mt-1">
                Member of Elevare Since:{dateFormatter(String(user.joinedDate))}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard
              title={
                <span>
                  Sent
                  <sup className="ml-1 text-xs font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                    via elevare
                  </sup>
                </span>
              }
              value={user.sentEmail}
              className="bg-gradient-to-br from-primary/20 to-primary/10 border-primary/20"
            />
            <StatCard title="Received" value={user.emailsCnt} />
          </div>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Mail Statistics</h3>
            <Link
              href={
                url.startsWith("/Demo")
                  ? "/Demo/profile/analytics"
                  : "/dashboard/profile/analytics"
              }
            >
              <AnimatedButton>
                <BarChartIcon className="w-4 h-4 mr-2" />
                Go to Analytics
              </AnimatedButton>
            </Link>
          </div>

          <Tabs defaultValue="data-management" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="data-management">Data Management</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="uploaded-files">Uploaded Files</TabsTrigger>
            </TabsList>
            <TabsContent value="data-management" className="space-y-4">
              <h3 className="text-lg font-semibold">Data Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <Button onClick={handleRevokeAccess}>
                      <CardTitle className="text-sm font-medium flex items-center">
                        <ClockIcon className="w-4 h-4 mr-2" />
                        Revoke Website Access
                      </CardTitle>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Revoking access will stop this website from accessing your
                      data. From this point on, new emails will not be
                      summarized, while any previously processed data will not
                      deleted
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center">
                      <DatabaseIcon className="w-4 h-4 mr-2" />
                      Data Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      You are currently using 45% of your allocated storage.
                    </p>
                    <div className="w-full bg-secondary mt-2 rounded-full h-2.5 dark:bg-gray-700">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: "45%" }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center">
                      <ShieldIcon className="w-4 h-4 mr-2" />
                      Data Protection
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Your data is encrypted and protected.
                    </p>
                    <AnimatedButton className="mt-2" variant="outline">
                      View Security Details
                    </AnimatedButton>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center">
                      <FileIcon className="w-4 h-4 mr-2" />
                      Export Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Download a copy of your data anytime.
                    </p>
                    <AnimatedButton className="mt-2" variant="outline">
                      Request Data Export
                    </AnimatedButton>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="subscription" className="space-y-4">
              <h3 className="text-lg font-semibold">Subscription Details</h3>
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center">
                    <CreditCardIcon className="w-6 h-6 mr-2 text-primary" />
                    Pro Plan
                  </CardTitle>
                  <CardDescription>Your current subscription</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Plan Details</p>
                      <p className="text-2xl font-bold text-primary">
                        $19.99
                        <span className="text-sm text-muted-foreground">
                          /month
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Billed annually
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Subscription Period</p>
                      <p className="text-sm">Start: March 1, 2023</p>
                      <p className="text-sm">End: February 29, 2024</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Key Features</p>
                      <ul className="text-sm space-y-1">
                        <li className="flex items-center">
                          <CheckIcon className="w-4 h-4 mr-2 text-green-500" />{" "}
                          Unlimited email summaries
                        </li>
                        <li className="flex items-center">
                          <CheckIcon className="w-4 h-4 mr-2 text-green-500" />{" "}
                          Advanced analytics
                        </li>
                        <li className="flex items-center">
                          <CheckIcon className="w-4 h-4 mr-2 text-green-500" />{" "}
                          Priority support
                        </li>
                        <li className="flex items-center">
                          <CheckIcon className="w-4 h-4 mr-2 text-green-500" />{" "}
                          Custom integrations
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-2">
                    <AnimatedButton variant="default">
                      <StarIcon className="w-4 h-4 mr-2" />
                      <PricingModalWindow />
                    </AnimatedButton>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="uploaded-files" className="space-y-4">
              <h3 className="text-lg font-semibold">Uploaded Files</h3>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center">
                    <UploadIcon className="w-4 h-4 mr-2" />
                    Upload New File
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      id="file-upload"
                      className="hidden"
                    />
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                        <UploadIcon className="w-12 h-12 mx-auto text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF files only (Max 10MB)
                        </p>
                      </div>
                    </Label>
                    {uploadedFiles.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold mb-2">
                          Uploaded Files:
                        </h4>
                        <ul className="space-y-2 border rounded-md divide-y">
                          {uploadedFiles.map((file) => (
                            <li
                              key={file.name}
                              className="flex items-center justify-between p-3"
                            >
                              <div className="flex items-center space-x-2">
                                <FileIcon className="w-4 h-4" />
                                <span className="font-medium">{file.name}</span>
                              </div>
                              <div className="flex space-x-2">
                                <AnimatedButton
                                  variant="outline"
                                  size="sm"
                                  asChild
                                >
                                  <Link
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Preview
                                    <ExternalLinkIcon className="w-4 h-4 ml-2" />
                                  </Link>
                                </AnimatedButton>
                                <AnimatedButton
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteFile(file.name)}
                                >
                                  Delete
                                  <TrashIcon className="w-4 h-4 ml-2" />
                                </AnimatedButton>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  className,
}: {
  title: React.ReactNode;
  value: string;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

function AnimatedButton({
  children,
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        className={`${className} transition-all duration-300 ease-in-out`}
        variant={variant}
        size={size}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
}
