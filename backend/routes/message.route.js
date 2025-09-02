import express from "express";
import { sendMessage, getMessage } from "../controllers/message.controllers.js";
import protectedroute from "../middleware/protectRoute.js";
import Message from "../models/message.model.js";

const router = express.Router();

router.post("/send/:id", protectedroute, sendMessage);
router.get("/:id", protectedroute, getMessage);

// SSE endpoint
router.get("/stream/:conversationId", async (req, res) => {
  const { conversationId } = req.params;

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  // Send a heartbeat every 15 seconds to keep connection alive
  const heartbeat = setInterval(() => {
    res.write(`event: heartbeat\ndata: {}\n\n`);
  }, 15000);

  // Function to send a new message
  const sendMessage = (msg) => {
    res.write(`data: ${JSON.stringify(msg)}\n\n`);
  };

  // Listen to new messages in DB (simplest: poll DB every 1s)
  let lastMessageTime = new Date();
  const interval = setInterval(async () => {
    const newMessages = await Message.find({
      conversationId,
      createdAt: { $gt: lastMessageTime },
    }).populate("senderId receiverId", "userName profilePic");

    if (newMessages.length > 0) {
      lastMessageTime = new Date();
      newMessages.forEach(sendMessage);
    }
  }, 1000);

  // Cleanup on client disconnect
  req.on("close", () => {
    clearInterval(interval);
    clearInterval(heartbeat);
    res.end();
  });
});

export default router;
