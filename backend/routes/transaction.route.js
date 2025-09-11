import express from "express";
import { createTransaction , confirmTransaction, getTransaction,getAllTransactions } from "../controllers/transaction.controllers.js";

const router = express.Router();

// Create a new transaction
router.post("/create",createTransaction);

router.post("/:id/confirm",confirmTransaction);

// Get a transaction by ID
router.get("/:id",getTransaction);

// Optional: Get all transactions (for admin/testing)
router.get("/", getAllTransactions);

export default router;
