"use client";

import { MessageCircle, Sparkles } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] relative overflow-hidden">
     
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl animate-pulse animation-delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-cyan-500/15 rounded-full blur-2xl animate-pulse animation-delay-500" />
      </div>

      <div className="relative z-10 text-center space-y-8 p-8 max-w-md mx-auto">
        {/* Icon container with glow effect */}
        <div className="relative mx-auto w-24 h-24 mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse" />
          <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-white/10 shadow-2xl">
            <MessageCircle className="w-10 h-10 text-blue-400" />
            
            {/* Floating sparkles */}
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            </div>
            <div className="absolute -bottom-2 -left-2">
              <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse animation-delay-500" />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            No Chat Selected
          </h2>
          
         
        </div>

       
      </div>
    </div>
  );
};

export default NoChatSelected;