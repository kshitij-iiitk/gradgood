import express from "express";
import {
  items,
  item,
  itemsUpload,
  itemsDelete,
  itemsEdit,
} from "../controllers/item.controllers.js";
import protectedroute from "../middleware/protectRoute.js";

const router = express.Router();
router.get("/item/:id", item);
router.get("/items", protectedroute, items);
router.post("/upload", protectedroute, itemsUpload);
router.put("/edit/:id", protectedroute, itemsEdit);
router.delete("/delete/:id", protectedroute, itemsDelete);

export default router;
