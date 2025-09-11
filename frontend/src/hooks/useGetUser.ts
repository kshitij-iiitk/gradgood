import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

export interface User {
  _id: string;
  userName: string;
  rollNumber: string;
  phoneNumber?: string;
  profilePic?: string;
  email?: string;
  gPayID?: string;
  googleId?: string;
  isGoogleUser: boolean;
  createdAt: string;
  updatedAt: string;
}

const useGetUser = (userId?: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/user/${userId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch user");

      const data: User = await res.json();
      setUser(data);
    } catch (err: any) {
      toast.error(err.message || "Error fetching user");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, loading, refetch: fetchUser };
};

export default useGetUser;
