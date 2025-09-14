"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import PaymentQRModal from "./PaymentQR";

interface Transaction {
  id: string;
  fromUser: string;
  toUser: {
    name: string;
    upiId: string;
  };
  amount: number;
  upiId: string;
  status: "pending" | "completed";
}

interface GPayButtonProps {
  transaction: Transaction;
  onConfirmPayment: (id: string) => Promise<void>;
}

export default function GPayButton({ transaction, onConfirmPayment }: GPayButtonProps) {
  const [loading, setLoading] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [hasInitiatedPayment, setHasInitiatedPayment] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // ✅ Ensure safe usage of navigator for Next.js SSR
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    }
  }, []);

  const handlePayClick = () => {
    if (!transaction.upiId) {
      toast.error("No UPI ID available");
      return;
    }

    const upiLink = `upi://pay?pa=${transaction.upiId}&pn=${encodeURIComponent(
      transaction.toUser?.name || "Receiver"
    )}&am=${transaction.amount}&cu=INR`;

    setHasInitiatedPayment(true);

    if (isMobile) {
      window.location.href = upiLink;
    } else {
      setIsQRModalOpen(true);
    }
  };

  const handleConfirmPayment = async () => {
    try {
      setLoading(true);
      await onConfirmPayment(transaction.id);
      toast.success("Payment confirmed!");
      setIsQRModalOpen(false);
    } catch (error) {
      console.error("Payment confirmation failed:", error);
      toast.error("Failed to confirm payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!hasInitiatedPayment ? (
        <button
          onClick={handlePayClick}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium flex items-center justify-center space-x-2 transition-all duration-200 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Pay with GPay</span>}
        </button>
      ) : (
        transaction.status === "pending" && (
          <button
            onClick={handleConfirmPayment}
            disabled={loading}
            className="mt-2 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium flex items-center justify-center space-x-2 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? "Confirming..." : "I have Paid"}
          </button>
        )
      )}

      {isQRModalOpen && (
        <PaymentQRModal
          transaction={transaction}
          loading={loading}
          onClose={() => setIsQRModalOpen(false)}
          onConfirmPayment={handleConfirmPayment}
        />
      )}
    </>
  );
}
