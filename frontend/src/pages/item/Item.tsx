"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DeleteItemButton from "@/components/messages/deleteitem";
import useGetItem from "@/hooks/items/useGetItem";
import useEditItem from "@/hooks/items/useEditItem";
import { useCreateConversation } from "@/hooks/conversations/useCreateConversation";
import { useAuthContext } from "@/context/AuthContext";

const ItemPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const itemId = params.id;

  const { item, loading: itemLoading, getItem } = useGetItem();
  const { loading: editLoading } = useEditItem(itemId?.toString()!);
  const { makeConversation, loading: convoLoading } = useCreateConversation();
  const { authUser } = useAuthContext();

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (itemId) getItem(itemId);
  }, [itemId]);

  const startConvo = () => {
    const belongTo = item?.belongTo;
    if (!belongTo?._id) return;

    makeConversation({
      _id: belongTo._id,
      userName: item?.userName??"",
      email: belongTo.email || "",
    });
  };

  const editItem = () => navigate(`/edit-item/${itemId}`);

  const nextSlide = () => {
    if (!item?.photo) return;
    setCurrentSlide((prev) => (prev + 1) % item.photo.length);
  };

  const prevSlide = () => {
    if (!item?.photo) return;
    setCurrentSlide((prev) =>
      prev === 0 ? item.photo.length - 1 : prev - 1
    );
  };

  if (itemLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-600 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading item details...</p>
        </div>
      </div>
    );
  }

  if (!item) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.5a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">Item not found</h3>
          <p className="text-gray-500">The item you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-gray-100">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Carousel */}
          <div className="space-y-4">
            {item.photo && item.photo.length > 0 ? (
              <div className="relative rounded-3xl overflow-hidden bg-black/60 backdrop-blur-xl border border-gray-700/50 shadow-2xl">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {item.photo.map((url, index) => (
                    <div key={index} className="flex-shrink-0 w-full">
                  <img
                    src={url}
                    alt={`${item.itemName} ${index + 1}`}
                        className="w-full h-96 lg:h-[500px] object-cover"
                  />
                </div>
            ))}
          </div>

          {/* Navigation Arrows */}
                {item.photo.length > 1 && (
                  <>
          <button
            onClick={prevSlide}
                      className="absolute top-1/2 left-4 -translate-y-1/2 w-12 h-12 bg-black/60 backdrop-blur-md hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
                      className="absolute top-1/2 right-4 -translate-y-1/2 w-12 h-12 bg-black/60 backdrop-blur-md hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
                  </>
                )}

                {/* Slide Indicators */}
                {item.photo.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {item.photo.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          index === currentSlide 
                            ? "bg-white scale-110" 
                            : "bg-white/50 hover:bg-white/70"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-96 lg:h-[500px] bg-gray-800/50 rounded-3xl flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500">No images available</p>
                </div>
        </div>
      )}
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            <div className="bg-black/60 backdrop-blur-xl p-8 rounded-3xl border border-gray-700/50 shadow-2xl">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {item.itemName}
                </h1>
                
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    ₹{item.price.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-3 py-4 border-y border-gray-700/50">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-lg font-bold text-white">
                    {item.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-gray-300 font-medium">Seller</p>
                    <p className="text-white font-semibold">{item.userName}</p>
                  </div>
                </div>

                {item.description && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-gray-300">Description</h3>
                    <p className="text-gray-200 leading-relaxed">{item.description}</p>
                  </div>
                )}
              </div>
            </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        {authUser?._id !== item.belongTo._id ? (
          <button
            onClick={startConvo}
                  disabled={convoLoading}
                  className="flex-1 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
                  {convoLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Loading...
                    </>
        ) : (
          <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Start Conversation
                    </>
                  )}
                </button>
              ) : (
                <div className="flex gap-4 w-full">
            <button
              onClick={editItem}
                    disabled={editLoading}
                    className="flex-1 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                    {editLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Loading...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Item
          </>
        )}
                  </button>
                  <div className="flex-1">
                    <DeleteItemButton itemId={itemId!} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemPage;
