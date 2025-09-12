// src/hooks/conversations/useCreateConversation.tsx(39,9): error TS2739: Type '{ _id: string; userName: string; rollNumber: string; email?: string | undefined; profilePic?: string | undefined; token?: string | undefined; upiId: string; phoneNumber?: string | undefined; }' is missing the following properties from type '{ name: any; email: any; _id: string; userName?: string | undefined; profilePic: string; upiID: string; }': name, upiID
// src/hooks/conversations/useCreateConversation.tsx(40,9): error TS2739: Type '{ email?: string | undefined; _id: string; userName: string; profilePic?: string | undefined; }' is missing the following properties from type '{ name: any; email: any; _id: string; userName?: string | undefined; profilePic: string; upiID: string; }': name, upiID

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import useConversation from "@/zustand/useConversation";
import { type Conversation as FrontendConversation } from "@/types/conversation";
import { type User } from "@/context/AuthContext";

interface ConversationResponse {
  _id: string;
  participants: string[];
  messages: any[];
  createdAt: string;
  updatedAt: string;
}


export const useCreateConversation = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setSelectedConversation } = useConversation();

  const authUser: User | null = useMemo(() => {
    const stored = localStorage.getItem("User");
    return stored ? JSON.parse(stored) : null;
  }, []);

  const makeConversation = async (
    receiverData: Pick<User, "_id" | "userName" | "email" | "profilePic">
  ) => {
    if (!authUser) {
      toast.error("User not logged in");
      return;
    }

    // Optimistic conversation object
    const optimisticConversation: FrontendConversation = {
      _id: "temp-" + Date.now(),
      participants: [
        {
          _id: authUser._id,
          userName: authUser.userName,
          email: authUser.email ?? "",
          profilePic: authUser.profilePic ?? "",
          upiId: authUser.upiId ?? "",
        },
        {
          _id: receiverData._id,
          userName: receiverData.userName,
          email: receiverData.email ?? "",
          profilePic: receiverData.profilePic ?? "",
          upiId: (receiverData as any).upiId ?? "", 
        },
      ],
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSelectedConversation(optimisticConversation);
    navigate("/chats");
    setLoading(true);

    try {
      const res = await fetch(`/api/user/create/${receiverData._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to create conversation");

      const data: ConversationResponse = await res.json();

      // Merge backend response with frontend participants
      const conversation: FrontendConversation = {
        ...optimisticConversation,
        _id: data._id,
        messages: data.messages || [],
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };

      setSelectedConversation(conversation);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to create conversation");
    } finally {
      setLoading(false);
    }
  };

  return { makeConversation, loading };
};
