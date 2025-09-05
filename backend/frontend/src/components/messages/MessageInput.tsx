"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import useConversation from "@/zustand/useConversation";
import GPayButton from "../gpaybutton/Gpaybutton";
import useSendMessage from "@/hooks/messages/useSendMessage";
import { IoIosSend } from "react-icons/io";


export default function MessageInput() {
  const [text, setText] = useState("");
  const { selectedConversation } = useConversation();
  const { sendMessage, loading } = useSendMessage();

  const isNumber = /^\d+$/.test(text.trim());

  const handleSend = async () => {
    if (!text.trim() || !selectedConversation) return;
    await sendMessage(text);
    setText(""); // clear after sending
  };

  const handlePaymentSuccess = (msg: string) => {
    if (!selectedConversation) return;
    sendMessage(msg); 
    setText("");
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        type="text"
        className="flex-1 border border-gray-600 rounded px-3 py-2 bg-black/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Send Text or Pay..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !isNumber && handleSend()}
      />

      {isNumber ? (
        <GPayButton
          fromUser="me"
          toUser={{
            name: selectedConversation?.participants.find(
              (p) => p._id !== selectedConversation.participants[0]._id
            )?.userName || "User",
            upiId: "example@upi",
          }}
          amount={parseInt(text, 10)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      ) : (
        <Button onClick={handleSend} disabled={loading}>
          {loading ? "Sending..." : <IoIosSend />}
        </Button>
      )}
    </div>
  );
}
