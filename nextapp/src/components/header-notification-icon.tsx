"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

export function HeaderNotificationIconComponent({
  initialNotifications,
}: {
  initialNotifications: Notifications[];
}) {
  const [notifications, setNotifications] = useState<Notifications[]>([]);
  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleOpen = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={handleOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative scale-150">
          <Bell size={100} />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
              >
                {unreadCount}
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <ScrollArea className="h-[300px]">
          <div className="p-4">
            <h3 className="font-semibold mb-4">Notifications</h3>
            <AnimatePresence>
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="mb-4 last:mb-0"
                  >
                    <h2 className="text-sm font-bold">{notification.title}</h2>
                    <h4 className="text-sm text-muted-foreground">
                      {notification.description}
                    </h4>
                  </motion.div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center">
                  No new notifications
                </p>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
