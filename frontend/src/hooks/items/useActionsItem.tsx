  import { useState } from "react";
  import toast from "react-hot-toast";
  import { type Item } from "@/types/item";

  import uploadToCloudinary from "@/utils/uploadToCloudinary";

  const useItemActions = () => {
    const [loading, setLoading] = useState(false);

    const uploadItem = async (payload: Partial<Item> & { photosFiles?: File[] }) => {
      setLoading(true);
      try {
        let photoUrls: string[] = [];

        if (payload.photosFiles?.length) {
          // Upload each image to Cloudinary
          photoUrls = await Promise.all(payload.photosFiles.map(uploadToCloudinary));
        }

        // Construct the final payload to send
        const finalPayload = {
          itemName: payload.itemName,
          photo: photoUrls,
          price: Number(payload.price),
          description: payload.description || "",
        };

        const res = await fetch("/api/item/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(finalPayload),
        });

        const data = await res.json();
        if (data.error) {
          toast.error(data.error);
          throw new Error(data.error);
        }

        toast.success("Item uploaded successfully");
        return data;
      } catch (err: any) {
        toast.error(err.message || "Failed to upload item");
      } finally {
        setLoading(false);
      }
    };

    const deleteItem = async (id: string) => {
      setLoading(true);
      try {
        const res = await fetch(`/api/item/delete/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        const data = await res.json();
        if (data.error) {
          toast.error(data.error);
          throw new Error(data.error);
        }
        toast.success("Item deleted successfully");
        return true;
      } catch (err: any) {
        toast.error(err.message || "Failed to delete item");
        return false;
      } finally {
        setLoading(false);
      }
    };

    return { uploadItem, deleteItem, loading };
  };

  export default useItemActions;
