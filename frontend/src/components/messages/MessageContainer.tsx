"use client";

import { useEffect, useRef } from "react";
import useConversation from "@/zustand/useConversation";
import MessageInput from "./MessageInput";
import Message from "./Message";
import { useMessageStream } from "@/hooks/useMessageStream";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { useAuthContext } from "@/context/AuthContext";
import useGetMessage from "@/hooks/messages/useGetMessage";

const MessageContainer = () => {
  const { selectedConversation } = useConversation();
  const { messages } = useGetMessage();
  const { authUser } = useAuthContext();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useMessageStream(selectedConversation?._id);

  // Auto scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedConversation)
    return <p className="p-4 text-gray-400">Select a conversation</p>;

  const header =
    selectedConversation.participants.find(
      (p) => p._id !== authUser?._id
    ) || selectedConversation.participants[0];

  const profilePic = header.profilePic;

  return (
    <div className="flex flex-col h-[100%] bg-black/70 backdrop-blur-md border shadow-md">
      {/* Header */}
      <div className="flex items-center border-b  p-4 bg-black/60 shrink-0">
        <Avatar className="w-10 h-10 mr-2">
          <AvatarImage src={profilePic} alt="profile" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="text-lg text-white font-semibold">
          {header?.userName || "Unknown User"}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 hide-scrollbar">
        {messages.map((msg) => (
          <Message key={msg._id} message={msg} />
        ))}
        {/* Dummy div to scroll to bottom */}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-700 p-4 bg-black/60 shrink-0">
        <MessageInput />
      </div>
    </div>
  );
};

export default MessageContainer;
