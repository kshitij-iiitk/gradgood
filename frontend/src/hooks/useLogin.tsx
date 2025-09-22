import { useState } from "react";
import { z } from "zod";
import { useAuthContext, type User as AuthUser } from "@/context/AuthContext";

// -----------------------------
// Zod schema for login (rollNumber + password)
// -----------------------------
const loginSchema = z.object({
  rollNumber: z.string().min(3, "Roll Number must be at least 3 characters."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type LoginInput = z.infer<typeof loginSchema>;


interface UseLoginReturn {
  login: (input: LoginInput) => Promise<void>;
  loading: boolean;
}

const useLogin = (): UseLoginReturn => {
  const [loading, setLoading] = useState(false);
  const { setAuthUser } = useAuthContext();

  const login = async (input: LoginInput): Promise<void> => {
    const result = loginSchema.safeParse(input);
    if (!result.success) {
      result.error.issues.forEach((err) => console.log(err.message));
      return;
    }

    setLoading(true);
    try {

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
      });
      console.log("DONE Fetching")

      console.log("Status:", res.status, "OK:", res.ok);
      

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data: Partial<AuthUser> | { error: string } = await res.json();
      console.log("Response JSON:", data);
      if ("error" in data) {
        throw new Error(data.error);
      }

      const user: AuthUser = {
        _id: data._id!,
        userName: data.userName ?? "",
        rollNumber: data.rollNumber ?? result.data.rollNumber,
        profilePic: data.profilePic ?? "",
        upiId: data.upiId ?? "", // fallback ensures it's always a string
        email: data.email ?? "",
        phoneNumber: data.phoneNumber ?? "",
        token: data.token ?? "",
      };

      localStorage.setItem("User", JSON.stringify(user));
      setAuthUser(user);
      console.log("Logged in:", user);
    } catch (error) {
     console.log("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};

export default useLogin;
