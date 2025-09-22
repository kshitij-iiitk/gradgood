"use client";

import { useState, useEffect } from "react";
import { type User } from "@/context/AuthContext";
import useSendMessage from "@/hooks/messages/useSendMessage";
import GPayButton,{type Transaction} from "../gpaybutton/GPayButton";

interface ItemActionProps {
  transaction: Transaction | null;
  otherParticipant: User | null;
  refetch: () => void;       // optional: to refresh data after payment
  setText: (text: string) => void; // optional: to clear input after payment
}

export default function ItemActions({
  transaction,
  otherParticipant,
  refetch,
  setText,
}: ItemActionProps) {
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(transaction);
  const { sendMessage } = useSendMessage();

  // Ensure transaction has an ID before using GPayButton
  useEffect(() => {
    if (!currentTransaction && otherParticipant) {
      setCurrentTransaction({
        id: crypto.randomUUID(), // generate ID if none exists
        fromUser: "",            // set the current user ID if available
        toUser: { 
          name: otherParticipant.userName || "User", 
          upiId: otherParticipant.upiId || "user@upi" 
        },
        itemId: "",               // set item ID if available
        amount: 0,
        upiId: otherParticipant.upiId || "user@upi",
        status: "pending",
      });
    }
  }, [currentTransaction, otherParticipant]);

  const handlePaymentConfirmed = async (id: string) => {
    if (!currentTransaction) return;

    try {
      // Call backend API to confirm
      const res = await fetch(`/api/transactions/confirm/${id}`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to confirm payment");

      const updatedTx: Transaction = await res.json();

      // Update UI
      setCurrentTransaction({ ...currentTransaction, status: updatedTx.status });

      // Send message
      await sendMessage(
        `Paid ₹${currentTransaction.amount} to ${otherParticipant?.userName ?? "User"}`
      );

      // Refresh and clear input
      refetch?.();
      setText?.("");
    } catch (err) {
      console.error("Error confirming payment:", err);
      alert("Failed to confirm payment. Try again.");
    }
  };

  if (!currentTransaction || !otherParticipant) return null;

  return (
    <div className="flex gap-2">
      <GPayButton
        transaction={currentTransaction}
        setTransaction={setCurrentTransaction}
        onConfirmPayment={handlePaymentConfirmed}
      />
    </div>
  );
}
