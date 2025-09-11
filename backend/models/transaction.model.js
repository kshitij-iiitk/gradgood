import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    fromUser: { type: String, required: true }, // gPayID
    toUser: {
      name: { type: String, required: true },
      upiId: { type: String, required: true },
    },
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "completed"], default: "pending" },
    upiLink: { type: String, required: true },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;