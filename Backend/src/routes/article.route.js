import {
    publishArticle,
    deleteArticle,
    getArticleById,
    getArticlesByUser,
    getPendingArticles,
    getRandomArticles,
    searchArticles
} from "../controllers/article.controller.js"
import express from "express";
import verifyUser from "../middlewares/auth.js";

const router = express.Router();

router.post("/", verifyUser, publishArticle);
router.delete("/:articleId", verifyUser, deleteArticle);
router.get("/single/:articleId", getArticleById);
router.get("/user/:userId", getArticlesByUser);
router.get("/pending", getPendingArticles);
router.get("/random", getRandomArticles);
router.get("/search", searchArticles);

export default router;