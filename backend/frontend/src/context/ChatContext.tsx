// src/context/SocketContext.tsx
"use client";

import { createContext, useContext, useState, type ReactNode } from "react";




interface ChatSelectedContextType {
  chatSelected: boolean;
  setChatSelected: (value: boolean) => void;
}

const ChatSelectedContext = createContext<ChatSelectedContextType | undefined>(undefined);

export const ChatSelectedProvider = ({ children }: { children: ReactNode }) => {
  const [chatSelected, setChatSelected] = useState(false);

  return (
    <ChatSelectedContext.Provider value={{ chatSelected, setChatSelected }}>
      {children}
    </ChatSelectedContext.Provider>
  );
};

// Custom hook
export const useChatSelected = () => {
  const context = useContext(ChatSelectedContext);
  if (!context) {
    throw new Error("useChatSelected must be used within a ChatSelectedProvider");
  }
  return context;
};