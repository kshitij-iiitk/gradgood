"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import useGetUser from "@/hooks/useGetUser";
import { useAuthContext } from "@/context/AuthContext";
import { QRCodeCanvas } from "qrcode.react";
import { CreditCard, Copy, X, Smartphone, QrCode, CheckCircle, Clock } from "lucide-react";

interface GPayButtonProps {
  fromUser: string;
  toUser: { name: string; upiId: string };
  amount: number;
  onPaymentSuccess?: (msg: string) => void;
  itemId?: string;
}

interface Transaction {
  id: string;
  fromUser: string;
  toUser: { name: string; upiId: string };
  amount: number;
  upiLink: string;
  status: "pending" | "completed";
}

export default function GPayButton({
  toUser,
  amount,
  onPaymentSuccess,
}: GPayButtonProps) {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const { authUser } = useAuthContext();
  const { refetch, user } = useGetUser();

  const handleCreateTransaction = async () => {
    setLoading(true);
    try {
      if (!authUser?.gPayID) {
        toast.error("Missing Google Pay ID");
        return;
      }

      const res = await fetch("/api/transactions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromUser: authUser.gPayID, toUser, amount }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create transaction");
      }

      const data: Transaction = await res.json();
      setTransaction(data);

      if (window.innerWidth >= 1024) setShowQR(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to create transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!transaction) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/transactions/${transaction.id}/confirm`, {
        method: "POST",
      });
      const data = await res.json();
      setTransaction(data);

      if (data.status === "completed") {
        const msg = `You paid ₹${data.amount} to ${data.toUser.name}`;
        toast.success("Payment confirmed!");
        onPaymentSuccess?.(msg);
        setShowQR(false);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to confirm payment");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUPI = async () => {
    if (!transaction) return;
    try {
      await navigator.clipboard.writeText(transaction.toUser.upiId);
      toast.success("UPI ID copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy UPI ID");
    }
  };

  return (
    <div className="space-y-2">
      {!transaction ? (
        <button
          onClick={handleCreateTransaction}
          disabled={loading}
          className="group relative px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" />

          <div className="relative flex items-center space-x-2">
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                <span>Pay ₹{amount}</span>
              </>
            )}
          </div>
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          {/* Mobile payment link */}
          {window.innerWidth < 1024 && (
          <a
            href={transaction.upiLink}
            target="_blank"
            rel="noopener noreferrer"
              className="group inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/25"
            >
              <Smartphone className="w-4 h-4" />
              <span>Open GPay</span>
            </a>
          )}

          {/* Desktop QR Modal */}
          {showQR && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 max-w-md w-full overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-green-500/5" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-500/10 to-transparent rounded-full blur-2xl" />

                {/* Close button */}
                <button
                  onClick={() => setShowQR(false)}
                  className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-300 group"
                >
                  <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                </button>

                <div className="relative z-10 flex flex-col items-center space-y-6">
                  {/* Header */}
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/25">
                      <QrCode className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Scan to Pay</h2>
                    <p className="text-gray-400">Use any UPI app to scan and pay</p>
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
                      <span className="text-white font-medium">{transaction.toUser.name}</span>
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
                        onClick={handleConfirmPayment}
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}