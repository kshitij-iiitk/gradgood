import express from "express";
import { sendMessage, getMessage } from "../controllers/message.controllers.js";
import protectedroute from "../middleware/protectRoute.js";
import Message from "../models/message.model.js";

const router = express.Router();

router.post("/send/:id", protectedroute, sendMessage);
router.get("/:id", protectedroute, getMessage);

router.get("/stream/:conversationId", async (req, res) => {
  const { conversationId } = req.params;

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const heartbeat = setInterval(() => {
    res.write(`event: heartbeat\ndata: {}\n\n`);
  }, 15000);

  const sendMessage = (msg) => {
    res.write(`data: ${JSON.stringify(msg)}\n\n`);
  };

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

  req.on("close", () => {
    clearInterval(interval);
    clearInterval(heartbeat);
    res.end();
  });
});

export default router;
