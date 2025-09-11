"use client";

import ReactDOM from "react-dom";
import { QRCodeCanvas } from "qrcode.react"

interface PaymentQRProps {
  transaction: {
    id: string;
    fromUser: string;
    toUser: { name: string; upiId: string };
    upiLink: string;
    status: "pending" | "completed";
    amount: number;
    qrCode?: string; // add if backend sends QR image
  };
  loading: boolean;
  onClose: () => void;
  onConfirmPayment: () => void;
}

export default function PaymentQR({
  transaction,
  loading,
  onClose,
  onConfirmPayment,
}: PaymentQRProps) {
  if (typeof window === "undefined") return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Modal Card */}
      <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 
        backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 max-w-md w-full text-white">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition"
        >
          ✕
        </button>

        {/* QR Section */}
        <div className="space-y-6 text-center">
          <h2 className="text-xl font-semibold">Scan & Pay</h2>
          {transaction.upiLink ? (
            <div className="p-4 w-fit rounded-2xl bg-white shadow-lg">
              <QRCodeCanvas value={transaction.upiLink} size={200} />
            </div>
          ) : (
            <div className="mx-auto w-48 h-48 rounded-lg bg-slate-800 flex items-center justify-center text-white/60">
              No QR available
            </div>
          )}

          <p className="text-sm opacity-80">
            Pay <span className="font-bold">₹{transaction.amount}</span> to{" "}
            <span className="font-semibold">{transaction.toUser.name}</span>
          </p>

          {/* Confirm Button */}
          <button
            onClick={onConfirmPayment}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 
              hover:from-green-600 hover:to-emerald-700 font-medium shadow-lg 
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Confirming..." : "Confirm Payment"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
