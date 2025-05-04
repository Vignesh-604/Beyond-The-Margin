import express from "express";
import {addComment, editComment, deleteComment, getComments} from "../controllers/comment.controller.js"
import verifyUser from "../middlewares/auth.js";

const router = express.Router();

router.post("/", verifyUser, addComment);
router.patch("/", verifyUser, editComment);
router.delete("/:commentId", verifyUser, deleteComment);
router.get("/:articleId/:userId", getComments);

export default router;