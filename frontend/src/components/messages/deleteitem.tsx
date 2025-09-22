"use client";

import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface DeleteItemButtonProps {
  itemId: string;
}

const DeleteItemButton = ({ itemId }: DeleteItemButtonProps) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const res = await fetch(`/api/items/delete/${itemId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to delete item");

      toast.success(data.message || "Item deleted successfully");
      navigate("/profile"); // redirect after delete
    } catch (err: any) {
      console.log(err.message || "Something went wrong");
    }
  };

  return (
    <Button
      variant="destructive"
      className="text-white text-lg w-full px-6 py-6 rounded-2xl bg-gradient-to-r from-red-500 to-pink-600 
             hover:from-red-600 hover:to-pink-700  font-semibold 
             shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
      onClick={handleDelete}
    >
      Delete
    </Button>
  );
};

export default DeleteItemButton;
