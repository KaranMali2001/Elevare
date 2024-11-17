"use client";

import * as React from "react";
import { Search, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";

const askAboutItems = [
  "Clean account fields",
  "Clean contact fields",
  "Create master 'People' list",
  "Account Fit Score",
  "Match leads to account",
];

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  complete?: boolean;
}

export function DataChat() {
  const [prompt, setPrompt] = React.useState("");
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const session = useSession();
  const [id, setId] = React.useState(
    () =>
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15),
  );
  // Simulate streaming text from backend
  const streamResponse = async (userMessage: string) => {
    const data = await fetch("/api/chatbotapi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: userMessage,
        user_name: session.data?.user?.email,
        id: id,
      }),
    });
    const response = await data.json();
    const messageId = Date.now().toString();

    setMessages((prev) => [
      ...prev,
      { id: messageId, role: "assistant", content: "", complete: false },
    ]);
    setIsStreaming(true);

    for (let i = 0; i < response.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 20));
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, content: response.slice(0, i + 1) }
            : msg,
        ),
      );
    }

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, complete: true } : msg,
      ),
    );
    setIsStreaming(false);
  };

  const handleSendMessage = async () => {
    if (!prompt.trim() || isStreaming) return;

    const userMessage = prompt.trim();
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "user",
        content: userMessage,
        complete: true,
      },
    ]);
    setPrompt("");
    await streamResponse(userMessage);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAskAboutClick = (item: string) => {
    setPrompt(item);
    inputRef.current?.focus();
  };

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-[91vh] bg-gradient-to-b from-background to-muted/20">
      <AnimatePresence mode="wait">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col items-center justify-center p-4"
          >
            <div className="max-w-md w-full space-y-6 text-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center"
              >
                <div className="rounded-full bg-primary/10 p-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
              </motion.div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">
                  Talk Data to Me
                </h1>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Choose a prompt below or write your own to start chatting with
                  Seem
                </p>
              </div>
              <div className="space-y-4">
                <div className="text-sm font-medium text-muted-foreground">
                  Ask about:
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {askAboutItems.map((item, i) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      key={item}
                    >
                      <Badge
                        variant="secondary"
                        className="cursor-pointer transition-colors hover:bg-secondary/80 px-3 py-1.5 text-sm"
                        onClick={() => handleAskAboutClick(item)}
                      >
                        {item}
                      </Badge>
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + askAboutItems.length * 0.1 }}
                  >
                    <Badge
                      variant="secondary"
                      className="cursor-pointer transition-colors hover:bg-secondary/80 px-3 py-1.5 text-sm flex items-center gap-1.5"
                    >
                      <Search className="h-3.5 w-3.5" />
                      See prompt library
                    </Badge>
                  </motion.div>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="pt-4"
                >
                  <div className="flex gap-2 max-w-md mx-auto">
                    <Input
                      ref={inputRef}
                      className="flex-1 h-12 px-4 text-base transition-colors bg-background border-muted-foreground/20 hover:border-muted-foreground/40 focus-visible:ring-primary/20"
                      placeholder="Enter your request..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <Button
                      size="icon"
                      className="h-12 w-12 transition-colors"
                      disabled={!prompt.trim() || isStreaming}
                      onClick={handleSendMessage}
                    >
                      <Send className="h-4 w-4" />
                      <span className="sr-only">Send message</span>
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-6 max-w-2xl mx-auto">
                {messages.map((message, i) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={cn(
                      "flex w-full",
                      message.role === "user" ? "justify-end" : "justify-start",
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-2.5 max-w-[80%] text-base leading-relaxed shadow-sm",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/50 border border-muted-foreground/10",
                      )}
                    >
                      {message.content}
                      {!message.complete && (
                        <span className="ml-1 animate-pulse">▊</span>
                      )}
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky bottom-0 border-t bg-background/80 backdrop-blur-lg p-6"
            >
              <div className="max-w-2xl mx-auto">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    className="flex-1 h-12 px-4 text-base transition-colors bg-background border-muted-foreground/20 hover:border-muted-foreground/40 focus-visible:ring-primary/20"
                    placeholder="Enter your request..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Button
                    size="icon"
                    className="h-12 w-12 bg-black"
                    disabled={!prompt.trim() || isStreaming}
                    onClick={handleSendMessage}
                  >
                    <Send className="h-4 w-4 bg-black " />
                    <span className="sr-only">Send message</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
