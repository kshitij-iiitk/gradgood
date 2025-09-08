import express from "express";
import protectedroute from "../middleware/protectRoute.js";
import { getUserConversations, getUserConversation,makeConversation,deleteConversation, editUser } from "../controllers/user.controllers.js";

const router = express.Router();


router.get("/conversations", protectedroute, getUserConversations);
router.get("/conversation/:id", protectedroute, getUserConversation);
router.post("/create/:id", protectedroute, makeConversation);
router.delete("/delete/:id", protectedroute, deleteConversation);
router.put("/:id", protectedroute, editUser);

export default router;
