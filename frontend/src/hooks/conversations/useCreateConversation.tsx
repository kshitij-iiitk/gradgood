import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import useConversation from "@/zustand/useConversation";

import { type Conversation as FrontendConversation } from "@/types/conversation";
import { type User } from "@/context/AuthContext";

interface ConversationResponse {
  _id: string;
  itemId: string;
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
    receiverData: Pick<User, "_id" | "userName" | "email" | "profilePic"> & { itemId: string }
  ) => {
    if (!authUser) {
      console.log("User not logged in");
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
      itemId: receiverData.itemId ?? "",
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
        body: JSON.stringify({ itemId: receiverData.itemId }),
      });

      if (!res.ok) throw new Error("Failed to create conversation");

      const data: ConversationResponse = await res.json();

      const conversation: FrontendConversation = {
        ...optimisticConversation,
        _id: data._id,
        itemId: data.itemId,
        messages: data.messages || [],
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };

      setSelectedConversation(conversation);
    } catch (err: any) {
      console.error(err);
      console.log(err.message || "Failed to create conversation");
    } finally {
      setLoading(false);
    }
  };

  const deleteConversation = async (id: string, redirectToChats = true) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/user/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to delete conversation");

      toast.success(data.message || "Conversation deleted successfully");

      if (redirectToChats) {
        navigate("/chats"); 
      }

      setSelectedConversation(null);
      return true;
    } catch (err: any) {
      console.error(err);
      console.log(err.message || "Failed to delete conversation");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { makeConversation, deleteConversation, loading };
};
