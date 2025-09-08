import { createContext, useContext, useState, type ReactNode } from "react";

export interface User {
  _id: string;
  userName: string;
  rollNumber: string;
  email?: string;
  profilePic?: string;
  token?: string;
  gPayID:string;
  phoneNumber?:string;
}

interface AuthContextType {
  authUser: User | null;
  setAuthUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextType>({
  authUser: null,
  setAuthUser: () => {},
});

export const useAuthContext = () => {
  return useContext(AuthContext);
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthProviderProps) => {
  const [authUser, setAuthUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("User");
    return storedUser ? (JSON.parse(storedUser) as User) : null;
  });

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
