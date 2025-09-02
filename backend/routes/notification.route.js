// routes/notifications.js
import express from "express";
import Notification from "../models/Notification.model.js";
import protectedroute from "../middleware/protectRoute.js";

const router = express.Router();

// Get all notifications for the logged-in user
router.get("/", protectedroute, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark notification as read
router.post("/read/:id", protectedroute, async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(notif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
