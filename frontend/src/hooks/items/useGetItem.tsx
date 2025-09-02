import { useState } from "react";
import toast from "react-hot-toast";



import { type Item } from "@/types/item";



const useGetItem = () => {
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(false);

  const getItem = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/item/item/${id}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.error) {
        toast.error(data.error);
        throw new Error(data.error);
      }
      setItem(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch item");
    } finally {
      setLoading(false);
    }
  };

  return { item, loading, getItem };
};

export default useGetItem;
