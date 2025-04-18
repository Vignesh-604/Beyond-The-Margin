import mongoose from "mongoose";
import Article from "../models/article.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.model.js";

const publishArticle = async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const userId = req.user._id;

        const article = await Article.create({
            title,
            content,
            category,
            user: userId,
        });

        return res.status(201).json(new ApiResponse(201, article, "Article submitted successfully"));
    } catch (err) {
        return res.status(500).json(new ApiResponse(500, null, "Failed to submit article"));
    }
};

const deleteArticle = async (req, res) => {
    try {
        const { articleId } = req.param
        if (!articleId) {
            return res.status(404).json(new ApiResponse(404, null, "Article ID not found."));
        }

        const deletedArticle = await Article.findByIdAndDelete(articleId).select(" _id ")
        const confirm = deletedArticle ? true : false

        return res.status(200).json(new ApiResponse(200, confirm, "Failed to delete article"));

    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, "Failed to delete article"));
    }
}

const getArticleById = async (req, res) => {
    try {
        const { articleId } = req.params
        if (!articleId) {
            return res.status(404).json(new ApiResponse(404, null, "Article ID not found."));
        }

        const article = await Article.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(articleId) }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                    pipeline: [
                        {
                            $project: {
                                fullname: 1,
                                username: 1,
                                avatar: 1
                            }
                        }
                    ]
                }
            },
            { $unwind: "$user" },
            {
                $project: {
                    title: 1,
                    content: 1,
                    category: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    status: 1,
                    user: 1
                }
            }
        ])

        if (!article) {
            return res.status(404).json(new ApiResponse(404, null, "Article not found."));
        }

        return res.status(500).json(new ApiResponse(500, null, "Failed to fetch article"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, "Failed to fetch article"));
    }
}

const getArticlesByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const articles = await Article.find({ user: userId });
        const userData = await User.findById(userId)

        return res
            .status(200)
            .json(new ApiResponse(200, { userData, articles }, "User's articles fetched"));
    } catch (err) {
        return res
            .status(500)
            .json(new ApiResponse(500, null, "Failed to fetch user's articles"));
    }
};

const getPendingArticles = async (req, res) => {
    try {
        const articles = await Article.aggregate([
            {
                $match: { status: "pending" }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                    pipeline: [
                        {
                            $project: {
                                fullname: 1,
                                username: 1,
                                avatar: 1
                            }
                        }
                    ]
                }
            },
            { $unwind: "$user" },
            {
                $project: {
                    title: 1,
                    content: 1,
                    category: 1,
                    createdAt: 1,
                    status: 1,
                    user: 1
                }
            }
        ])

        return res
            .status(200)
            .json(new ApiResponse(200, articles, "Pending articles fetched"));
    } catch (err) {
        return res
            .status(500)
            .json(new ApiResponse(500, null, "Failed to fetch pending articles"));
    }
};

const searchArticles = async (req, res) => {
    try {
        const { q } = req.query;

        const articles = await Article.find({
            status: "approved",
            $or: [
                { title: new RegExp(q, "i") },
                { category: new RegExp(q, "i") },
            ],
        });

        return res
            .status(200)
            .json(new ApiResponse(200, articles, "Search results fetched"));
    } catch (err) {
        return res
            .status(500)
            .json(new ApiResponse(500, null, "Search failed"));
    }
};


const getRandomArticles = async (req, res) => {
    try {
        const articles = await Article.aggregate([
            { $match: { status: "approved" } },
            { $sample: { size: 10 } },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user",
                    pipeline: [
                        {
                            $project: {
                                fullname: 1,
                                username: 1,
                                avatar: 1,
                            },
                        },
                    ],
                },
            },
            { $unwind: "$user" },
            {
                $project: {
                    title: 1,
                    content: 1,
                    category: 1,
                    createdAt: 1,
                    status: 1,
                    user: 1,
                },
            },
        ]);

        return res
            .status(200)
            .json(new ApiResponse(200, articles, "Random articles fetched"));
    } catch (err) {
        return res
            .status(500)
            .json(new ApiResponse(500, null, "Failed to fetch random articles"));
    }
};

export {
    publishArticle,
    deleteArticle,
    getArticleById,
    getArticlesByUser,
    getPendingArticles,
    getRandomArticles,
    searchArticles
}