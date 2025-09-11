"use client";

import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import useGetItems from "@/hooks/items/useGetItems";
import { useAuthContext } from "@/context/AuthContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
import useEditProfile from "@/hooks/useEditProfile";


const fallbackImage = "https://via.placeholder.com/300x200.png?text=No+Image";
const fallbackProfilePic = "https://via.placeholder.com/100.png?text=User";

const Profile = () => {
  const { authUser } = useAuthContext();
  const { items, loading } = useGetItems();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const { form, handleChange, handleImageUpload, saveProfile, loading: saving } = useEditProfile(authUser);

  const filteredItems = items.filter((item) => item.belongTo?._id === authUser?._id);

  if (!authUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
            <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-300 mb-2">User not found</h3>
          <p className="text-gray-500">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleImageUpload(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    try {
      await saveProfile();
      setEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-gray-100">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-2">
            My Profile
          </h1>
          <p className="text-gray-400 text-lg">Manage your account and listings</p>
        </div>

        {/* Profile Card */}
        <div className="max-w-2xl mx-auto rounded-3xl bg-black/60 backdrop-blur-xl border border-gray-700/50 shadow-2xl p-8">
        {!editing ? (
          <div className="text-center space-y-6">
            <div className="relative inline-block">
            <LazyLoadImage
              src={authUser.profilePic || fallbackProfilePic}
              alt={authUser.userName}
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-600/50 shadow-xl"
              draggable="false"
            />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white">{authUser.userName}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Roll Number</p>
                  <p className="text-white font-semibold">{authUser.rollNumber}</p>
                </div>
                
                {authUser.email && (
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-1">Email</p>
                    <p className="text-white font-semibold truncate">{authUser.email}</p>
                  </div>
                )}
                
                {authUser.phoneNumber && (
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-1">Phone</p>
                    <p className="text-white font-semibold">{authUser.phoneNumber}</p>
                  </div>
                )}
                
                {authUser.upiId && (
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <p className="text-gray-400 text-sm mb-1">GPay ID</p>
                    <p className="text-white font-semibold">{authUser.upiId}</p>
                  </div>
                )}
              </div>
            </div>
            
            <button
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl flex items-center gap-2 mx-auto"
              onClick={() => setEditing(true)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-center text-white mb-6">Edit Profile</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 block">Name</label>
            <input
              type="text"
              name="userName"
              value={form.userName}
              onChange={handleChange}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 text-gray-100 border border-gray-600 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 block">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 text-gray-100 border border-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition-all duration-200"
            />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 block">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
                  placeholder="Your phone number"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 text-gray-100 border border-gray-600 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 block">GPay ID</label>
            <input
              type="text"
                  name="upiId"
                  value={form.upiId}
              onChange={handleChange}
                  placeholder="Your GPay ID"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 text-gray-100 border border-gray-600 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            />
              </div>
            </div>
            
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                className="flex-1 px-6 py-3 rounded-xl border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 transition-all duration-200"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                onClick={handleSave}
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        )}
      </div>

        {/* User's Items Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">My Listings</h2>
            <span className="px-4 py-2 bg-gray-800/50 rounded-full text-gray-300 text-sm">
              {filteredItems.length} items
            </span>
          </div>
          
        {loading ? (
            <div className="flex justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-gray-600 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">Loading your items...</p>
              </div>
            </div>
        ) : filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4m0 0l-4-4m4 4V3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No items yet</h3>
              <p className="text-gray-500 mb-6">Start selling by posting your first item!</p>
              <button
                onClick={() => navigate('/post-item')}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
              >
                Post Your First Item
              </button>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
            <div
              key={item._id}
                  className="group cursor-pointer rounded-3xl bg-black/60 backdrop-blur-xl border border-gray-700/50 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transform hover:scale-[1.02] transition-all duration-300 overflow-hidden"
              onClick={() => navigate(`/market/${item._id}`)}
            >
                  <div className="relative overflow-hidden rounded-t-3xl">
                <LazyLoadImage
                  src={item.photo?.[0] || fallbackImage}
                  alt={item.itemName}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  draggable="false"
                />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {item.sold && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                        SOLD
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-gray-100 font-bold text-lg mb-2 line-clamp-2 group-hover:text-white transition-colors duration-200">
                      {item.itemName}
                    </h3>
                
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        ₹{item.price.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="text-gray-400 text-sm">
                      Updated: {item.updatedAt
                        ? new Date(item.updatedAt).toLocaleDateString()
                    : "Unknown"}
                    </div>
                  </div>
              </div>
              ))}
            </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default Profile;