import { useState } from "react";
import useConversation from "@/zustand/useConversation";
import { toast } from "react-hot-toast";

const useSendMessage = () => {
  const { selectedConversation, setMessages } = useConversation();
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text: string) => {
    if (!selectedConversation?._id || !text.trim()) return;

    const tempId = crypto.randomUUID();
    const sender = selectedConversation.participants[0]; // adjust for auth user
    const receiver =
      selectedConversation.participants.find((p) => p._id !== sender._id) || sender;

    const tempMsg = {
      _id: tempId,
      message: text,
      conversationId: selectedConversation._id,
      senderId: sender,
      receiverId: receiver,
      createdAt: new Date().toISOString(),
    };

    // Optimistic UI
    setMessages((prev) => [...prev, tempMsg]);
    setLoading(true);

    try {
      const res = await fetch(`/api/message/send/${selectedConversation._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const savedMsg = await res.json();
      if (savedMsg.error) throw new Error(savedMsg.error);

      // Replace temp message with saved message from server
      setMessages((prev) =>
        prev.map((msg) => (msg._id === tempId ? savedMsg : msg))
      );
    } catch (err: any) {
      console.log(err.message || "Failed to send message");
      setMessages((prev) => prev.filter((msg) => msg._id !== tempId));
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading };
};

export default useSendMessage;
