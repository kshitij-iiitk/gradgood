import express from "express" ; 
import { login, logout, signup,googleAuth } from "../controllers/auth.controllers.js";

const router = express.Router() ;

router.post("/signup", signup);

router.post("/login", (req, res, next) => {
  console.log("HIT /api/auth/login");
  next();
}, login);

router.post("/logout", logout);

router.post("/google", googleAuth);

export default router;
