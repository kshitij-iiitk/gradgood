import { useState, useEffect, useCallback } from "react";
import { type Item } from "@/types/item";

const useGetItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/item/items", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch items");

      // The backend returns `belongTo` populated as { _id, name, email }
      const data: Item[] = await res.json();

      // Ensure each item's photo is an array, even if backend returns a single string
      const normalized = data.map(item => ({
        ...item,
        photo: Array.isArray(item.photo) ? item.photo : [item.photo],
      }));

      setItems(normalized);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { items, loading, error, refetch: fetchItems };
};

export default useGetItems;
