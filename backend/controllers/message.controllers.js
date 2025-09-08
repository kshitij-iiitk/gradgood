import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { createNotification } from "../utils/notification.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: conversationId } = req.params; 
    const senderId = req.user._id;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message text is required" });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Determine the receiver
    const receiverId =
      conversation.participants.length === 1
        ? senderId
        : conversation.participants.find(p => p.toString() !== senderId.toString());

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    conversation.messages.push(newMessage._id);

    // Save both message and conversation
    await Promise.all([newMessage.save(), conversation.save()]);

    // Create a notification for the receiver if not self
    if (receiverId.toString() !== senderId.toString()) {
      await createNotification(
        receiverId,
        `${req.user.userName} sent you a message`
      );
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// message.controllers.js
export const getMessage = async (req, res) => {
  try {
    const { id: conversationId } = req.params;
    const after = req.query.after ? new Date(req.query.after) : new Date(0); // default = epoch
    const userId = req.user._id.toString();

    const conversation = await Conversation.findById(conversationId).populate({
      path: "messages",
      match: { createdAt: { $gt: after } }, // only messages after 'after'
      populate: { path: "senderId receiverId", select: "userName profilePic" },
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    // Check user is a participant
    if (!conversation.participants.some((p) => p.toString() === userId)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    res.status(200).json({ messages: conversation.messages });
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};
