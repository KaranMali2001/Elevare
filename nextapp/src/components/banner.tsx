"use client";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import { MailboxLandingPageComponent } from "./mailbox-landing-page";

export function FloatingBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isVisible) return <MailboxLandingPageComponent />;

  return (
    <div>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: 1,
            scale: 1,
            top: isMinimized ? "20px" : 0,
            right: isMinimized ? "20px" : 0,
            bottom: isMinimized ? "auto" : 0,
            left: isMinimized ? "auto" : 0,
          }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={`fixed z-50 ${isMinimized ? "" : "flex items-center justify-center bg-black bg-opacity-50"}`}
        >
          <motion.div
            layout
            animate={
              isMinimized
                ? { width: "48px", height: "48px" }
                : { width: "auto", height: "auto" }
            }
            className={`bg-red-500 text-white rounded-lg shadow-lg overflow-hidden ${isMinimized ? "cursor-pointer" : ""}`}
            onClick={() => isMinimized && setIsMinimized(false)}
          >
            {isMinimized ? (
              <div className="flex items-center justify-center w-full h-full">
                <AlertTriangle className="w-6 h-6" />
              </div>
            ) : (
              <div className="p-6 pr-12 relative max-w-lg">
                <div className="flex items-start space-x-4">
                  <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-xl font-bold mb-2">
                      System Maintenance Notice
                    </h2>
                    <p className="text-white/90">
                      We are currently performing critical maintenance on our
                      backend systems to enhance performance and security.
                      During this period, some features may be temporarily
                      unavailable.
                    </p>
                    <p className="mt-4 text-white/90">
                      Estimated completion time:{" "}
                      <span className="font-semibold">
                        Jan 17, 2025, 18:00 UTC
                      </span>
                    </p>
                    <p className="mt-4 text-white/90">
                      While we work on restoring full functionality, we invite
                      you to:
                    </p>
                    <ul className="list-disc list-inside mt-2 text-white/90">
                      <li>
                        Watch our product demo video to learn more about our
                        services
                      </li>
                    </ul>
                    <p className="mt-4 text-white/90">
                      For urgent inquiries, please contact our support team at{" "}
                      <a
                        href="mailto:support@elevareapp.com"
                        className="underline hover:text-white"
                      >
                        support@elevareapp.com
                      </a>{" "}
                    </p>
                    <p className="mt-4 text-white/90">
                      We appreciate your patience and understanding as we work
                      to improve our services. Thank you for choosing
                      ElevareApp.
                    </p>
                  </div>
                </div>
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => setIsVisible(false)}
                    className="text-white hover:text-gray-200 transition-colors"
                    aria-label="Close notification"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
      <MailboxLandingPageComponent />
    </div>
  );
}
