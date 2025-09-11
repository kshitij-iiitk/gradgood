"use client";

import { type Message as MessageType } from "@/types/message";
import { useAuthContext } from "@/context/AuthContext";
import { extractTime } from "@/utils/extractTime";
import { Check, CheckCheck, CreditCard } from "lucide-react";

interface Props {
  message: MessageType;
  isFirst?: boolean;
  isLast?: boolean;
}

const Message = ({ message, isFirst = false, isLast = false }: Props) => {
  const { authUser } = useAuthContext();
  const formattedTime = extractTime(message.createdAt || "");
  
  const fromMe = !authUser?._id || !message.senderId?._id 
    ? true 
    : message.senderId._id === authUser._id;

  // Check if message is a payment
  const isPayment = message.message.includes("paid ₹") || message.message.includes("Pay ₹");
  const paymentAmount = message.message.match(/₹(\d+)/)?.[1];

  const alignClass = fromMe ? "justify-end" : "justify-start";

  return (
    <div className={`flex ${alignClass} group mt-2`}>
      <div className={`
        relative max-w-xs lg:max-w-md px-4 py-3 rounded-2xl transition-all duration-300 group-hover:scale-[1.02]
        ${fromMe
          ? `
            ${isPayment
            ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25'
            : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
          }
            ${isFirst ? 'rounded-tr-md' : ''}
            ${isLast ? 'rounded-br-md' : ''}
          `
          : `
            ${isPayment
            ? 'bg-gradient-to-br from-orange-500/90 to-red-500/90 text-white shadow-lg shadow-orange-500/25'
            : 'bg-gradient-to-br from-slate-700/90 to-slate-800/90 text-white shadow-lg shadow-slate-500/25'
          }
            ${isFirst ? 'rounded-tl-md' : ''}
            ${isLast ? 'rounded-bl-md' : ''}
          `
        }
        backdrop-blur-sm border border-white/10
      `}>
        {/* Background glow effect */}
        <div className={`
          absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm
          ${fromMe
            ? (isPayment ? 'bg-gradient-to-br from-green-400/30 to-emerald-400/30' : 'bg-gradient-to-br from-blue-400/30 to-purple-400/30')
            : (isPayment ? 'bg-gradient-to-br from-orange-400/30 to-red-400/30' : 'bg-gradient-to-br from-slate-400/30 to-slate-500/30')
          }
        `} />

        {/* Message content */}
        <div className="relative z-10">
          {isPayment ? (
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-full bg-white/20">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <p className="font-medium">{message.message}</p>
                {paymentAmount && (
                  <p className="text-sm opacity-90 font-bold">₹{paymentAmount}</p>
                )}
              </div>
            </div>
          ) : (
            <p className="break-words leading-relaxed">{message.message}</p>
          )}

          {/* Message footer */}
          <div className="flex items-center justify-end space-x-1 mt-2">
            <span className="text-xs opacity-70 font-medium">{formattedTime}</span>
            {fromMe && (
              <div className="flex items-center">
                {/* Message status indicators */}
                <CheckCheck className="w-3 h-3 opacity-70" />
              </div>
            )}
          </div>
        </div>

        {/* Message tail */}
        <div className={`
          absolute w-0 h-0 
          ${fromMe
            ? 'right-0 top-0 border-l-8 border-t-8 border-l-transparent'
            : 'left-0 top-0 border-r-8 border-t-8 border-r-transparent'
          }
          ${isFirst ? 'block' : 'hidden'}
          ${fromMe
            ? (isPayment ? 'border-t-green-500' : 'border-t-blue-500')
            : (isPayment ? 'border-t-orange-500' : 'border-t-slate-700')
          }
        `} />
      </div>
    </div>
  );
};

export default Message;