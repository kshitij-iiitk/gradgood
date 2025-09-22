import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { createNotification } from "../utils/notification.js";


export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    let conversations = await Conversation.find({ participants: userId })
      // 🔴 removed .populate("itemId")
      .populate("participants", "userName email phoneNumber profilePic upiId")
      .populate({
        path: "messages",
        populate: {
          path: "senderId receiverId",
          select: "userName email phoneNumber profilePic upiId",
        },
      })
      .lean(); // ✅ returns plain JS objects

    // Convert itemId to string (safe even if null)
    conversations = conversations.map((conv) => ({
      ...conv,
      itemId: conv.itemId?.toString() || null,
      participants: conv.participants.sort((a, b) =>
        a._id.toString().localeCompare(b._id.toString())
      ),
    }));

    // Sort by most recent message or last updated
    const sorted = conversations.sort((a, b) => {
      const aLatest =
        a.messages[a.messages.length - 1]?.createdAt || a.updatedAt;
      const bLatest =
        b.messages[b.messages.length - 1]?.createdAt || b.updatedAt;
      return new Date(bLatest) - new Date(aLatest);
    });

    res.status(200).json(sorted);
  } catch (error) {
    console.error("Error fetching conversations:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserConversation = async (req, res) => {
  try {
    const { convoId } = req.params;
    const userId = req.user._id.toString();

    const conversation = await Conversation.findOne({
      _id: convoId,
      participants: userId,
    })
      // 🔴 removed .populate("itemId")
      .populate("participants", "userName email phoneNumber profilePic upiId")
      .populate({
        path: "messages",
        populate: {
          path: "senderId receiverId",
          select: "userName email phoneNumber profilePic upiId",
        },
      })
      .lean();

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    conversation.itemId = conversation.itemId?.toString() || null;

    res.status(200).json(conversation);
  } catch (error) {
    console.error("Error fetching conversation:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const makeConversation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: receiverId } = req.params;
    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({ error: "itemId is required to create a conversation" });
    }

    const participants = [userId.toString(), receiverId.toString()].sort(
      (a, b) => b.localeCompare(a)
    );

    // Find conversation only for this item
    let conversation = await Conversation.findOne({ participants, itemId });

    if (!conversation) {
      conversation = new Conversation({ participants, itemId });
      await conversation.save();

      await createNotification(receiverId, `New conversation started by ${req.user.userName}`);
    }

    res.status(201).json(conversation);
  } catch (error) {
    console.error("Error creating conversation:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const deleteConversation = async (req, res) => {
  try {
    const { id: conversationId } = req.params;
    const userId = req.user._id.toString();

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const isParticipant = conversation.participants
      .map((p) => p.toString())
      .includes(userId);

    if (!isParticipant) {
      return res
        .status(403)
        .json({ error: "You are not allowed to delete this conversation" });
    }

    await Message.deleteMany({ _id: { $in: conversation.messages } });

    await Conversation.findByIdAndDelete(conversationId);

    res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (error) {
    console.error("Error deleting conversation:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");


    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Failed to fetch user details" });
  }
}