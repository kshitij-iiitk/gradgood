"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useEditItem from "@/hooks/items/useEditItem";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const EditItem = () => {
  const { id } = useParams();
  const { item, editItem, loading } = useEditItem(id!);

  const [form, setForm] = useState({
    itemName: "",
    price: "",
    description: "",
    newPhotosFiles: [] as File[],
  });

  useEffect(() => {
    if (item) {
      setForm({
        itemName: item.itemName,
        price: item.price.toString(),
        description: item.description || "",
        newPhotosFiles: [],
      });
    }
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      newPhotosFiles: Array.from(e.target.files || []),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await editItem({
      itemName: form.itemName,
      price: Number(form.price),
      description: form.description,
      newPhotosFiles: form.newPhotosFiles,
    });
  };

  if (!item) return <p className="text-gray-400">Loading item details...</p>;

  return (
    <div className="max-w-lg mx-3 mt-15 p-8 space-y-6 bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-xl">
      <h1 className="text-2xl font-bold text-center text-white mb-6">Edit Item</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Item Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 block">Item Name</label>
          <Input
            name="itemName"
            placeholder="Enter item name"
            value={form.itemName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-gray-800/50 text-gray-100 border border-gray-600 placeholder-gray-500 
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          />
        </div>

        {/* Price */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 block">Price</label>
          <Input
            name="price"
            type="number"
            placeholder="Enter price"
            value={form.price}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-xl bg-gray-800/50 text-gray-100 border border-gray-600 placeholder-gray-500 
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 block">Description</label>
          <Textarea
            name="description"
            placeholder="Enter item description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-gray-800/50 text-gray-100 border border-gray-600 placeholder-gray-500 
                       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
          />
        </div>

        {/* Existing Images */}
        {item.photo?.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 block">Existing Images</label>
            <div className="flex gap-2 flex-wrap">
              {item.photo.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`photo-${index}`}
                  className="w-24 h-24 object-cover rounded-lg border border-gray-700"
                />
              ))}
            </div>
          </div>
        )}

        {/* Upload new images */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 block">Upload New Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoChange}
            className="w-full px-4 py-3 rounded-xl bg-gray-800/50 text-gray-100 border border-gray-600 file:mr-4 file:py-2 
                       file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 
                       file:text-white hover:file:bg-indigo-700 transition-all duration-200"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 
                     hover:to-purple-700 text-white font-semibold shadow-lg transition-all duration-200 hover:scale-[1.02] 
                     hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              Updating...
            </>
          ) : (
            "Update Item"
          )}
        </button>
      </form>
    </div>
  );
};

export default EditItem;
