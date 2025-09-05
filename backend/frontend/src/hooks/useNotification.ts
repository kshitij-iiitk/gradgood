// hooks/useNotifications.tsx
import { useState, useEffect } from "react";

export interface Notification {
  _id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const data: Notification[] = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/read/${id}`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to mark as read");
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return { notifications, loading, fetchNotifications, markAsRead };
}
