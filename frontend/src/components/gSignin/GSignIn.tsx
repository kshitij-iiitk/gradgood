"use client";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

// ------------------ Roll number generator ------------------
function transformEmail(email: string): { rollNumber: string; userName: string } {
  const username = email.split("@")[0];
  const rollPart = username.replace(/^[^\d]+/, "");
  const userNameMatch = username.match(/^[^\d]+/);

  if (!userNameMatch) throw new Error("Invalid email format for username");

  const userName = userNameMatch[0];
  const match = rollPart.match(/^(\d+)([a-zA-Z]+)(\d+)$/);

  if (!match) throw new Error("Invalid email format for roll number");

  const year = match[1];
  const dept = match[2];
  const id = match[3];

  return {
    rollNumber: `20${year}${dept.toUpperCase()}${id.padStart(4, "0")}`,
    userName: userName,
  };
}

interface GoogleJwtPayload {
  email: string;
  name: string;
  picture: string;
}

const GoogleSignIn = () => {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse: any) => {
    try {
      const decoded = jwtDecode<GoogleJwtPayload>(credentialResponse.credential);

      const { rollNumber, userName } = transformEmail(decoded.email);

      // Send the token and extracted info to backend
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: credentialResponse.credential,
          rollNumber,
          userName,
        }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));

        // If phone number missing, redirect to complete profile
        if (!data.user.phoneNumber) {
          navigate("/complete-profile");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error("Google login failed", error);
    }
  };

  return (
    <div className="flex justify-center mt-6">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log("Login Failed")}
      />
    </div>
  );
};

export default GoogleSignIn;
