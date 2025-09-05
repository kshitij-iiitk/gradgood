import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./auth.route.js";
import messageRoutes from "./message.route.js";
import userRoutes from "./user.route.js";
import itemRoutes from "./item.route.js";
import transactionRoutes from "./transaction.route.js";
import notificationRoutes from "./notification.route.js"

import connectToMongoDB from "../db/connectToMongoDB.js";

dotenv.config({ override: true });

const app = express();

// Middlewares
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/user", userRoutes);
app.use("/api/item", itemRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await connectToMongoDB();
  console.log(`Server running on http://localhost:${PORT}`);
});

export { app };
