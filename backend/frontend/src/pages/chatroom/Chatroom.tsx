"use client";

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useGetConversations from "@/hooks/conversations/useGetConverstions";

import { useChatSelected } from "@/context/ChatContext";
import { useAuthContext } from "@/context/AuthContext";
import useConversation from "@/zustand/useConversation";

import { IoChevronBack } from "react-icons/io5";
import Chat from "@/components/chat/chat";
import NoChatSelected from "@/components/chat/NoChatSelected";

const Chatroom = () => {
  const { conversations, loading, refetch } = useGetConversations();
  const { authUser } = useAuthContext();
  const { selectedConversation, setSelectedConversation } = useConversation();
  const location = useLocation();
  const { setChatSelected } = useChatSelected();


  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  useEffect(() => {
    refetch();
  }, [location.pathname, refetch]);

  if (loading)
    return <p className="p-6 text-gray-400">Loading conversations...</p>;
  if (!conversations.length)
    return <p className="p-6 text-gray-400">No conversations found.</p>;

  const goBack = () => {
    setMobileView("list");
    setSelectedConversation(null);

    if (window.innerWidth < 1024) {
      setChatSelected(false);
    }
  };


  const openConvo = (conv: any) => {
    if (selectedConversation === conv) {
      setSelectedConversation(null)

    }
      else{
      setSelectedConversation(conv);
    }
    setMobileView("chat");

    // Only set chatSelected on mobile
    if (window.innerWidth < 1024) { // lg breakpoint
      setChatSelected(true);
    }
  };

  return (
    <div className="h-[97vh] grid grid-cols-1 lg:grid-cols-3 bg-black/90 backdrop-blur-md text-gray-100 lg:px-3">
      {/* Desktop Conversation List */}
      <div className="hidden lg:flex flex-col border-r border-gray-800 overflow-y-auto p-4 space-y-2">
        {conversations.map((conv) => {
          const otherParticipants = conv.participants.filter(
            (p) => p._id !== authUser?._id
          );
          const latestMessage = conv.messages[conv.messages.length - 1];

          return (
            <div
              key={conv._id}
              onClick={() => openConvo(conv)}
              className={`cursor-pointer transition-all duration-300 p-4 
                   bg-black/40 backdrop-blur-md border border-gray-700 rounded-2xl 
                   shadow-md hover:shadow-lg hover:bg-neutral-950/10
                  `}
            >
              <div className="font-semibold text-gray-100 truncate text-base">
                {otherParticipants.length
                  ? otherParticipants.map((p) => p.userName).join(", ")
                  : "Unknown User"}
              </div>
              <div className="text-gray-400 text-sm truncate mt-1">
                {latestMessage
                  ? `${latestMessage.senderId._id === authUser?._id
                    ? "You: "
                    : latestMessage.senderId.userName + ": "
                  }${latestMessage.message}`
                  : "No messages yet"}
              </div>
            </div>
          );
        })}
      </div>


      {/* Desktop Chat Panel */}
      <div className="hidden lg:h-[95vh] lg:flex lg:col-span-2 bg-black/80 backdrop-blur-md border-l border-gray-800">
        {selectedConversation ? (
          <Chat />
        ) : (
          <p className="m-6 text-gray-400">
            <NoChatSelected/>
          </p>
        )}
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden fixed inset-0 z-50">
        {/* Conversation List */}
        <div
          className={`absolute inset-0 bg-black/70 backdrop-blur-xl p-4 transform transition-transform duration-300 ease-in-out 
                ${mobileView === "list" ? "translate-x-0" : "-translate-x-full"}`}
        >
          {conversations.map((conv) => {
            const otherParticipants = conv.participants.filter(
              (p) => p._id !== authUser?._id
            );
            const latestMessage = conv.messages[conv.messages.length - 1];

            return (
              <div
                key={conv._id}
                onClick={() => openConvo(conv)}
                className="cursor-pointer transition-all duration-300 p-4 mb-3 
                     bg-black/40 backdrop-blur-md border border-gray-700 rounded-2xl 
                     shadow-lg hover:shadow-xl hover:bg-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-gray-100 truncate text-base">
                    {otherParticipants.length
                      ? otherParticipants.map((p) => p.userName).join(", ")
                      : "Unknown User"}
                  </div>
                  <div className="text-gray-500 text-xs ml-2">
                    {latestMessage ? "●" : ""}
                  </div>
                </div>
                <div className="text-gray-400 text-sm truncate mt-1">
                  {latestMessage
                    ? `${latestMessage.senderId._id === authUser?._id
                      ? "You: "
                      : latestMessage.senderId.userName + ": "
                    }${latestMessage.message}`
                    : "No messages yet"}
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat Panel */}
        {selectedConversation && (
          <div
            className={`absolute inset-0 bg-black/90 backdrop-blur-md transform transition-transform duration-300 ease-in-out ${mobileView === "chat" ? "translate-x-0" : "translate-x-full"
              } flex flex-col`}
          >
            <div className="flex items-center p-4 border-b border-gray-800">
              <button
                onClick={goBack}
                className="text-gray-200 hover:text-white transition"
              >
                <IoChevronBack />
              </button>
            </div>
            <Chat />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatroom;
