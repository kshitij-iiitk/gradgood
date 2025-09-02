"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "@/context/AuthContext";

interface GPayButtonProps {
   fromUser: string;
   toUser: { name: string; upiId: string };
   amount: number;
   onPaymentSuccess?: (msg: string) => void; // NEW
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
   const { authUser } = useAuthContext();

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
            body: JSON.stringify({ fromUser: authUser?.gPayID, toUser, amount }),
         });

         if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || "Failed to create transaction");
         }

         const data: Transaction = await res.json();
         setTransaction(data);
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
         const res = await fetch(
            `/api/transactions/${transaction.id}/confirm`,
            { method: "POST" }
         );
         const data = await res.json();
         setTransaction(data);

         if (data.status === "completed") {
            const msg = `You paid ₹${data.amount} to ${data.toUser.name}`;
            toast.success("Payment confirmed!");
            onPaymentSuccess?.(msg); // notify parent
         }
      } catch (err: any) {
         toast.error(err.message || "Failed to confirm payment");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="space-y-2">
         {!transaction ? (
            <button
               onClick={handleCreateTransaction}
               className="px-4 py-2 bg-blue-600 text-white rounded"
               disabled={loading}
            >
               {loading ? "Processing..." : `Pay to ${toUser.name}`}
            </button>
         ) : (
            <div className="flex flex-col gap-2">

               {window.innerWidth < 1024 && (
                  <a
                     href={transaction.upiLink}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-blue-600 underline"
                  >
                     GPay
                  </a>
               )}

               {transaction.status === "pending" && (
                  <button
                     onClick={handleConfirmPayment}
                     className="px-4 py-2 bg-green-600 text-white rounded"
                     disabled={loading}
                  >
                     {loading ? "Confirming..." : "I have Paid"}
                  </button>
               )}
            </div>
         )}
      </div>
   );
}
