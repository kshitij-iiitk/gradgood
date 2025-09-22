"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { type Item } from "@/types/item";
import uploadToCloudinary from "@/utils/uploadToCloudinary";

import useGetItem from "./useGetItem";

interface EditPayload extends Partial<Item> {
  newPhotosFiles?: File[]; // files to upload
}

const useEditItem = (itemId: string) => {
  const [loading, setLoading] = useState(false);
  const { item, getItem } = useGetItem();
  const navigate = useNavigate();

  useEffect(() => {
    if (itemId) getItem(itemId);
  }, [itemId]);

  const editItem = async (payload: EditPayload) => {
    if (!item) return; // safety check
    setLoading(true);
    try {
      let photoUrls = item.photo || [];

      if (payload.newPhotosFiles?.length) {
        const uploadedUrls = await Promise.all(
          payload.newPhotosFiles.map((file) => uploadToCloudinary(file))
        );
        photoUrls = [...photoUrls, ...uploadedUrls];
      }

      const res = await fetch(`/api/item/edit/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...payload, photo: photoUrls }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to edit item");

      toast.success("Item updated successfully!");
      navigate(`/market/${itemId}`);
      return data;
    } catch (err: any) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { item, editItem, loading, fetchItem: getItem };
};


export default useEditItem;
