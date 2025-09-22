"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useItemActions from "@/hooks/items/useActionsItem";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PostItem = () => {
  const { uploadItem, loading } = useItemActions();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    itemName: "",
    price: "",
    description: "",
    photosFiles: [] as File[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      photosFiles: Array.from(e.target.files || []),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.itemName || !form.price) {
      return alert("Item name and price are required");
    }

    const payload = {
      itemName: form.itemName,
      price: Number(form.price),
      description: form.description,
      photosFiles: form.photosFiles,
    };

    const data = await uploadItem(payload);
    if (data) navigate(`/market/${data._id}`);
  };

  return (
    <div className="min-h-screen flex mt-12 items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-2xl p-8 rounded-3xl bg-black/70 backdrop-blur-xl border border-gray-700/50 shadow-2xl relative z-10 transform hover:scale-[1.01] transition-all duration-300">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Post New Item
          </CardTitle>
          <p className="text-gray-400 text-sm">Share your item with the community</p>
        </CardHeader>

        <CardContent className="px-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Item Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 block">Item Name *</label>
            <Input
              name="itemName"
                  placeholder="What are you selling?"
              value={form.itemName}
              onChange={handleChange}
                  className="px-4 py-3 rounded-xl bg-gray-900/50 text-gray-100 border border-gray-600 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-gray-500"
              required
            />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 block">Price (₹) *</label>
            <Input
              name="price"
              type="number"
                  placeholder="0"
              value={form.price}
              onChange={handleChange}
                  className="px-4 py-3 rounded-xl bg-gray-900/50 text-gray-100 border border-gray-600 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-gray-500"
              required
            />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 block">Description</label>
            <Textarea
              name="description"
                placeholder="Describe your item in detail..."
              value={form.description}
              onChange={handleChange}
                rows={4}
                className="px-4 py-3 rounded-xl bg-gray-900/50 text-gray-100 border border-gray-600 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:border-gray-500 resize-none"
            />
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 block">Photos</label>
              <div className="relative">
              <label
                htmlFor="photos"
                  className="cursor-pointer flex items-center justify-center px-6 py-8 bg-gray-900/50 border-2 border-gray-600 border-dashed rounded-xl text-gray-300 text-center hover:bg-gray-800/50 hover:border-gray-500 transition-all duration-200 group"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-gray-700/50 rounded-full flex items-center justify-center group-hover:bg-gray-600/50 transition-colors duration-200">
                      <svg className="w-6 h-6 text-gray-400 group-hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Upload photos of your item</p>
                      <p className="text-sm text-gray-500">PNG, JPG up to 10MB each</p>
                    </div>
                  </div>
              </label>
              <input
                id="photos"
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                  className="hidden"
              />
              </div>
              
              {form.photosFiles.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 text-indigo-400 text-sm mb-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {form.photosFiles.length} photo{form.photosFiles.length > 1 ? "s" : ""} selected
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {form.photosFiles.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg border border-gray-600"
                        />
                        <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
            <Button
              type="submit"
              disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Posting Item...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Post Item
                  </div>
                )}
            </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostItem;
