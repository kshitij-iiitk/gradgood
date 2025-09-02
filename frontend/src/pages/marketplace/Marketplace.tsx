"use client";

import { useState, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useNavigate } from "react-router-dom";

import useGetItems from "@/hooks/items/useGetItems";
import { useAuthContext } from "@/context/AuthContext";

const fallbackImage = "https://via.placeholder.com/300x200.png?text=No+Image";

const Marketplace = () => {
  const { authUser } = useAuthContext();
  const { items, loading, refetch } = useGetItems();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  useEffect(() => {
    refetch();
  }, []);

  const filteredItems = items.filter(
    (item) =>
      item.belongTo?._id !== authUser?._id &&
      item.itemName.toLowerCase().includes(search.toLowerCase()) &&
      !item.sold
  );

  return (
    <div className="p-4 md:p-6 min-h-screen bg-black text-gray-100">
      {/* Search bar */}
      <div className="flex justify-end mb-6">
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-1/2 lg:justify-between">
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg bg-black/50 text-gray-200 border border-gray-700 
                       placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 
                       focus:border-indigo-500 backdrop-blur-sm transition-colors duration-200"
          />
          <button
            onClick={() => refetch()}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 
                       text-white font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Search
          </button>
        </div>
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-gray-500">Loading items...</p>
        ) : filteredItems.length === 0 ? (
          <p className="text-gray-500">No items found.</p>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item._id}
              className="cursor-pointer rounded-2xl bg-black/60 backdrop-blur-lg border border-gray-700 
                         hover:shadow-indigo-700/40 hover:scale-105 transition-all duration-300 overflow-hidden"
              onClick={() => navigate(`/market/${item._id}`)}
            >
              <div className="flex gap-4 items-center p-4">
                {/* Image */}
                <div className="w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden border border-gray-700">
                  <LazyLoadImage
                    src={item.photo?.[0] || fallbackImage}
                    alt={item.itemName}
                    className="w-full h-full object-cover"
                    draggable="false"
                  />
                </div>

                {/* Info */}
                <div className="flex flex-col justify-start flex-1">
                  <p className="text-gray-100 font-semibold text-lg truncate">{item.itemName}</p>
                  <p className="text-indigo-400 font-bold text-lg truncate mt-1">₹{item.price}</p>
                  <p className="text-gray-400 text-sm truncate mt-1">Seller: {item.userName}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Marketplace;
