import express from "express";
import protectedroute from "../middleware/protectRoute.js";
import { createTransaction , confirmTransaction, getTransaction,getAllTransactions } from "../controllers/transaction.controllers.js";

const router = express.Router();

// Create a new transaction
router.post("/create",protectedroute,createTransaction);

router.post("/confirm/:id",protectedroute,confirmTransaction);

// Get a transaction by ID
router.get("/:id",getTransaction);

// Optional: Get all transactions (for admin/testing)
router.get("/", getAllTransactions);

export default router;
