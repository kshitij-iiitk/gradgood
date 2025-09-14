"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import useConversation from "@/zustand/useConversation";
import GPayButton from "../gpaybutton/Gpaybutton";
import useSendMessage from "@/hooks/messages/useSendMessage";
import { Send } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";

export default function MessageInput() {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [transaction, setTransaction] = useState<null | {
    id: string;
    fromUser: string;
    toUser: { name: string; upiId: string };
    amount: number;
    upiId: string;
    status: "pending" | "completed";
  }>(null);

  const { selectedConversation } = useConversation();
  const { sendMessage, loading } = useSendMessage();
  const inputRef = useRef<HTMLInputElement>(null);
  const { authUser } = useAuthContext();

  const otherParticipant = selectedConversation?.participants.find(
    (p) => p._id !== authUser?._id
  );

  const isNumber = /^\d+$/.test(text.trim());

  const handleSend = async () => {
    if (!text.trim() || !selectedConversation) return;
    await sendMessage(text);
    setText("");
    inputRef.current?.focus();
  };

  const handlePaymentConfirmed = async (id: string) => {
    // Call your API to mark transaction complete
    await fetch(`/api/transactions/confirm/${id}`, { method: "PATCH" });

    setTransaction((prev) =>
      prev ? { ...prev, status: "completed" } : prev
    );

    await sendMessage(
      `Paid ₹${transaction?.amount} to ${otherParticipant?.userName}`
    );
    setText("");
  };

  return (
    <div className="relative">
      <div
        className={`
          relative flex items-center gap-3 p-3 rounded-2xl transition-all duration-300
          ${
            isFocused
              ? "bg-gradient-to-r from-white/15 to-white/10 border-2 border-blue-400/50 shadow-lg shadow-blue-500/20"
              : "bg-gradient-to-r from-white/10 to-white/5 border border-white/20 hover:border-white/30"
          }
          backdrop-blur-sm
        `}
      >
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-base py-2 px-1"
            placeholder={
              isNumber ? "Enter amount to pay..." : "Type a message..."
            }
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </div>

        {/* Send or Pay Button */}
        {isNumber ? (
          <GPayButton
            transaction={
              transaction ?? {
                id: crypto.randomUUID(),
                fromUser: authUser?._id || "me",
                toUser: {
                  name: otherParticipant?.userName || "User",
                  upiId: otherParticipant?.upiId || "user@upi",
                },
                amount: parseInt(text, 10),
                upiId: otherParticipant?.upiId || "user@upi",
                status: "pending",
              }
            }
            setTransaction={setTransaction}
            onConfirmPayment={handlePaymentConfirmed}
          />
        ) : (
          <Button
            onClick={handleSend}
            disabled={loading || !text.trim()}
            className={`
              relative p-3 rounded-xl transition-all duration-300 border-0 overflow-hidden group
              ${
                text.trim() && !loading
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
                  : "bg-white/10 hover:bg-white/20 text-white/50"
              }
            `}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send
                className={`w-5 h-5 transition-all duration-300 ${
                  text.trim()
                    ? "text-white group-hover:translate-x-0.5"
                    : "text-white/50"
                }`}
              />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
