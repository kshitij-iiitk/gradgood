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
  const [upiId, setGPayID] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!photo) {
      alert("Please upload a profile picture");
      return;
    }
    await signup(email, password, photo, upiId, phoneNumber);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden px-2">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-lg p-8 rounded-3xl bg-black/70 backdrop-blur-xl border border-gray-700/50 shadow-2xl relative z-10 transform hover:scale-[1.01] transition-all duration-300">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold  mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Create Account
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* College Email */}
          <div className="space-y-2">

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nameXXAAAXXX@iiitkottayam.ac.in"
              className="w-full px-4 py-3 rounded-xl bg-gray-900/50 text-gray-100 border border-gray-600 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-gray-500"
              required
            />
          </div>

          <div className="space-y-2">
           
            <input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Phone Number"
              className="w-full px-4 py-3 rounded-xl bg-gray-900/50 text-gray-100 border border-gray-600 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-gray-500"
              required
            />
          </div>

          <div className="space-y-2">
          
            <input
              id="upiId"
              type="text"
              value={upiId}
              onChange={(e) => setGPayID(e.target.value)}
              placeholder="your-upi-id"
              className="w-full px-4 py-3 rounded-xl bg-gray-900/50 text-gray-100 border border-gray-600 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-gray-500"
              required
            />
          </div>

          <div className="space-y-2">
        
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              className="w-full px-4 py-3 rounded-xl bg-gray-900/50 text-gray-100 border border-gray-600 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-gray-500"
              required
            />
          </div>

          <div className="space-y-2">
          
            <label
              htmlFor="photo"
              className="cursor-pointer flex items-center justify-center px-4 py-3 bg-gray-900/50 border border-gray-600 border-dashed rounded-xl text-gray-300 text-center hover:bg-gray-800/50 hover:border-gray-500 transition-all duration-200 group"
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                {photo ? "Change Profile Picture" : "Upload Profile Picture"}
              </div>
            </label>
            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files?.[0] || null)}
              className="hidden"
              required
            />
            {photo && (
              <p className="text-indigo-400 text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {photo.name}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4 pt-4">
            {/* Full-width Sign Up button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>

            {/* Small text for login */}
            <p className="text-center text-gray-400 text-sm">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-2 transition-colors duration-200"
              >
                Sign In
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
