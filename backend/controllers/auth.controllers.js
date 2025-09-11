import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ------------------ Signup ------------------
export const signup = async (req, res) => {
  try {
    const {
      userName,
      rollNumber,
      password,
      email,
      profilePic,
      upiId,
      phoneNumber,
    } = req.body;

    const user = await User.findOne({ rollNumber });
    if (user) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      rollNumber,
      email,
      upiId,
      phoneNumber,
      userName,
      password: hashedPassword,
      profilePic: profilePic || "",
    });

    await newUser.save();
    generateTokenAndSetCookie(newUser._id, res);

    res.status(201).json({
      message: "User registered successfully",
      _id: newUser._id,
      email:newUser.email,
      upiId:newUser.upiId,
      phoneNumber:newUser.phoneNumber,
      userName: newUser.userName,
      rollNumber: newUser.rollNumber,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.log("Error in signup:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ------------------ Login ------------------
export const login = async (req, res) => {
  try {
    const { rollNumber, password } = req.body;
    console.log("Login attempt:", { rollNumber, password });

    const user = await User.findOne({ rollNumber });
    console.log("User in DB:", user);

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const isPasswordCorrect = await bcryptjs.compare(
      password,
      user.password || ""
    );
    console.log("Password check:", isPasswordCorrect);

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Wrong password" });
    }

    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      message: "User logged in successfully",
      _id: user._id,
      userName: user.userName,
      email: user.email,
      upiId: user.upiId,
      phoneNumber: user.phoneNumber,
      rollNumber: user.rollNumber,
      profilePic: user.profilePic,
      email: user.email,
    });
  } catch (error) {
    console.log("Error in login:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ------------------ Logout ------------------
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log("Error in logout:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ------------------ Google Auth ------------------
export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    const allowedDomain = "iiitkottayam.ac.in";
    if (!email.endsWith(`@${allowedDomain}`)) {
      return res.status(403).json({ error: "Unauthorized email domain" });
    }

    const rollNumber = transformEmail(email);

    let user = await User.findOne({ googleId });
    if (!user) {
      user = await User.findOne({ email });

      if (user) {
        user.googleId = googleId;
        user.profilePic = user.profilePic || picture;
        await user.save();
      } else {
        const userName = email.split("@")[0] + "_" + Date.now();

        user = new User({
          rollNumber,
          userName: name,
          email,
          googleId,
          profilePic: picture,
          password: null,
          isGoogleUser: true,
        });

        await user.save();
      }
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      message: "Google authentication successful",
      _id: user._id,
      userName: user.userName,
      rollNumber: user.rollNumber,
      email: user.email,
      profilePic: user.profilePic,
      isGoogleUser: user.isGoogleUser || false,
    });
  } catch (error) {
    console.log("Error in Google auth:", error.message);
    res.status(500).json({ error: "Google authentication failed" });
  }
};

// ------------------ Roll number generator ------------------
function transformEmail(email) {
  const username = email.split("@")[0];
  const rollPart = username.replace(/^[^\d]+/, "");
  const match = rollPart.match(/^(\d+)([a-zA-Z]+)(\d+)$/);

  if (!match) throw new Error("Invalid email format for roll number");

  const year = match[1];
  const dept = match[2];
  const id = match[3];

  return `20${year}${dept.toUpperCase()}${id.padStart(4, "0")}`;
}
