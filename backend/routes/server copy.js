//this is for when you deploy this shit


import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

import authRoutes from "./auth.route.js";
import messageRoutes from "./message.route.js";
import userRoutes from "./user.route.js";
import itemRoutes from "./item.route.js";
import transactionRoutes from "./transaction.route.js";

import connectToMongoDB from "../db/connectToMongoDB.js";

dotenv.config({ override: true });

const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.resolve();

// Middleware
app.use(cors({
  origin: "http://localhost:3000", // React dev server URL
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/user", userRoutes);
app.use("/api/item", itemRoutes);
app.use("/api/transactions", transactionRoutes);

// Serve React frontend (after API routes)
const frontendPath = path.join(__dirname, "frontend", "build");
app.use(express.static(frontendPath));

// Catch-all route to serve React index.html for unmatched routes
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Start server
app.listen(port, () => {
  connectToMongoDB();
  console.log(`Server running at http://localhost:${port}`);
});
