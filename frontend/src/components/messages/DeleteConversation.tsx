"use client";

import { Button } from "@/components/ui/button";
import { useCreateConversation } from "@/hooks/conversations/useCreateConversation";
import { MdDeleteForever } from "react-icons/md";

interface DeleteConversationButtonProps {
  convoId: string;
  onDeleted?: () => void;
}

const DeleteConversationButton = ({ convoId, onDeleted }: DeleteConversationButtonProps) => {
  const { deleteConversation } = useCreateConversation();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this conversation?")) return;
    await deleteConversation(convoId, true);
    if (onDeleted) onDeleted();
  };

  return (
    <Button
      onClick={handleDelete}
      className="
        bg-black 
        text-white 
        rounded-2xl 
        p-2 
        shadow-md 
        hover:bg-gray-800 
        transition-all 
        duration-200 
        flex 
        items-center 
        justify-center
      "
    >
      <MdDeleteForever size={22} />
    </Button>
  );
};

export default DeleteConversationButton;
