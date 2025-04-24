import { likeDislike, toggleBookmark, getBookmarks } from "../controllers/interaction.controller.js";
import express from "express";
import verifyUser from "../middlewares/auth.js";

const router = express.Router();

router.post("/like", verifyUser, likeDislike);
router.get("/bookmark/:articleId", verifyUser, toggleBookmark);
router.get("/bookmarks", verifyUser, getBookmarks);

export default router;