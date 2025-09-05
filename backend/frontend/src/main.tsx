import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { BrowserRouter } from "react-router-dom";


import { SidebarProvider } from './components/ui/sidebar.tsx';
import { AuthContextProvider } from "./context/AuthContext.tsx";
import { ChatSelectedProvider } from './context/ChatContext.tsx';

// import { GoogleOAuthProvider } from '@react-oauth/google';
// const clientId= import.meta.env.VITE_GOOGLE_CLIENT_ID as string;


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthContextProvider>
      <ChatSelectedProvider>
      {/* <GoogleOAuthProvider clientId={clientId}> */}
        <SidebarProvider>
          <App />
        </SidebarProvider>
      {/* </GoogleOAuthProvider> */}
      </ChatSelectedProvider>
    </AuthContextProvider>
  </BrowserRouter>
)
