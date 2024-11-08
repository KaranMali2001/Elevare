"use client";
import { signOutAction } from "@/actions/authAction";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SEARCH_TEXT_LEN } from "@/constants";
import { useQuery } from "@/hooks/useQuery";
import { emailsAtom, sideBarOpen } from "@/recoil/atom";
import { dateFormatter } from "@/utils/dateFormatter";
import { Mail, Menu, Search } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { ProfessionalMonochromeButtonsComponent } from "./professional-monochrome-buttons";
import { Card } from "./ui/card";

function DashboardHeader() {
  const session = useSession();
  const pathName = usePathname();
  //will accept from prop
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<DashBoardEmail[]>([]);
  const [emails, setEmail] = useRecoilState(emailsAtom);
  const [isSideBarOpen, setIsSideBarOpen] = useRecoilState(sideBarOpen);
  const { searchEmails, isLoading, error } = useQuery(searchQuery);
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }
    // const filteredResults = emails.filter(

    setSearchResults(searchEmails);
  }, [emails, searchQuery, searchEmails]);
  const router = useRouter();
  function handleResultClick(threadId: string) {
    setSearchQuery("");
    setSearchResults([]);
    router.push(`/dashboard/id?id=${threadId}`);
  }
  function handleSideBarToggle() {
    setIsSideBarOpen(!isSideBarOpen);
  }
  function hanndleChatClick() {
    router.push("/dashboard/chat");
  }
  return (
    <header className="border-b sticky border-gray-300 h-[9vh]  top-0 z-30 flex justify-between items-center px-6 lg:px-8 py-2 bg-white text-gray-700">
      <div className="flex items-center ">
        <Button onClick={handleSideBarToggle} variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
        <Link href="/dashboard" className="flex items-center " prefetch={false}>
          <div className="">
            <Image src="/image.svg" height={140} width={140} alt="Brand LOGO" />
          </div>
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 ">
        <div className="max-w-lg w-full lg:max-w-xl relative">
          <div className="relative flex gap-2 justify-center items-center">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <Input
              type="text"
              placeholder="Search emails"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {pathName.split("/").at(-1) !== "chat" && (
              <div onClick={hanndleChatClick}>
                <ProfessionalMonochromeButtonsComponent />
              </div>
            )}
          </div>
          {searchResults.length > 0 && (
            <Card className="absolute mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm z-10">
              <ul>
                {searchResults.map((result) => (
                  <li
                    onClick={() => {
                      handleResultClick(result.threadId);
                    }}
                    key={result.id}
                    className="cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white flex items-center gap-4 overflow-x-hidden scroll-bar "
                  >
                    <Mail className="h-6 w-6 flex-shrink-0" />
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold tracking-wide block truncate">
                          {result?.shortSummary?.length > SEARCH_TEXT_LEN
                            ? result?.shortSummary.substring(
                                0,
                                SEARCH_TEXT_LEN
                              ) + "..."
                            : result.shortSummary}
                        </span>
                        <span className="text-xs text-gray-400 hover:text-white">
                          {dateFormatter(result.date)}
                        </span>
                      </div>
                      <div className="text-sm block truncate">
                        {result?.from?.length > SEARCH_TEXT_LEN
                          ? result?.from.substring(0, SEARCH_TEXT_LEN) + "..."
                          : result.from}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-gray-300 hover:border-gray-400"
          >
            <img
              src={session.data?.user?.image || ""}
              width={36}
              height={36}
              alt="Avatar"
              className="rounded-full"
              style={{ aspectRatio: "36/36", objectFit: "cover" }}
            />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48 shadow-xl">
          <DropdownMenuLabel className="text-gray-600">
            My Account
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="my-1" />
          <Link href={"/dashboard/profile"}>
            <DropdownMenuItem className="hover:bg-gray-100">
              Profile
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator className="my-1" />
          <Link href={"/"}>
            <DropdownMenuItem
              onClick={async () => {
                await signOutAction();
                await signOut();
              }}
              className="hover:bg-gray-100"
            >
              Logout
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

export default DashboardHeader;
