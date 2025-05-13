import {
    publishArticle,
    deleteArticle,
    getArticleById,
    getPendingArticles,
    searchArticles,
    trendingArticles,
    filteredArticles,
    userArticles,
    bookmarkedArticles,
} from "../controllers/article.controller.js"
import express from "express";
import verifyUser from "../middlewares/auth.js";

const router = express.Router();

router.post("/", verifyUser, publishArticle);
router.delete("/:articleId", verifyUser, deleteArticle);
router.get("/single/:articleId/:userId", getArticleById);
router.get("/pending", getPendingArticles);
router.get("/trending", trendingArticles);
router.get("/filtered", filteredArticles);
router.get("/user/:userId", userArticles);
router.get("/bookmark/:userId", bookmarkedArticles);
router.get("/search", searchArticles);

export default router;