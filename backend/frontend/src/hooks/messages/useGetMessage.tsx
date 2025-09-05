import { useEffect, useCallback, useState } from "react";
import useConversation from "../../zustand/useConversation";
import toast from "react-hot-toast";

const useGetMessage = () => {
  const { selectedConversation, setMessages, messages } = useConversation();
  const [loading, setLoading] = useState(false);

  const getMessages = useCallback(async () => {
    if (!selectedConversation?._id) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/message/${selectedConversation._id}`);
      const data = await res.json();

      if (data.error) throw new Error(data.error);

      // Merge messages without duplicating
      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m._id));
        const newMsgs = data.messages.filter((m: any) => !existingIds.has(m._id));
        return [...prev, ...newMsgs];
      });
      console.log(data);
      
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  }, [selectedConversation?._id, setMessages]);

  useEffect(() => {
    if (selectedConversation?._id) {
      setMessages([]); // reset messages when changing conversation
      getMessages();
    }
  }, [selectedConversation?._id, getMessages, setMessages]);

  return { loading, messages, getMessages };
};

export default useGetMessage;
