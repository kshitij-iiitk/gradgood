"use client";

import { type Message as MessageType } from "@/types/message";
import { useAuthContext } from "@/context/AuthContext";
import { extractTime } from "@/utils/extractTime";

interface Props {
  message: MessageType;
}

const Message = ({ message }: Props) => {
  const { authUser } = useAuthContext();
  const formattedTime = extractTime(message.createdAt || "");
  
  const fromMe = !authUser?._id || !message.senderId?._id 
    ? true 
    : message.senderId._id === authUser._id;

  const bubbleBg = fromMe ? "bg-gray-700 text-white" : "bg-indigo-600 text-white";
  const alignClass = fromMe ? "justify-end" : "justify-start";
  const roundedClass = "rounded-lg";

  return (
    <div className={`flex ${alignClass}`}>
      <div className={`px-4 py-2 max-w-xs ${bubbleBg} ${roundedClass} break-words`}>
        <p>{message.message}</p>
        <span className="text-xs opacity-50 block mt-1 text-right">{formattedTime}</span>
      </div>
    </div>
  );
};

export default Message;