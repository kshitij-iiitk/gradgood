// GPayButton.tsx
"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import PaymentQRModal, { type Transaction } from "./PaymentQR";

interface GPayButtonProps {
  transaction: Transaction;``
  onConfirmPayment: (id: string) => Promise<void>;
}

export default function GPayButton({ transaction, onConfirmPayment }: GPayButtonProps) {
  const [loading, setLoading] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [hasInitiatedPayment, setHasInitiatedPayment] = useState(false);

  const isMobile = typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const handlePayClick = () => {
    const upiIdToUse = transaction.upiId ?? transaction.toUser.upiId;
    if (!upiIdToUse) {
      toast.error("No UPI ID available");
      return;
    }

    const upiLink = `upi://pay?pa=${encodeURIComponent(upiIdToUse)}&pn=${encodeURIComponent(
      transaction.toUser.name
    )}&am=${transaction.amount}&cu=INR`;

    setHasInitiatedPayment(true);

    if (isMobile) {
      // mobile: redirect to UPI app
      window.location.href = upiLink;
    } else {
      // desktop: show QR modal (modal will build the same URI itself)
      setIsQRModalOpen(true);
    }
  };

  const handleConfirmPayment = async () => {
    try {
      setLoading(true);
      await onConfirmPayment(transaction.id);
      toast.success("Payment confirmed!");
      setIsQRModalOpen(false);
    } catch {
      toast.error("Failed to confirm payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!hasInitiatedPayment ? (
        <button onClick={handlePayClick} className="px-4 py-2 rounded-lg bg-blue-500 text-white" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Pay with GPay"}
        </button>
      ) : (
        transaction.status === "pending" && (
          <button onClick={handleConfirmPayment} className="mt-2 px-4 py-2 rounded-lg bg-green-500 text-white" disabled={loading}>
            {loading ? "Confirming..." : "I have Paid"}
          </button>
        )
      )}

      {isQRModalOpen && (
        <PaymentQRModal
          transaction={transaction}    // modal will use transaction.upiId
          loading={loading}
          onClose={() => setIsQRModalOpen(false)}
          onConfirmPayment={handleConfirmPayment}
        />
      )}
    </>
  );
}
