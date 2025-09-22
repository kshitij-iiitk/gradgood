import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { type Conversation } from "@/types/conversation";

const useGetConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const { authUser } = useAuthContext();

  const fetchConversations = useCallback(async () => {
    if (!authUser?._id) return;
    setLoading(true);
    try {
      const res = await fetch("/api/user/conversations", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch conversations");

      const data: Conversation[] = await res.json();
      setConversations(data);
      console.log(data);
      
      

    } catch (err: any) {
      console.log(err.message || "Error fetching conversations");
    } finally {
      setLoading(false);
    }
  }, [authUser?._id]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return { conversations, loading, refetch: fetchConversations };
};

export default useGetConversations;
