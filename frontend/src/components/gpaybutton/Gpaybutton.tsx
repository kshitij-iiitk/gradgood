"use client";

import { useState, useEffect } from "react";
import { Loader2, CheckCircle } from "lucide-react";
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
  setTransaction: React.Dispatch<React.SetStateAction<Transaction | null>>;
  onConfirmPayment: (id: string) => Promise<void>;
}

export default function GPayButton({
  transaction,
  setTransaction,
  onConfirmPayment,
}: GPayButtonProps) {
  const [loading, setLoading] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
    }
  }, []);

  // ✅ Show "Payment Completed" instead of button when done
  if (transaction.status === "completed") {
    return (
      <div className="flex items-center space-x-2 text-green-600 font-medium p-2 bg-green-50 rounded-lg shadow-sm">
        <CheckCircle className="w-5 h-5" />
        <span>Payment Completed</span>
      </div>
    );
  }

  const handlePayClick = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/transactions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transaction),
      });

      if (!res.ok) throw new Error("Failed to create transaction");
      const createdTx = await res.json();

      setTransaction({
        ...transaction,
        id: createdTx._id,
        status: createdTx.status,
      });

      const upiLink = `upi://pay?pa=${transaction.toUser.upiId}&pn=${encodeURIComponent(
        transaction.toUser.name
      )}&am=${transaction.amount}&cu=INR`;

      if (isMobile && transaction.status === "completed" ) {
        window.location.href = upiLink;
      } else {
        setIsQRModalOpen(true);
      }
    } catch (err) {
      console.error("Error creating transaction:", err);
      toast.error("Failed to create transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handlePayClick}
        disabled={loading}
        className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-medium flex items-center justify-center space-x-2 transition-all duration-200 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <span>Pay with GPay</span>
        )}
      </button>

      {isQRModalOpen && (
        <PaymentQRModal
          transaction={transaction}
          loading={loading}
          onClose={() => setIsQRModalOpen(false)}
          onConfirmPayment={() => onConfirmPayment(transaction.id)}
        />
      )}
    </>
  );
}
