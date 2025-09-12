"use client";

import { createPortal } from "react-dom";
import { QRCodeCanvas } from "qrcode.react";
import { Copy, X, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

interface Transaction {
  id: string;
  fromUser: string;
  toUser: { name: string; upiId: string };
  amount: number;
  upiId: string;
  status: "pending" | "completed";
}

interface PaymentQRModalProps {
  transaction: Transaction;
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
  const handleCopyUPI = async () => {
    try {
      await navigator.clipboard.writeText(transaction.toUser.upiId);
      toast.success("UPI ID copied to clipboard!");
    } catch {
      toast.error("Failed to copy UPI ID");
    }
  };

  // ✅ Render modal using a portal
  return createPortal(
    <div className="fixed inset-0 z-[999999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 max-w-md w-full overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-green-500/5" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-500/10 to-transparent rounded-full blur-2xl" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-300 group"
        >
          <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
        </button>

        <div className="relative z-10 flex flex-col items-center space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white">Scan to Pay</h2>
          </div>

          {/* QR Code */}
          <div className="p-4 rounded-2xl bg-white shadow-lg">
            <QRCodeCanvas value={transaction.upiLink} size={200} />
          </div>

          {/* Payment details */}
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

          {/* Action buttons */}
          <div className="w-full space-y-3">
            <button
              onClick={handleCopyUPI}
              className="w-full flex items-center justify-center space-x-2 p-3 rounded-xl bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-white transition-all duration-300 hover:scale-105 group"
            >
              <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Copy UPI ID</span>
            </button>

            {transaction.status === "pending" && (
              <button
                onClick={onConfirmPayment}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/25 disabled:opacity-50 group"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Confirming...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>I have Paid</span>
                  </>
                )}
              </button>
            )}

            {transaction.status === "completed" && (
              <div className="w-full flex items-center justify-center space-x-2 p-3 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span>Payment Completed</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
