import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";


import { useAuthContext } from "./context/AuthContext";
import { useChatSelected } from "./context/ChatContext";


import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Logout from "./pages/logout/Logout";
import Marketplace from "./pages/marketplace/Marketplace";
import Item from "./pages/item/Item";
import Chatroom from "./pages/chatroom/Chatroom";
import Profile from "./pages/profile/Profile";
import PostItem from "./pages/post-item/PostItem";
import EditItem from "./pages/item/EditItem";
import Notifications from "./pages/notification/Notification";

import SpinningLoadingIcons from "./components/ui/loading/Loading";
import { AppSidebar } from "./components/AppSidebar/AppSidebar";

function App() {
  const { authUser } = useAuthContext();
  const { chatSelected } = useChatSelected();

  return (
    <div
      className={`w-full min-h-screen 
    ${authUser && !chatSelected ? "lg:pl-[18vw] pt-[6vh]" : "lg:pt-0"} 
    p-2 lg:pt-4 lg:pb-0`}
    >
      {authUser && !chatSelected ? <AppSidebar /> : ""}
      <Routes>

        <Route
          path="/"
          element={authUser ? <Marketplace /> : <Navigate to="/login" />}
        /><Route
          path="/dummy"
          element={<SpinningLoadingIcons />}
        />
        <Route
          path="/market/:id"
          element={authUser ? <Item /> : <Navigate to="/login" />}
        />
        <Route
          path="/edit-item/:id"
          element={authUser ? <EditItem /> : <Navigate to="/login" />}
        />
        <Route
          path="/chats"
          element={authUser ? <Chatroom /> : <Navigate to="/login" />}
        />

        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/post-item"
          element={authUser ? <PostItem /> : <Navigate to="/login" />}
        />
        <Route
          path="/notification"
          element={authUser ? <Notifications /> : <Navigate to="/login" />}
        />

        <Route
          path="/login"
          element={authUser ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/logout"
          element={authUser ? <Navigate to="/" /> : <Logout />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" /> : <Signup />}
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
