import Notification from "../models/notification.model.js";

export const createNotification = async (userId, message) => {
  try {
    const notif = new Notification({ userId, message });
    await notif.save();
  } catch (err) {
    console.error("Error creating notification:", err.message);
  }
};
