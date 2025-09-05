"use client";

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Inbox,
  LogOut,
  User,
  Home,
  Bell,
  BellDot,
  Menu,
  X,
} from "lucide-react";
import useLogout from "@/hooks/useLogout";

const idNOTI = false;
const notificationIcon = idNOTI ? BellDot : Bell;

const mainItems = [
  { title: "Marketplace", url: "/", icon: Home },
  { title: "Inbox", url: "/chats", icon: Inbox },
  { title: "Profile", url: "/profile", icon: User },
  { title: "Post Item", url: "/post-item", icon: notificationIcon },
  { title: "Notification", url: "/notification", icon: notificationIcon },
];

export function AppSidebar() {
  const { loading, logout } = useLogout();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [currentTranslateX, setCurrentTranslateX] = useState(0);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleNavigation = (url: string) => {
    navigate(url);
    setMobileOpen(false);
  };

  // Touch/Mouse event handlers for swipe functionality
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    setDragStartX(clientX);
    setCurrentTranslateX(0);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;

    const deltaX = clientX - dragStartX;
    
    if (mobileOpen) {
      // If sidebar is open, allow swiping left to close
      if (deltaX < 0) {
        const newTranslateX = Math.max(deltaX, -256); // 256px = w-64
        setCurrentTranslateX(newTranslateX);
      }
    } else {
      // If sidebar is closed, allow swiping right to open
      if (deltaX > 0) {
        const newTranslateX = Math.min(deltaX - 256, 0); // Start from -256px
        setCurrentTranslateX(newTranslateX);
      }
    }
  };

  const handleEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Determine whether to open or close based on swipe distance
    const threshold = 128; // Half of sidebar width
    
    if (mobileOpen) {
      // If open and swiped left enough, close it
      if (currentTranslateX < -threshold) {
        setMobileOpen(false);
      }
    } else {
      // If closed and swiped right enough, open it
      if (currentTranslateX > -threshold) {
        setMobileOpen(true);
      }
    }
    
    setCurrentTranslateX(0);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX);
  };


  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Add global mouse move and up listeners when dragging
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        handleMove(e.clientX);
      };

      const handleGlobalMouseUp = () => {
        handleEnd();
      };

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, dragStartX, mobileOpen]);

  return (
    <div className="absolute top-0 left-0 z-50">
      {/* Mobile Header */}
      <div className="sm:hidden flex items-center justify-between p-2 mt-2 ms-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="inline-flex items-center p-2 text-gray-400 rounded-lg bg-black/40 backdrop-blur-md hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-gray-600"
          aria-controls="glass-sidebar"
          type="button"
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside
        id="glass-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-black/90 backdrop-blur-lg border-r border-gray-800 shadow-xl">
          {/* Main Navigation */}
          <ul className="space-y-2 font-medium">
            {mainItems.map((item) => (
              <li key={item.title}>
                <button
                  onClick={() => handleNavigation(item.url)}
                  className="flex items-center w-full p-2 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition group text-left"
                >
                  <item.icon className="w-5 h-5 text-gray-500 group-hover:text-white transition" />
                  <span className="flex-1 ms-3 whitespace-nowrap">{item.title}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* Logout Button */}
          <div className="pt-4 mt-4 border-t border-gray-800">
            <button
              onClick={logout}
              disabled={loading}
              className="flex items-center w-full p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition group text-left disabled:opacity-50"
            >
              <LogOut className="w-5 h-5 text-gray-500 group-hover:text-red-400 transition" />
              <span className="ms-3">{loading ? "Logging out..." : "Logout"}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay with Swipe Support */}
      <div 
        className={`fixed inset-0 z-50 sm:hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileOpen(false)}
        />

        {/* Mobile Sidebar with Swipe */}
        <aside
          ref={sidebarRef}
          className={`fixed top-0 left-0 z-50 w-64 h-screen bg-black/90 backdrop-blur-lg border-r border-gray-800 shadow-lg transition-transform duration-300 ease-in-out ${
            mobileOpen && !isDragging ? 'translate-x-0' : ''
          } ${!mobileOpen && !isDragging ? '-translate-x-full' : ''}`}
          style={{
            transform: isDragging 
              ? `translateX(${mobileOpen ? currentTranslateX : -256 + currentTranslateX}px)` 
              : undefined
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="h-full px-3 py-4 overflow-y-auto relative">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 p-2 text-gray-400 rounded-lg hover:bg-black/40"
              onClick={() => setMobileOpen(false)}
            >
              <X className="w-5 h-5" />
              <span className="sr-only">Close Menu</span>
            </button>

            {/* Main Navigation */}
            <div className="mt-12">
              <ul className="space-y-2 font-medium">
                {mainItems.map((item) => (
                  <li key={item.title}>
                    <button
                      onClick={() => handleNavigation(item.url)}
                      className="flex items-center w-full p-2 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition group text-left"
                    >
                      <item.icon className="w-5 h-5 text-gray-500 group-hover:text-white transition" />
                      <span className="flex-1 ms-3 whitespace-nowrap">{item.title}</span>
                    </button>
                  </li>
                ))}
              </ul>

              {/* Logout Button */}
              <div className="pt-4 mt-4 border-t border-gray-800">
                <button
                  onClick={logout}
                  disabled={loading}
                  className="flex items-center w-full p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition group text-left disabled:opacity-50"
                >
                  <LogOut className="w-5 h-5 text-gray-500 group-hover:text-red-400 transition" />
                  <span className="ms-3">{loading ? "Logging out..." : "Logout"}</span>
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Swipe Edge Detector - Invisible area to detect swipes from screen edge */}
      <div
        className="fixed top-0 left-0 w-6 h-screen z-30 sm:hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
    </div>
  );
}