import Link from "next/link";
import { Button } from "./ui/button";
import { Archive, Mail, Send, Trash2 } from "lucide-react";

function SideBarNavigation({
  isSideBarOpen,
  mailCount,
  setCurTab,
}: {
  isSideBarOpen: boolean;
  mailCount: number;
  setCurTab: any;
}) {
  return (
    <nav className="space-y-2 p-4">
      <Link href={"/dashboard"}>
        <Button
          variant="ghost"
          className="w-full flex items-center justify-between hover:bg-gray-100 transition-colors rounded-md px-2 py-1"
          onClick={() => setCurTab("Inbox")}
        >
          <div className="flex items-center">
            <Mail className="mr-2 h-5 w-5 text-gray-700" />
            {isSideBarOpen && (
              <span className="text-gray-800 font-medium text-sm">Inbox</span>
            )}
          </div>
          {isSideBarOpen && (
            <span className="ml-auto bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
              {mailCount}
            </span>
          )}
        </Button>
      </Link>
      <Link href={`/dashboard/send`}>
        <Button
          variant="ghost"
          className="w-full flex items-center justify-between hover:bg-gray-100 transition-colors rounded-md px-2 py-1"
          onClick={() => setCurTab("Send")}
        >
          <div className="flex items-center">
            <Send className="mr-2 h-5 w-5 text-gray-700" />
            {isSideBarOpen && (
              <span className="text-gray-800 font-medium text-sm">Sent</span>
            )}
          </div>
        </Button>
      </Link>
      <Link href={`/dashboard/trash`}>
        <Button
          variant="ghost"
          className="w-full flex items-center justify-between hover:bg-gray-100 transition-colors rounded-md px-2 py-1"
          onClick={() => setCurTab("Trash")}
        >
          <div className="flex items-center">
            <Trash2 className="mr-2 h-5 w-5 text-gray-700" />
            {isSideBarOpen && (
              <span className="text-gray-800 font-medium text-sm">Trash</span>
            )}
          </div>
        </Button>
      </Link>
      <Button
        variant="ghost"
        className="w-full flex items-center justify-between hover:bg-gray-100 transition-colors rounded-md px-2 py-1"
        onClick={() => setCurTab("Archive")}
      >
        <div className="flex items-center">
          <Archive className="mr-2 h-5 w-5 text-gray-700" />
          {isSideBarOpen && (
            <span className="text-gray-800 font-medium text-sm">Archive</span>
          )}
        </div>
      </Button>
    </nav>
  );
}

export default SideBarNavigation;
