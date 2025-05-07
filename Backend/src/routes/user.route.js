import express from "express";
import { getUserStats, googleAuth, logout } from "../controllers/user.controller.js";
import verifyUser from "../middlewares/auth.js";

const router = express.Router();

router.get("/auth/google", googleAuth);
router.get("/logout", verifyUser, logout);
router.get("/", verifyUser, getUserStats);

export default router;
