"use client";

import { createPortal } from "react-dom";
import { QRCodeCanvas } from "qrcode.react";
import { Copy, X, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export interface Transaction {
  _id: string;
  fromUser?: string;
  toUser: { name: string; upiId: string };
  amount: number;
  upiId?: string;
  upiLink?: string;
  status: "pending" | "completed";
}

interface PaymentQRModalProps {
  transaction: Transaction | null;
  loading: boolean;
  onClose: () => void;
  onConfirmPayment: () => void;
}

export default function PaymentQRModal({
  transaction,
  loading,
  onClose,
  onConfirmPayment,
}: PaymentQRModalProps) {
  if (!transaction) return null; // handle null transaction safely

  const handleCopyUPI = async () => {
    try {
      const upiToCopy = transaction.upiId ?? transaction.toUser.upiId;
      await navigator.clipboard.writeText(upiToCopy);
      toast.success("UPI ID copied to clipboard!");
    } catch {
      console.log("Failed to copy UPI ID");
    }
  };

  const payUri =
    transaction.upiLink ??
    `upi://pay?pa=${encodeURIComponent(transaction.upiId ?? transaction.toUser.upiId)}&pn=${encodeURIComponent(
      transaction.toUser.name
    )}&am=${transaction.amount}&cu=INR`;

  return createPortal(
    <div className="fixed inset-0 z-[999999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 max-w-md w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-green-500/5" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10 flex flex-col items-center space-y-6">
          <h2 className="text-2xl font-bold text-white">Scan to Pay</h2>

          <div className="p-4 rounded-2xl bg-white shadow-lg">
            <QRCodeCanvas value={payUri} size={200} />
          </div>

          <div className="w-full space-y-3">
            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-gray-400">Amount</span>
              <span className="text-white font-bold text-lg">₹{transaction.amount}</span>
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-gray-400">To</span>
              <span className="text-white font-medium">{transaction.toUser?.name ?? "Unknown"}</span>
            </div>
          </div>

          <div className="w-full space-y-3">
            <button
              onClick={handleCopyUPI}
              className="w-full p-3 rounded-xl bg-gradient-to-r from-slate-700 to-slate-800 text-white"
            >
              <Copy className="w-4 h-4 inline-block mr-2" />
              Copy UPI ID
            </button>

            {transaction.status === "pending" ? (
              <button
                onClick={onConfirmPayment}
                disabled={loading}
                className="w-full p-3 rounded-xl bg-green-500 text-white"
              >
                {loading ? "Confirming..." : <><CheckCircle className="inline-block w-4 h-4 mr-2" />I have Paid</>}
              </button>
            ) : (
              <div className="w-full p-3 rounded-xl bg-green-100 text-green-700 text-center">Payment Completed</div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
