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
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <Card className="w-full max-w-md p-6 rounded-2xl bg-black/60 backdrop-blur-lg border border-gray-800 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-100">Post a New Item</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              name="itemName"
              placeholder="Item Name"
              value={form.itemName}
              onChange={handleChange}
              className="bg-black/50 text-gray-100 border border-gray-700 placeholder-gray-400 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              required
            />

            <Input
              name="price"
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="bg-black/50 text-gray-100 border border-gray-700 placeholder-gray-400 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              required
            />

            <Textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="bg-black/50 text-gray-100 border border-gray-700 placeholder-gray-400 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />

            <div className="flex flex-col gap-2">
              <label
                htmlFor="photos"
                className="cursor-pointer px-4 py-2 bg-black/50 border border-gray-700 rounded-lg text-gray-100 text-center hover:bg-black/60 transition"
              >
                Upload Item Photos
              </label>
              <input
                id="photos"
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoChange}
                className="hidden" // hide default file input
              />
              {form.photosFiles.length > 0 && (
                <p className="text-gray-300 text-sm mt-1">
                  {form.photosFiles.length} file{form.photosFiles.length > 1 ? "s" : ""} selected
                </p>
              )}
            </div>


            <Button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-all duration-200 hover:scale-105"
            >
              {loading ? "Posting..." : "Post Item"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostItem;
