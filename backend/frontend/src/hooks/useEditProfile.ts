"use client";

import { useState } from "react";

export interface EditProfileForm {
  userName: string;
  profilePic: string;
  phoneNumber?: string;
  gPayID?: string;
}

export default function useEditProfile(authUser: any) {
  const [form, setForm] = useState<EditProfileForm>({
    userName: authUser?.userName || "",
    profilePic: authUser?.profilePic || "",
    phoneNumber: authUser?.phoneNumber || "",
    gPayID: authUser?.gPayID || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (file: File) => {
    try {
      setLoading(true);
      const imageUrl = await uploadToCloudinary(file);
      setForm((prev) => ({ ...prev, profilePic: imageUrl }));
      setLoading(false);
      return imageUrl;
    } catch (err) {
      setLoading(false);
      console.error(err);
      throw err;
    }
  };

  const saveProfile = async () => {
    if (!authUser) throw new Error("No user found");

    setLoading(true);
    try {
      const res = await fetch(`/api/user/${authUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Update failed");

      localStorage.setItem("user", JSON.stringify(data.user));
      setLoading(false);
      return data.user;
    } catch (err) {
      setLoading(false);
      console.error(err);
      throw err;
    }
  };

  return { form, handleChange, handleImageUpload, saveProfile, loading };
}

// Cloudinary upload helper
export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "gradgoods"); // replace with your preset

  const res = await fetch(`https://api.cloudinary.com/v1_1/drkbraeiu/image/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Upload failed");
  return data.secure_url;
}
