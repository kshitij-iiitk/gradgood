"use client";

import { useState } from "react";
import { useSignup } from "@/hooks/useSignup";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const { signup, loading } = useSignup();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [gPayID, setGPayID] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo) {
      alert("Please upload a profile picture");
      return;
    }
    await signup(email, password, photo, gPayID, phoneNumber);
  };

  const inputClasses =
    "peer w-full px-3 pt-5 pb-2 rounded-md bg-black/50 text-gray-100 border border-gray-700 placeholder-transparent focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all";

  const labelClasses =
    "absolute left-3 top-2 text-gray-400 text-sm transition-all duration-200 peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-gray-400 peer-focus:text-sm";

  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-full max-w-md p-6 rounded-2xl bg-black/60 backdrop-blur-lg border border-gray-800 shadow-xl">
        <h2 className="text-3xl font-bold text-gray-100 mb-2 text-center">Create an Account</h2>
        <p className="text-gray-400 mb-6 text-center">Sign up with your college email to continue</p>

        <form onSubmit={handleSubmit} className="space-y-6 relative">
          {/* College Email */}
          <div className="relative">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className={inputClasses}
              required
            />
            <label htmlFor="email" className={labelClasses}>
              College Email
            </label>
          </div>

          {/* Phone Number */}
          <div className="relative">
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Phone"
              className={inputClasses}
              required
            />
            <label htmlFor="phoneNumber" className={labelClasses}>
              Phone Number
            </label>
          </div>

          {/* GPay ID */}
          <div className="relative">
            <input
              id="gPayID"
              type="text"
              value={gPayID}
              onChange={(e) => setGPayID(e.target.value)}
              placeholder="GPay ID"
              className={inputClasses}
              required
            />
            <label htmlFor="gPayID" className={labelClasses}>
              GPay ID
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={inputClasses}
              required
            />
            <label htmlFor="password" className={labelClasses}>
              Password
            </label>
          </div>

          {/* Profile Picture */}
          <div className="flex flex-col gap-2 relative">
            <label
              htmlFor="photo"
              className="cursor-pointer px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-gray-100 text-center hover:bg-black/60 transition"
            >
              {photo ? "Change Profile Picture" : "Upload Profile Picture"}
            </label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
              className="hidden" // hide default input
              required
            />
            {photo && (
              <p className="text-gray-300 text-sm mt-1">
                Selected: {photo.name}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 mt-4">
            {/* Full-width Sign Up button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-all duration-200 hover:scale-105"
            >
              {loading ? "Registering..." : "Sign Up"}
            </Button>

            {/* Small text for login */}
            <p className="text-center text-gray-400 text-sm">
              Have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-indigo-400 hover:text-indigo-500 font-medium"
              >
                Log In
              </button>
            </p>
          </div>


        </form>
      </div>
    </div>
  );
}
