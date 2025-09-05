import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path"; // This line was missing in the original code, but is necessary for the app.get("*") route.

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";
import itemRoutes from "./routes/item.route.js";
import transactionRoutes from "./routes/transaction.route.js";
import notificationRoutes from "./routes/notification.route.js"

import connectToMongoDB from "./db/connectToMongoDB.js";

// The original code had a slight issue with path.join and __dirname in ES modules.
// To fix this, we need to import 'fileURLToPath' from 'url' and 'dirname' from 'path'.
// In a typical ES module setup, you can't use __dirname directly.
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname)
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

app.use(express.static(path.join(__dirname, "frontend"))); // Serves static files from the 'client/build' directory

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "frontend", "index.html"));
// });

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await connectToMongoDB();
  console.log(`Server running on http://localhost:${PORT}`);
});

export { app };