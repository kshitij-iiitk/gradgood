import express from "express";
import Notification from "../models/notification.model.js";
import protectedroute from "../middleware/protectRoute.js";

const router = express.Router();

// Get all notifications for the logged-in user
router.get("/", protectedroute, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    console.log(notifications);
      
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Mark notification as read
router.post("/read/:id", protectedroute, async (req, res) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true },
      { new: true }
    );
    console.log(notif);
    
    res.json(notif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
