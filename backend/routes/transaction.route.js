import express from "express";
import Item from "../models/item.model.js";


const router = express.Router();

// In-memory transaction storage (replace with DB later)
const transactions = {};

// Create a new transaction
router.post("/create", (req, res) => {
  const { fromUser, toUser, amount, itemId } = req.body;
  if (!fromUser || !toUser || !amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const id = Date.now().toString(); // simple unique ID
  const upiLink = `upi://pay?pa=${toUser.upiId}&pn=${toUser.name}&am=${amount}&cu=INR`;

  transactions[id] = {
    id,
    fromUser,
    toUser,
    amount,
    itemId,
    status: "pending",
    upiLink,
  };

  res.status(201).json(transactions[id]);
});


// Confirm a transaction
router.post("/:id/confirm", async (req, res) => {
  const { id } = req.params;

  if (!transactions[id]) {
    return res.status(404).json({ error: "Transaction not found" });
  }

  const tx = transactions[id];

  try {
    if (tx.itemId) {
      const item = await Item.findById(tx.itemId);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      if (item.sold) {
        return res.status(400).json({ error: "Item already sold" });
      }

      await Item.findByIdAndUpdate(tx.itemId, { sold: true });
    }

    tx.status = "completed";
    res.json(tx);
  } catch (err) {
    console.error("Failed to update item as sold:", err);
    res.status(500).json({ error: "Failed to confirm transaction" });
  }
});


// Get a transaction by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;

  if (!transactions[id]) {
    return res.status(404).json({ error: "Transaction not found" });
  }

  res.json(transactions[id]);
});

export default router;
