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
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);


  const [search, setSearch] = useState("");

  useEffect(() => {
    refetch();
  }, [refetch]);

  const filteredItems = items.filter(
    (item) =>
      item.belongTo?._id !== authUser?._id &&
      item.itemName.toLowerCase().includes(search.toLowerCase()) &&
      !item.sold
  );

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-gray-100">
     
      <div className="flex justify-center mb-8">
        <div
          className={`flex ${isMobile ? "flex-row" : "flex-col sm:flex-row"
            } gap-3 w-full max-w-2xl`}
        >
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-6 py-4 rounded-2xl bg-black/60 backdrop-blur-xl text-gray-200 border border-gray-600/50 
                     placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 
                     focus:border-indigo-500/50 transition-all duration-300 hover:border-gray-500/70 shadow-lg"
          />
          <button
            onClick={() => refetch()}
            className={`${isMobile
                ? "px-4 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center"
                : "px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2 min-w-[120px]"
              }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {/* Show text only on non-mobile */}
            {!isMobile && <span className="hidden sm:inline">Search</span>}
          </button>
        </div>
      </div>
      {/* Items grid */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-gray-600 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 text-lg">Loading amazing items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-12 h-12 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No items found
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              {search
                ? `No items match "${search}". Try a different search term.`
                : "No items available at the moment. Check back later!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="group cursor-pointer rounded-3xl bg-black/60 backdrop-blur-xl border border-gray-700/50 
                           hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 
                           transform hover:scale-[1.02] transition-all duration-300 overflow-hidden"
                onClick={() => navigate(`/market/${item._id}`)}
              >
                {/* Image */}
                <div className="relative overflow-hidden rounded-t-3xl">
                  <LazyLoadImage
                    src={item.photo?.[0] || fallbackImage}
                    alt={item.itemName}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    draggable="false"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-gray-100 font-bold text-lg mb-2 line-clamp-2 group-hover:text-white transition-colors duration-200">
                    {item.itemName}
                  </h3>

                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                      ₹{item.price.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                      {item.userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="truncate">{item.userName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
