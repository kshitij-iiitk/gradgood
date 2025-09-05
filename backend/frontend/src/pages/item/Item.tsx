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

  if (itemLoading) return <p className="text-gray-500">Loading item...</p>;
  if (!item) return <p className="text-gray-500">Item not found.</p>;

  return (
    <div className="p-6 min-h-screen bg-black/95 text-gray-300 space-y-6">
      {/* Item Details */}
      <div className="space-y-2 bg-black/30 backdrop-blur-md p-6 rounded-2xl border border-gray-800 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-100">{item.itemName}</h1>
        <p className="text-xl font-semibold text-indigo-400">₹{item.price}</p>
        <p className="text-sm text-gray-400">Seller: {item.userName}</p>
        <p className="mt-2 text-gray-200">{item.description}</p>
      </div>

      {/* Carousel */}
      {item.photo && item.photo.length > 0 && (
        <div className="relative w-full max-w-4xl mx-auto rounded-2xl overflow-hidden bg-black/30 backdrop-blur-md border border-gray-800 shadow-lg">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {item.photo.map((url, index) => (
              <div key={index} className="flex-shrink-0 w-full p-2">
                <div className="rounded-xl overflow-hidden bg-gray-900/30 border border-gray-700 shadow-md">
                  <img
                    src={url}
                    alt={`${item.itemName} ${index + 1}`}
                    className="w-full h-96 object-cover"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-2 -translate-y-1/2 text-gray-400 hover:text-white bg-black/40 hover:bg-black/60 p-2 rounded-full transition"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 hover:text-white bg-black/40 hover:bg-black/60 p-2 rounded-full transition"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        {authUser?._id !== item.belongTo._id ? (
          <button
            onClick={startConvo}
            className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg transition"
          >
            {convoLoading ? "Loading..." : "Bargain"}
          </button>
        ) : (
          <>
            <button
              onClick={editItem}
              className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg transition"
            >
              {editLoading ? "Loading..." : "Edit"}
            </button>
            <DeleteItemButton itemId={itemId!} />
          </>
        )}
      </div>
    </div>
  );
};

export default ItemPage;
