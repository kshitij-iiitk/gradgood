"use client";

import MessageContainer from "../messages/MessageContainer";

const Chat = () => {
  return (
    <div className="flex flex-col flex-1 h-[90vh] lg:h-[100vh] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95 backdrop-blur-xl" />
      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 via-transparent to-purple-900/10" />
      
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-1000" />
      </div>
      
      <div className="relative z-10 flex flex-col h-full  shadow-2xl overflow-hidden">
      <MessageContainer />
    </div>
    </div>
  );
};

export default Chat;