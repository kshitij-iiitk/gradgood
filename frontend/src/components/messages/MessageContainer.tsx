"use client";

import { useEffect, useRef } from "react";
import useConversation from "@/zustand/useConversation";
import MessageInput from "./MessageInput";
import Message from "./Message";
import { useMessageStream } from "@/hooks/useMessageStream";
import useGetMessage from "@/hooks/messages/useGetMessage";

const MessageContainer = () => {
  const { selectedConversation } = useConversation();
  const { messages, loading } = useGetMessage();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useMessageStream(selectedConversation?._id);

  // Auto scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedConversation) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-sm rounded-2xl border border-white/5 p-6">
        <p className="text-lg text-center leading-relaxed">
          Select a conversation to start messaging
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-xl overflow-hidden lg:rounded-2xl">

      {/* Messages Area */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-6 space-y-5 scrollbar-hide relative hide-scrollbar">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
          />
        </div>

        <div className="relative z-10">
          {loading ? <></> : (messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
              <div>
                <p className="text-white/80 text-lg font-medium">
                  Start the conversation!
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <Message
                key={msg._id}
                message={msg}
                isFirst={
                  index === 0 ||
                  messages[index - 1]?.senderId?._id !== msg.senderId?._id
                }
                isLast={
                  index === messages.length - 1 ||
                  messages[index + 1]?.senderId?._id !== msg.senderId?._id
                }
              />
            ))
          ))}
        </div>

        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="relative border-t border-white/10 px-4 py-3 bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm flex-shrink-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
        <div className="relative">
          <MessageInput />
        </div>
      </div>
    </div>
  );
};

export default MessageContainer;