import { useState } from "react";
import toast from "react-hot-toast";
import uploadToCloudinary from "@/utils/uploadToCloudinary";
import { useNavigate } from "react-router-dom";

// ------------------ Roll number generator ------------------
function transformEmail(email: string): { rollNumber: string; userName: string } {
  const username = email.split("@")[0];
  const rollPart = username.replace(/^[^\d]+/, "");
  const userNameMatch = username.match(/^[^\d]+/);
  if (!userNameMatch) throw new Error("Invalid email format for username");
  const userName = userNameMatch[0];
  const match = rollPart.match(/^(\d+)([a-zA-Z]+)(\d+)$/);
  if (!match) throw new Error("Invalid email format for roll number");

  const year = `20${match[1].padStart(2, "0")}`;
  const dept = match[2];
  const id = match[3];

  return {
    rollNumber: `${year}${dept.toUpperCase()}${id.padStart(4, "0")}`,
    userName: userName,
  };
}



export const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();



  const signup = async (email: string, password: string, photo: File, upiId: string, phoneNumber: string) => {
    try {
      setLoading(true);

      // Extract roll number and username
      const { rollNumber, userName } = transformEmail(email);

      // Upload image to Cloudinary
      const imageUrl = await uploadToCloudinary(photo);

      // Send to backend
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          rollNumber,
          phoneNumber,
          userName,
          upiId,
          profilePic: imageUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      navigate('/login')
      toast.success("User registered successfully!");
      return data;
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading };
};
