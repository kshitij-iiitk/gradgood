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

  if (!authUser) return <p className="text-center text-gray-400">User not found.</p>;

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
    <div className="p-6 space-y-6 bg-black min-h-screen text-gray-100">
      <div className="max-w-md mx-auto rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 shadow-xl p-6 flex flex-col items-center gap-4">
        {!editing ? (
          <>
            <LazyLoadImage
              src={authUser.profilePic || fallbackProfilePic}
              alt={authUser.userName}
              className="w-24 h-24 rounded-full object-cover border border-white/20 shadow-md"
              draggable="false"
            />
            <h2 className="text-2xl font-semibold">{authUser.userName}</h2>
            <div className="w-full text-sm space-y-1 mt-2">
              <p><span className="font-semibold">Roll Number:</span> {authUser.rollNumber}</p>
              {authUser.email && <p><span className="font-semibold">Email:</span> {authUser.email}</p>}
              {authUser.phoneNumber && <p><span className="font-semibold">Phone:</span> {authUser.phoneNumber}</p>}
              {authUser.gPayID && <p><span className="font-semibold">GPay ID:</span> {authUser.gPayID}</p>}
              {authUser.token && <p><span className="font-semibold">Token:</span> {authUser.token}</p>}
            </div>
            <button
              className="mt-4 px-4 py-2 rounded-lg border border-white/20 text-indigo-400 hover:text-indigo-500 hover:border-indigo-500 transition"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          </>
        ) : (
          <div className="w-full space-y-3">
            <input
              type="text"
              name="userName"
              value={form.userName}
              onChange={handleChange}
              placeholder="Name"
              className="w-full p-2 rounded border"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 rounded border"
            />
            <input
              type="text"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full p-2 rounded border"
            />
            <input
              type="text"
              name="gPayID"
              value={form.gPayID}
              onChange={handleChange}
              placeholder="GPay ID"
              className="w-full p-2 rounded border"
            />
            <div className="flex justify-between mt-2">
              <button
                type="button"
                className="px-4 py-2 rounded-lg border border-white/20 text-gray-400 hover:text-white"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white"
                onClick={handleSave}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User's Items */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {loading ? (
          <p className="text-center text-gray-400">Loading items...</p>
        ) : filteredItems.length === 0 ? (
          <p className="text-center text-gray-400">No items found.</p>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item._id}
              className="rounded-xl bg-black/40 backdrop-blur-md border border-white/10 shadow-lg overflow-hidden cursor-pointer transition-transform transform hover:scale-105 hover:shadow-2xl"
              onClick={() => navigate(`/market/${item._id}`)}
            >
              <div className="p-3">
                <h3 className="truncate font-semibold text-lg">{item.itemName}</h3>
                <LazyLoadImage
                  src={item.photo?.[0] || fallbackImage}
                  alt={item.itemName}
                  className="w-full h-40 object-cover rounded-md mt-2 border border-white/10"
                  draggable="false"
                />
                <p className="font-semibold text-indigo-400 mt-2">₹{item.price}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Updated:{" "}
                  {item.updatedAt
                    ? new Date(item.updatedAt)
                        .toLocaleString()
                        .split(" ")[0]
                        .slice(0, -1)
                    : "Unknown"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;
