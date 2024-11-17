"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, User, AlertTriangle } from "lucide-react";
import axios from "axios";

export function NotificationSystemComponent({
  initialNotifications,
}: {
  initialNotifications: Notifications[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notifications[]>([]);
  useEffect(() => {
    setNotifications(initialNotifications);
  }, [initialNotifications]);

  const unreadCount = notifications.length;

  const toggleNotifications = () => setIsOpen(!isOpen);

  const closeNotifications = () => setIsOpen(false);

  const clearNotifications = async () => {
    setNotifications([]);
    await axios.put("/api/pushNotification");
  };

  return (
    <div className="  bg-white h-12 ">
      <div className="relative">
        <motion.button
          className="relative p-2 text-black "
          whileHover={{ scale: 1.1 }}
          onClick={toggleNotifications}
        >
          <Bell className="w-8 h-8" />
          {unreadCount > 0 && (
            <span className="absolute top-1 left-4 inline-flex items-center justify-center px-2 py-1 text-lg font-bold leading-none text-black transform translate-x-1/2 -translate-y-1/2 bg-white rounded-full">
              {unreadCount}
            </span>
          )}
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50"
              style={{ transform: "translateX(50%)" }}
            >
              <div className="p-4 bg-black border-b border-gray-800 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">
                  Notifications
                </h3>
                <button
                  onClick={clearNotifications}
                  className="text-sm text-white hover:text-gray-300 focus:outline-none"
                >
                  Clear all
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto bg-white">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      className="p-4 border-b border-gray-200 hover:bg-gray-100 transition-colors duration-150 ease-in-out"
                      whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 bg-black rounded-full p-2"></div>
                        <div className="ml-3 w-0 flex-1">
                          <p className="text-sm font-medium text-black">
                            {notification.title}
                          </p>
                          <p className="mt-1 text-sm text-gray-600">
                            {notification.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    <p>You are all caught up! 🎉</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isOpen && (
          <div className="fixed inset-0 z-40" onClick={closeNotifications} />
        )}
      </div>
    </div>
  );
}
