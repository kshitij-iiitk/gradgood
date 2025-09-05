import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import useConversation from "@/zustand/useConversation";
import { type Conversation as FrontendConversation } from "@/types/conversation";
import { type User } from "@/context/AuthContext";

interface ConversationResponse {
  _id: string;
  participants: string[]; // IDs from backend
  messages: any[];
  createdAt: string;
  updatedAt: string;
}

export const useCreateConversation = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setSelectedConversation } = useConversation();

  const makeConversation = async (
    receiverData: Pick<User, "_id" | "userName" | "email" | "profilePic">
  ) => {
    const authUserStr = localStorage.getItem("User");
    if (!authUserStr) {
      toast.error("User not logged in");
      return;
    }

    const authUser: User = JSON.parse(authUserStr);

    setLoading(true);
    try {
      const res = await fetch(`/api/user/create/${receiverData._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to create conversation");

      const data: ConversationResponse = await res.json();

      const participants = [
        {
          _id: authUser._id,
          name: authUser.userName || "",
          email: authUser.email || "",
          userName: authUser.userName || "",
          profilePic: authUser.profilePic || "", // added
        },
        {
          _id: receiverData._id,
          name: receiverData.userName || "",
          email: receiverData.email || "",
          userName: receiverData.userName || "",
          profilePic: receiverData.profilePic || "", // added
        },
      ];

      const conversation: FrontendConversation = {
        _id: data._id,
        participants,
        messages: data.messages || [],
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };

      setSelectedConversation(conversation);
      navigate(`/chats`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to create conversation");
    } finally {
      setLoading(false);
    }
  };

  return { makeConversation, loading };
};
