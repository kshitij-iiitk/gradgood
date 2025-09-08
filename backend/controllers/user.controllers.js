import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { createNotification } from "../utils/notification.js";


export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user._id.toString();

    let conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "userName email phoneNumber profilePic")
      .populate({
        path: "messages",
        populate: {
          path: "senderId receiverId",
          select: "userName email phoneNumber profilePic",
        },
      });

    conversations = conversations.map((conv) => {
      conv.participants.sort((a, b) =>
        a._id.toString().localeCompare(b._id.toString())
      );
      return conv;
    });

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
  const { id: receiverId } = req.params;
  try {
    const userId = req.user._id;

    const participants = [userId.toString(), receiverId.toString()].sort(
      (a, b) => b.localeCompare(a)
    );

    const conversation = await Conversation.findOne({ participants })
      .populate("participants", "userName email phoneNumber  profilePic")
      .populate({
        path: "messages",
        populate: {
          path: "senderId receiverId",
          select: "userName email phoneNumber profilePic",
        },
      });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

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

    const participants = [userId.toString(), receiverId.toString()].sort(
      (a, b) => b.localeCompare(a)
    );

    let conversation = await Conversation.findOne({ participants });

    if (!conversation) {
      conversation = new Conversation({ participants });
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
