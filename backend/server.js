import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";
import itemRoutes from "./routes/item.route.js";
import transactionRoutes from "./routes/transaction.route.js";
import notificationRoutes from "./routes/notification.route.js";
import connectToMongoDB from "./db/connectToMongoDB.js";

dotenv.config({ override: true });

const app = express();

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/user", userRoutes);
app.use("/api/item", itemRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/notifications", notificationRoutes);

// Serve frontend (Vite build from frontend/dist)
const frontendPath = path.join(__dirname, "frontend", "dist");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await connectToMongoDB();
  console.log(`Server running on port ${PORT}`);
});

export { app };
