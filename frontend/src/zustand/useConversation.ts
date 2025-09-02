import { create } from "zustand";
import { type Conversation } from "@/types/conversation";
import { type Message } from "@/types/message";

type MessagesUpdater = Message[] | ((prev: Message[]) => Message[]);

interface ConversationStore {
  selectedConversation: Conversation | null;
  setSelectedConversation: (conversation: Conversation | null) => void;
  clearConversation: () => void;
  messages: Message[];
  setMessages: (messages: MessagesUpdater) => void;
  appendMessage: (message: Message) => void;
}

const useConversation = create<ConversationStore>((set) => ({
  selectedConversation: null,
  setSelectedConversation: (conversation) =>
    set({ selectedConversation: conversation }),
  clearConversation: () => set({ selectedConversation: null, messages: [] }),
  messages: [],
  setMessages: (messages) =>
    set((state) => ({
      messages:
        typeof messages === "function" ? messages(state.messages) : messages,
    })),
  appendMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
}));

export default useConversation;
