import mongoose from "mongoose";
import Article from "../models/article.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import Interaction from "../models/interaction.model.js";

const publishArticle = async (req, res) => {
    try {
        const { title, subtitle, content, category, subCategory } = req.body;
        const userId = req.user._id;

        const estimateReadTime = (text) => {
            const wordsPerMinute = 200;
            const words = text.trim().split(/\s+/).length;
            return Math.ceil(words / wordsPerMinute);
        };

        const article = await Article.create({
            title, subtitle,
            content,
            category, subCategory,
            readTime: estimateReadTime(content),
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
                    subCategory: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    status: 1,
                    user: 1
                }
            }
        ])

        if (!article || article.length === 0) {
            return res.status(404).json(new ApiResponse(404, null, "Article not found."));
        }

        const [bookmarkCount, likeCount, dislikeCount] = await Promise.all([
            Interaction.countDocuments({ article: articleId, type: "bookmark" }),
            Interaction.countDocuments({ article: articleId, type: "like" }),
            Interaction.countDocuments({ article: articleId, type: "dislike" })
        ]);

        const fullArticle = { ...article[0], bookmarkCount, likeCount, dislikeCount }

        return res.status(200).json(new ApiResponse(200, fullArticle, "Fetched article"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, "Failed to fetch article"));
    }
}

const getArticlesByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const articles = await Article.find({ user: userId });
        const userData = await User.findById(userId)

        return res.status(200).json(new ApiResponse(200, { userData, articles }, "User's articles fetched"));
    } catch (err) {
        return res.status(500).json(new ApiResponse(500, null, "Failed to fetch user's articles"));
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
                    subCategory: 1,
                    createdAt: 1,
                    status: 1,
                    user: 1
                }
            }
        ])

        return res.status(200).json(new ApiResponse(200, articles, "Pending articles fetched"));
    } catch (err) {
        return res.status(500).json(new ApiResponse(500, null, "Failed to fetch pending articles"));
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

        return res.status(200).json(new ApiResponse(200, articles, "Search results fetched"));
    } catch (err) {
        return res.status(500).json(new ApiResponse(500, null, "Search failed"));
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
                    subCategory: 1,
                    createdAt: 1,
                    status: 1,
                    user: 1,
                },
            },
        ]);

        return res.status(200).json(new ApiResponse(200, articles, "Random articles fetched"));
    } catch (err) {
        return res.status(500).json(new ApiResponse(500, null, "Failed to fetch random articles"));
    }
};

const trendingArticles = async (req, res) => {
    const topArticles = await Interaction.aggregate([
        {
            $match: {
                type: { $in: ["like", "bookmark"] }
            }
        },
        {
            $group: {
                _id: "$article",
                interactionCount: { $sum: 1 }
            }
        },
        {
            $sort: { interactionCount: -1 }
        },
        {
            $limit: 4
        },
        {
            $lookup: {
                from: "articles",
                localField: "_id",
                foreignField: "_id",
                as: "article",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "user",
                            foreignField: "_id",
                            as: "user",
                            pipeline: [
                                {
                                    $project: { _id: 1, fullname: 1, avatar: 1 }
                                }
                            ]
                        }
                    },
                    {
                        $project: { updatedAt: 0, content: 0 }
                    }
                ]
            }
        },
        {
            $unwind: "$article"
        },
        {
            $project: { article: 1, _id: 0 }
        },
        { $replaceRoot: { newRoot: "$article" } },
        { $unwind: "$user" },
        // {
        //     $match: {
        //         "article.status": "approved"
        //     }
        // }
    ]);

    return res.status(200).json(new ApiResponse(200, topArticles, "Trending articles fetched"));
}

const filteredArticles = async (req, res) => {
    const cat = req.query.filter;

    const categoryMatch = cat !== "All" ? { category: cat } : {};

    const articles = await Article.aggregate([
        {
            $facet: {
                // Step 1: Fetch up to 6 random articles from the selected category (if any)
                matched: [
                    { $match: categoryMatch },
                    { $sample: { size: 6 } }
                ],
                // Step 2: Fetch up to 6 random fallback articles from other categories (if selected)
                fallback: [
                    { $match: {} },
                    { $sample: { size: 6 } }
                ]
            }
        },
        {
            $project: {
                // Step 3: Combine both arrays — include only as many fallback as needed
                articles: {
                    $concatArrays: [
                        "$matched",     // matched articles
                        {
                            // Filters fallback to avoid articles already in matched
                            $slice: [       // separate articles that match the filters and giving only specified limit
                                {
                                    $filter: {
                                        input: "$fallback",
                                        as: "fb",
                                        cond: { $not: { $in: ["$$fb._id", "$matched._id"] } }   //  not in matched / new articles
                                    }
                                },
                                { $subtract: [6, { $size: "$matched" }] }       // specifying how many needed: 6 - matched
                            ]
                        }
                    ]
                }
            }
        },
        { $unwind: "$articles" },                       // Step 4: Flatten the combined array so each article is a separate document
        { $replaceRoot: { newRoot: "$articles" } },     // Step 5: Replace root with each article object

        // lookup user
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
                pipeline: [
                    { $project: { _id: 1, fullname: 1, avatar: 1 } }
                ]
            }
        },
        { $unwind: "$user" },
        { $project: { content: 0, updatedAt: 0 } }
    ]);

    return res.status(200).json(new ApiResponse(200, articles, "Filtered articles fetched"));
};

export {
    publishArticle,
    deleteArticle,
    getArticleById,
    getArticlesByUser,
    getPendingArticles,
    getRandomArticles,
    searchArticles,
    trendingArticles,
    filteredArticles
}