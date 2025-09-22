import express from "express";
import protectedroute from "../middleware/protectRoute.js";
import { createTransaction , confirmTransaction, getTransaction,getAllTransactions } from "../controllers/transaction.controllers.js";

const router = express.Router();

router.post("/create",protectedroute,createTransaction);

router.post("/confirm/:id",protectedroute,confirmTransaction);

router.get("/:id",getTransaction);

router.get("/", getAllTransactions);

export default router;
