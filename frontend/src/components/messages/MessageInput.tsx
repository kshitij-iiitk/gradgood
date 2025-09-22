"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import useConversation from "@/zustand/useConversation";
import GPayButton from "../gpaybutton/GPayButton";
import useSendMessage from "@/hooks/messages/useSendMessage";
import useGetItem from "@/hooks/items/useGetItem";
import { Send } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import useGetConversations from "@/hooks/conversations/useGetConverstions";

export default function MessageInput() {

  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const { item, getItem } = useGetItem();
  const [transaction, setTransaction] = useState<null | {
    _id: string;
    fromUser: string;
    toUser: { name: string; upiId: string };
    amount: number;
    upiId: string;
    itemId: string;
    status: "pending" | "completed";
  }>(null);

  const { selectedConversation } = useConversation();
  const { refetch } = useGetConversations();
  const { sendMessage, loading } = useSendMessage();
  const inputRef = useRef<HTMLInputElement>(null);
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (!selectedConversation?.itemId) return;

    getItem(selectedConversation.itemId);
    console.log("Fetching item with ID:", selectedConversation.itemId);
  }, [selectedConversation?.itemId]);



  const otherParticipant = selectedConversation?.participants.find(
    (p) => p._id !== authUser?._id
  );
  useEffect(() => {
    if (!otherParticipant || !authUser || !selectedConversation?.itemId) return;

    setTransaction((prev) => ({
      _id: prev?._id ?? crypto.randomUUID(), // keep same ID if exists
      fromUser: authUser._id,
      toUser: {
        name: otherParticipant.userName || "User",
        upiId: otherParticipant.upiId || "user@upi",
      },
      itemId: selectedConversation.itemId,
      amount: parseInt(text || "0", 10),
      upiId: otherParticipant.upiId || "user@upi",
      status: prev?.status ?? "pending",
    }));
    console.log("Other participant changed:", otherParticipant);
  }, [otherParticipant, authUser, selectedConversation?.itemId, text]);


 if (item) {
      console.log("Fetched item:", item);
    }
  console.log("sdfdsffd: ", otherParticipant);


  const isNumber = /^\d+$/.test(text.trim());

  const handleSend = async () => {
    if (!text.trim() || !selectedConversation) return;
    await sendMessage(text);
    setText("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent form submission or other default behaviors
      handleSend();
    }
  };

  // Additional mobile-friendly handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  const handlePaymentConfirmed = async (id: string) => {
    // Call your API to mark transaction complete
    await fetch(`/api/transactions/confirm/${id}`, { method: "POST" });

    setTransaction((prev) =>
      prev ? { ...prev, status: "completed" } : prev
    );

    await sendMessage(
      `Paid ₹${transaction?.amount} to ${otherParticipant?.userName}`
    );
    refetch()
    setText("");
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <div
          className={`
            relative flex items-center gap-3 p-3 rounded-2xl transition-all duration-300
            ${isFocused
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
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>

          {/* Send or Pay Button */}
          {isNumber && item && authUser && otherParticipant && item?.belongTo._id !== authUser?._id && !item.sold ? (
            <GPayButton
              transaction={transaction}
              setTransaction={setTransaction}
              onConfirmPayment={handlePaymentConfirmed}
            />
          ) : (
            <Button
              onClick={handleSend}
              disabled={loading || !text.trim()}
              className={`
              relative p-3 rounded-xl transition-all duration-300 border-0 overflow-hidden group
              ${text.trim() && !loading
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
                  : "bg-white/10 hover:bg-white/20 text-white/50"
                }
            `}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send
                  className={`w-5 h-5 transition-all duration-300 ${text.trim()
                    ? "text-white group-hover:translate-x-0.5"
                    : "text-white/50"
                    }`}
                />
              )}
            </Button>
          )}
        </div></form>
    </div>
  );
}