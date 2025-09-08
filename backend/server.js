import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path"; 

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";
import itemRoutes from "./routes/item.route.js";
import transactionRoutes from "./routes/transaction.route.js";
import notificationRoutes from "./routes/notification.route.js"

import connectToMongoDB from "./db/connectToMongoDB.js";

const app = express();

dotenv.config();

const PORT = process.env.PORT || 3000;
// Changed from the complex ES module approach to:
const __dirname = path.resolve();

console.log(__dirname)

// Middlewares
// app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/user", userRoutes);
app.use("/api/item", itemRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(express.static(path.join(__dirname, "frontend", "dist")));



app.get("/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});


// Start server
app.listen(PORT, async () => {
  await connectToMongoDB();
  console.log(`Server running on http://localhost:${PORT}`);
});
