import Item from "../models/item.model.js";
import Transaction from "../models/transaction.model.js";
import Conversation from "../models/conversation.model.js";


export const createTransaction = async (req, res) => {
  try {
    const { fromUser, toUser, amount, itemId } = req.body;
    if (!fromUser || !toUser?.upiId || !amount || !itemId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const item = await Item.findById(itemId);
    if (item.sold) return res.status(400).json({ error: "Item already sold" });

    // Generate UPI link with the latest amount
    const upiLink = `upi://pay?pa=${toUser.upiId}&pn=${encodeURIComponent(
      toUser.name
    )}&am=${amount}&cu=INR`;

    // Update existing transaction if found
    const existingTx = await Transaction.findOneAndUpdate(
      {
        fromUser,
        "toUser.upiId": toUser.upiId,
        itemId,
      },
      { $set: { amount, upiLink } }, // update amount + upiLink
      { new: true }
    );

    if (existingTx) {
      console.log("Existing transaction updated:", existingTx._id);
      return res.status(200).json(existingTx);
    }

    // Otherwise, create new transaction
    const transaction = await Transaction.create({
      fromUser,
      toUser,
      amount,
      itemId,
      upiLink,
    });

    console.log("Transaction created:", transaction._id);
    res.status(201).json(transaction);
  } catch (err) {
    console.error("Failed to create transaction:", err);
    res.status(500).json({ error: "Failed to create transaction" });
  }
};



export const getTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const tx = await Transaction.findById(id);
    if (!tx) return res.status(404).json({ error: "Transaction not found" });
    res.json(tx);
  } catch (err) {
    console.error("Failed to fetch transaction:", err);
    res.status(500).json({ error: "Failed to fetch transaction" });
  }
}

export const confirmTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const tx = await Transaction.findById(id);
    console.log("tx:", tx);

    if (!tx) return res.status(404).json({ error: "Transaction not found" });

    if (tx.status === "completed") {
      return res.status(400).json({ error: "Transaction already completed" });
    }

    if (tx.itemId) {
      const item = await Item.findById(tx.itemId);
      if (!item) return res.status(404).json({ error: "Item not found" });
      item.sold = true;
      await item.save();
    }

    tx.status = "completed";
    console.log("trans completed");

    await tx.save();

    res.json(tx);
  } catch (err) {
    console.error("Failed to confirm transaction:", err);
    res.status(500).json({ error: "Failed to confirm transaction" });
  }
}


export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    res.json(transactions);
  } catch (err) {
    console.error("Failed to fetch transactions:", err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
}