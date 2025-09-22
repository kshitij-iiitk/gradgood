import { useEffect } from "react";
import useNotifications, { type Notification } from "@/hooks/useNotification";

export default function Notifications() {
  const { notifications, fetchNotifications, markAsRead } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-gray-100">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-2">
            Notifications
          </h1>
          <p className="text-gray-400 text-lg">
            Stay updated with your latest activities
          </p>
        </div>

        {/* Loading state */}
        {notifications.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-12 h-12 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-5 5v-5zM4.828 4.828A4 4 0 015.5 4H9v1H5.5a3 3 0 00-2.121.879l-.707.707A1 1 0 002 7.414V11a3 3 0 003 3h4v-1H5a2 2 0 01-2-2V7.414a2 2 0 01.586-1.414l.707-.707A2 2 0 015.5 5H9V4H5.5a3 3 0 00-2.121.879z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No notifications yet
            </h3>

          </div>
        ) : (
          /* Notifications list */
          <div className="space-y-4">
            {notifications.map((notif: Notification) => (
              <div
                key={notif._id}
                className={`group p-6 rounded-2xl bg-black/60 backdrop-blur-xl border border-gray-700/50 shadow-lg cursor-pointer transition-all duration-200 hover:scale-[1.01] hover:shadow-xl hover:border-indigo-500/30 ${!notif.read ? "border-indigo-500/50 bg-indigo-500/5" : ""
                  }`}
                onClick={() => markAsRead(notif._id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Icon */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${!notif.read
                          ? "bg-indigo-500/20 text-indigo-400"
                          : "bg-gray-700/50 text-gray-500"
                        }`}
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 17h5l-5 5v-5zM4.828 4.828A4 4 0 015.5 4H9v1H5.5a3 3 0 00-2.121.879l-.707.707A1 1 0 002 7.414V11a3 3 0 003 3h4v-1H5a2 2 0 01-2-2V7.414a2 2 0 01.586-1.414l.707-.707A2 2 0 015.5 5H9V4H5.5a3 3 0 00-2.121.879z"
                        />
                      </svg>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium leading-relaxed ${!notif.read ? "text-white" : "text-gray-300"
                          }`}
                      >
                        {notif.message}
                      </p>
                      
                    </div>
                  </div>

                  {/* Unread indicator */}
                  {!notif.read && (
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse" />
                      <span className="text-indigo-400 text-xs font-medium">
                        NEW
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
