"use client";

import GPayButton from "../gpaybutton/Gpaybutton";
import useGetItem from "@/hooks/items/useGetItem";
import { ShoppingCart, User, IndianRupee, Package, Star } from "lucide-react";

export default function ItemPayment() {
  const { item, loading: itemLoading } = useGetItem();

  if (itemLoading) {
    return (
      <div className="relative p-6 rounded-2xl bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-cyan-500/5" />
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-2xl animate-pulse" />
        
        <div className="relative z-10 flex items-center justify-center space-x-3">
          <div className="w-6 h-6 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
          <span className="text-white/80 font-medium">Loading item details...</span>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="relative p-6 rounded-2xl bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-xl border border-red-500/20 shadow-2xl overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-red-600/5" />
        
        <div className="relative z-10 flex items-center justify-center space-x-3 text-red-400">
          <Package className="w-6 h-6" />
          <span className="font-medium">Item not found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative p-6 rounded-2xl bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden group hover:scale-[1.02] transition-all duration-300">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-green-500/5" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-green-500/10 to-transparent rounded-full blur-2xl" />
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Purchase Item
            </h3>
            <p className="text-gray-400 text-sm">Complete your purchase securely</p>
          </div>
        </div>

        {/* Item details */}
        <div className="space-y-4">
          {/* Seller info */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                <User className="w-5 h-5 text-white/80" />
              </div>
              <div>
                <p className="text-white font-medium">{item.userName}</p>
                <p className="text-gray-400 text-sm">Seller</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-white/80 text-sm">4.8</span>
            </div>
          </div>

          {/* Price display */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <IndianRupee className="w-5 h-5 text-green-400" />
                <span className="text-gray-300 font-medium">Total Amount</span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-400">₹{item.price}</p>
                <p className="text-green-400/70 text-sm">Including all taxes</p>
              </div>
            </div>
          </div>

          {/* Item info */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center space-x-3">
              <Package className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-white font-medium">Item Details</p>
                <p className="text-gray-400 text-sm">Secure payment via UPI</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment button */}
        <div className="pt-4 border-t border-white/10">
      <GPayButton
           fromUser="me"
            toUser={{ name: item.userName, upiId: item.gPayID }}
           amount={item.price} 
            itemId={item._id}
          />
        </div>

        {/* Security note */}
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span>Secure payment powered by UPI</span>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400/60 rounded-full animate-ping" />
      <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-green-400/60 rounded-full animate-ping animation-delay-1000" />
    </div>
  );
}