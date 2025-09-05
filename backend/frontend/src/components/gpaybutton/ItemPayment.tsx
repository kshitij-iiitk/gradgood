"use client";

import GPayButton from "./Gpaybutton";
import useGetItem from "@/hooks/items/useGetItem";

export default function ItemPayment() {
  const { item, loading: itemLoading } = useGetItem();

  if (itemLoading) return <p>Loading item...</p>;
  if (!item) return <p>No item found</p>;

  return (
    <div className="p-4 border rounded bg-black/60 text-white space-y-2">
      <h3 className="text-lg font-semibold">{item.userName}</h3>
      <p className="text-gray-300">Price: ₹{item.price}</p>

      <GPayButton
           fromUser="me"
           toUser={{ name: item.userName, upiId: item.gPayID }}
           amount={item.price} 
           itemId={item._id}      />
    </div>
  );
}
