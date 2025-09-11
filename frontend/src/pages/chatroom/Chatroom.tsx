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

  if (loading) {
    return (
      <div className="h-[97vh] bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-600 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading conversations...</p>
        </div>
      </div>
    );
  }

  if (!conversations.length) {
    return (
      <div className="h-[97vh] bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No conversations yet</h3>
          <p className="text-gray-500 text-center max-w-md">
            Start browsing items and connect with sellers to begin your first conversation!
          </p>
        </div>
      </div>
    );
  }

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
    <div className="h-[97vh] grid grid-cols-1 lg:grid-cols-3 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-gray-100 lg:px-3">
      {/* Desktop Conversation List */}
      <div className="hidden lg:flex flex-col border-r border-gray-700/50 overflow-y-auto p-6 space-y-3">
        <div className="mb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
            Messages
          </h2>
          <p className="text-gray-400 text-sm">{conversations.length} conversation{conversations.length !== 1 ? 's' : ''}</p>
        </div>
        
        {conversations.map((conv) => {
          const otherParticipants = conv.participants.filter(
            (p) => p._id !== authUser?._id
          );
          const latestMessage = conv.messages[conv.messages.length - 1];

          return (
            <div
              key={conv._id}
              onClick={() => openConvo(conv)}
              className={`cursor-pointer transition-all duration-300 p-4 rounded-2xl border shadow-lg hover:shadow-xl transform hover:scale-[1.02] ${
                selectedConversation?._id === conv._id
                  ? "bg-indigo-500/20 border-indigo-500/50 shadow-indigo-500/20"
                  : "bg-black/60 backdrop-blur-xl border-gray-700/50 hover:border-gray-600/70 hover:bg-black/70"
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {otherParticipants.length
                    ? otherParticipants[0].userName?.charAt(0).toUpperCase()
                    : "?"}
                </div>
                
                <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-100 truncate text-base">
                {otherParticipants.length
                  ? otherParticipants.map((p) => p.userName).join(", ")
                  : "Unknown User"}
              </div>
              <div className="text-gray-400 text-sm truncate mt-1">
                {latestMessage
                  ? `${latestMessage.senderId._id === authUser?._id
                    ? "You: "
                        : ""
                  }${latestMessage.message}`
                  : "No messages yet"}
              </div>
            </div>
                
                {/* Unread indicator */}
                {latestMessage && latestMessage.senderId._id !== authUser?._id && (
                  <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>


      {/* Desktop Chat Panel */}
      <div className="hidden lg:h-[95vh] lg:flex lg:col-span-2 bg-black/60 backdrop-blur-xl border-l border-gray-700/50 rounded-r-3xl overflow-hidden">
        {selectedConversation ? (
          <Chat />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <NoChatSelected/>
          </div>
        )}
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-black to-gray-800">
        {/* Conversation List */}
        <div
          className={`absolute inset-0 p-6 transform transition-transform duration-300 ease-in-out 
                ${mobileView === "list" ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
              Messages
            </h2>
            <p className="text-gray-400 text-sm">{conversations.length} conversation{conversations.length !== 1 ? 's' : ''}</p>
          </div>
          
          {conversations.map((conv) => {
            const otherParticipants = conv.participants.filter(
              (p) => p._id !== authUser?._id
            );
            const latestMessage = conv.messages[conv.messages.length - 1];

            return (
              <div
                key={conv._id}
                onClick={() => openConvo(conv)}
                className="cursor-pointer transition-all duration-300 p-4 mb-4 
                     bg-black/60 backdrop-blur-xl border border-gray-700/50 rounded-2xl 
                     shadow-lg hover:shadow-xl hover:border-gray-600/70 hover:bg-black/70 transform hover:scale-[1.02]"
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {otherParticipants.length
                      ? otherParticipants[0].userName?.charAt(0).toUpperCase()
                      : "?"}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-100 truncate text-base">
                    {otherParticipants.length
                      ? otherParticipants.map((p) => p.userName).join(", ")
                      : "Unknown User"}
                  </div>
                <div className="text-gray-400 text-sm truncate mt-1">
                  {latestMessage
                    ? `${latestMessage.senderId._id === authUser?._id
                      ? "You: "
                          : ""
                    }${latestMessage.message}`
                    : "No messages yet"}
                </div>
              </div>
                  
                  {/* Unread indicator */}
                  {latestMessage && latestMessage.senderId._id !== authUser?._id && (
                    <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat Panel */}
        {selectedConversation && (
          <div
            className={`absolute inset-0 transform transition-transform duration-300 ease-in-out  flex flex-col`}
          >
            <div className="flex items-center p-4 border-b border-gray-700/50 bg-black/60 backdrop-blur-xl">
              <button
                onClick={goBack}
                className="text-gray-200 hover:text-white transition-colors duration-200 p-2 rounded-full hover:bg-gray-700/50"
              >
                <IoChevronBack className="w-6 h-6" />
              </button>
              <div className="ml-3 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {selectedConversation.participants
                    .find(p => p._id !== authUser?._id)
                    ?.userName?.charAt(0).toUpperCase() || "?"}
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {selectedConversation.participants
                      .find(p => p._id !== authUser?._id)
                      ?.userName || "Unknown User"}
                  </h3>
                </div>
              </div>
            </div>
            <Chat />
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatroom;
