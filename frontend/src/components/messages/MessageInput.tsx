"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import useConversation from "@/zustand/useConversation";
import GPayButton from "../gpaybutton/Gpaybutton";
import useSendMessage from "@/hooks/messages/useSendMessage";
import { Send, Smile, Paperclip, Mic, CreditCard } from "lucide-react";

export default function MessageInput() {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const { selectedConversation } = useConversation();
  const { sendMessage, loading } = useSendMessage();
  const inputRef = useRef<HTMLInputElement>(null);

  const isNumber = /^\d+$/.test(text.trim());

  const handleSend = async () => {
    if (!text.trim() || !selectedConversation) return;
    await sendMessage(text);
    setText("");
    inputRef.current?.focus();
  };

  const handlePaymentSuccess = (msg: string) => {
    if (!selectedConversation) return;
    sendMessage(msg);
    setText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isNumber) {
        handleSend();
      }
    }
  };

  return (
    <div className="relative">
      {/* Input container with glassmorphism */}
      <div className={`
        relative flex items-center gap-3 p-3 rounded-2xl transition-all duration-300
        ${isFocused
          ? 'bg-gradient-to-r from-white/15 to-white/10 border-2 border-blue-400/50 shadow-lg shadow-blue-500/20'
          : 'bg-gradient-to-r from-white/10 to-white/5 border border-white/20 hover:border-white/30'
        }
        backdrop-blur-sm
      `}>
        {/* Background glow effect */}
        {isFocused && (
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 -z-10" />
        )}

        {/* Attachment button */}
        <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 group">
          <Paperclip className="w-5 h-5 text-white/70 group-hover:text-white group-hover:rotate-12 transition-all" />
        </button>

        {/* Text input */}
        <div className="flex-1 relative">
      <input
            ref={inputRef}
        type="text"
            className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-base py-2 px-1"
            placeholder={isNumber ? "Enter amount to pay..." : "Type a message..."}
        value={text}
        onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          {/* Input type indicator */}
          {isNumber && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
              <CreditCard className="w-4 h-4 text-green-400" />
              <span className="text-xs text-green-400 font-medium">Payment</span>
            </div>
          )}
        </div>

        {/* Emoji button */}
        <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 group">
          <Smile className="w-5 h-5 text-white/70 group-hover:text-yellow-400 group-hover:scale-110 transition-all" />
        </button>

        {/* Voice message button */}
        <button className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 group">
          <Mic className="w-5 h-5 text-white/70 group-hover:text-red-400 group-hover:scale-110 transition-all" />
        </button>

        {/* Send/Pay button */}
      {isNumber ? (
          <div className="relative">
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
          </div>
      ) : (
          <Button
            onClick={handleSend}
            disabled={loading || !text.trim()}
            className={`
              relative p-3 rounded-xl transition-all duration-300 border-0 overflow-hidden group
              ${text.trim() && !loading
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105'
                : 'bg-white/10 hover:bg-white/20 text-white/50'
              }
            `}
          >
            {/* Button glow effect */}
            {text.trim() && !loading && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 blur-sm -z-10" />
            )}

            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className={`w-5 h-5 transition-all duration-300 ${
                text.trim() ? 'text-white group-hover:translate-x-0.5' : 'text-white/50'
                }`} />
            )}
        </Button>
      )}
    </div>

      {/* Typing indicator placeholder */}
      {isFocused && (
        <div className="absolute -bottom-6 left-4 text-xs text-white/40">
          {isNumber ? "💳 Payment mode active" : "💬 Type your message"}
        </div>
      )}
    </div>
  );
}