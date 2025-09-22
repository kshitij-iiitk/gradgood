import Item from "../models/item.model.js";
import { createNotification } from "../utils/notification.js";

// -----------------------------
// Get a single item by ID
// -----------------------------
export const item = async (req, res) => {
  try {
    const { id } = req.params;
    const foundItem = await Item.findById(id).populate(
      "belongTo",
      "email phoneNumber"
    );
    if (!foundItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json(foundItem);
  } catch (error) {
    console.error("Error fetching item:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// -----------------------------
// Get all items (exclude user’s own if needed)
// -----------------------------
export const items = async (req, res) => {
  try {
    const userId = req.user._id;
    const foundItems = await Item.find().populate(
      "belongTo",
      "email phoneNumber"
    );
    res.status(200).json(foundItems);
  } catch (error) {
    console.error("Error fetching items:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// -----------------------------
// Upload a new item
// -----------------------------
export const itemsUpload = async (req, res) => {
  try {
    const userId = req.user._id;
    const userName = req.user.userName;
    const phoneNumber = req.user.phoneNumber;

    const { itemName, photo, price,  description } = req.body;

    if (!itemName || !price || !userName) {
      return res
        .status(400)
        .json({ error: "Item name, price, and userName are required" });
    }

    // Prevent duplicate item for the same user
    const existingItem = await Item.findOne({
      itemName: itemName.trim(),
      belongTo: userId,
    });

    if (existingItem) {
      return res
        .status(400)
        .json({ error: "Item already exists for this user" });
    }

    const newItem = new Item({
      itemName: itemName.trim(),
      photo,
      price,
      phoneNumber,
      description,
      userName,
      belongTo: userId,
      sold: false,
    });

    await newItem.save();
    res.status(201).json(newItem);
    console.log("item created");
    
  } catch (error) {
    console.error("Error uploading item:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// -----------------------------
// Edit an item (only owner can edit)
// -----------------------------

export const itemsEdit = async (req, res) => {
  try {
    const { id } = req.params;
    const { itemName, photo, price, description, sold } = req.body;

    const foundItem = await Item.findById(id);
    if (!foundItem) return res.status(404).json({ error: "Item not found" });
    if (foundItem.belongTo.toString() !== req.user._id.toString())
      return res.status(403).json({ error: "Not authorized to edit this item" });

    const prevSold = foundItem.sold;

    if (itemName) foundItem.itemName = itemName.trim();
    if (photo) foundItem.photo = photo;
    if (price !== undefined) foundItem.price = price;
    if (description) foundItem.description = description;
    if (sold !== undefined) foundItem.sold = sold;

    await foundItem.save();

    // Notify seller if item is marked sold
    if (!prevSold && sold) {
      await createNotification(foundItem.belongTo, `Your item "${foundItem.itemName}" is sold`);
    }

    res.status(200).json(foundItem);
  } catch (error) {
    console.error("Error editing item:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


// -----------------------------
// Delete an item (only owner can delete)
// -----------------------------
export const itemsDelete = async (req, res) => {
  try {
    const { id } = req.params;

    const foundItem = await Item.findById(id);
    if (!foundItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (foundItem.belongTo.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this item" });
    }

    await foundItem.deleteOne();
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
