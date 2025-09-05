import { useEffect } from "react";
import useConversation from "@/zustand/useConversation";

export const useMessageStream = (conversationId?: string) => {
  const { setMessages } = useConversation();

  useEffect(() => {
    if (!conversationId) return;

    const eventSource = new EventSource(`/api/message/stream/${conversationId}`);

    eventSource.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setMessages((prev) => {
        // prevent duplicates
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    eventSource.onerror = () => {
      console.error("SSE connection error");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [conversationId, setMessages]);
};
