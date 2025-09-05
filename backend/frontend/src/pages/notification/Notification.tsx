import { useEffect } from "react";
import useNotifications,{type Notification} from "@/hooks/useNotification";

export default function Notifications() {
  const { notifications, loading, fetchNotifications, markAsRead } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="min-h-screen p-4 bg-black text-gray-100">
      <div className="max-w-3xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold text-gray-100 mb-4">Notifications</h1>

        {loading ? (
          <p className="text-gray-400">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="text-gray-400">You have no notifications.</p>
        ) : (
          notifications.map((notif: Notification) => (
            <div
              key={notif._id}
              className={`p-4 rounded-xl bg-black/60 backdrop-blur-md border border-gray-700 shadow-md flex justify-between items-start cursor-pointer transition hover:scale-[1.02]`}
              onClick={() => markAsRead(notif._id)}
            >
              <div>
                <p className={`text-gray-100 font-medium ${notif.read ? "opacity-70" : "text-indigo-400"}`}>
                  {notif.message}
                </p>
                <span className="text-gray-500 text-xs mt-1 block">
                  {new Date(notif.createdAt).toLocaleString()}
                </span>
              </div>

              {!notif.read && (
                <span className="w-3 h-3 bg-indigo-500 rounded-full mt-1" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
