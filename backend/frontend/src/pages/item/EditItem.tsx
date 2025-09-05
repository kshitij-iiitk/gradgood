"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useEditItem from "@/hooks/items/useEditItem";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
    <div className="max-w-md mx-auto p-6 m-10 space-y-6 bg-gray-900 rounded-xl shadow-lg text-gray-100">
      <h1 className="text-2xl font-bold text-gray-100">Edit Item</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          name="itemName"
          placeholder="Item Name"
          value={form.itemName}
          onChange={handleChange}
          required
          className="bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <Input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          className="bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <Textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="bg-gray-800 text-gray-100 border-gray-700 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
        />

        {/* Existing Images */}
        {item.photo?.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {item.photo.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`photo-${index}`}
                className="w-24 h-24 object-cover rounded-md border border-gray-700"
              />
            ))}
          </div>
        )}

        {/* Upload new images */}
        <Input
          type="file"
          accept="image/*"
          multiple
          onChange={handlePhotoChange}
          className="bg-gray-800 border-gray-700 text-gray-100"
        />

        <Button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md rounded-lg"
        >
          {loading ? "Updating..." : "Update Item"}
        </Button>
      </form>
    </div>
  );
};

export default EditItem;
