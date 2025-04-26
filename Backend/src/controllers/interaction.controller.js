import Interaction from "../models/interaction.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";

/**
 Get article/comment ids and type like/dislike - Check
 Search for existing doc with same userID, articleId and type: not bookmark
 IF found toggle type else create new
 */

const likeDislike = async (req, res) => {
    try {
        const { type, articleId, commentId } = req.body;
        const userId = req.user._id;

        if (!["like", "dislike"].includes(type)) {
            return res.status(400).json(new ApiResponse(400, null, "Invalid interaction type"));
        }
        if (!articleId && !commentId) {
            return res.status(400).json(new ApiResponse(400, null, "Either articleId or commentId is required"));
        }
        if (articleId && commentId) {
            return res.status(400).json(new ApiResponse(400, null, "Interaction can only be on one of article or comment"));
        }

        const filter = {
            user: userId,
            type: { $in: ["like", "dislike"] },
            ...(articleId ? { article: articleId } : { comment: commentId })
        };

        const existing = await Interaction.findOne(filter);

        if (existing) {
            if (existing.type === type) {
                // Toggle off: If same type then remove it (ex. type:like then remove like)
                await Interaction.findByIdAndDelete(existing._id);
                return res.status(200).json(new ApiResponse(200, null, `${type} removed`));
            } else {
                // Switch type: if type:like then dislike
                existing.type = type;
                await existing.save();
                return res.status(200).json(new ApiResponse(200, existing, `${type} updated`));
            }
        } else {
            // Create new interaction
            const newInteraction = await Interaction.create({
                user: userId,
                type,
                ...(articleId ? { article: articleId } : { comment: commentId })
            });
            return res.status(201).json(new ApiResponse(201, newInteraction, `${type} added`));
        }
    } catch (err) {
        return res.status(500).json(new ApiResponse(500, null, "Interaction failed"));
    }
}

const toggleBookmark = async (req, res) => {
    try {
        const { articleId } = req.params;
        const userId = req.user._id;
        if (!articleId || !mongoose.isValidObjectId(articleId)) {
            return res.status(400).json(new ApiResponse(400, null, "ArticleID is required"));
        }

        const bookmark = await Interaction.findOne({
            article: articleId, user: userId, type: "bookmark"
        });

        if (bookmark) {
            await bookmark.deleteOne();
            return res.status(200).json(new ApiResponse(200, null, "Bookmark removed"));
        }

        await Interaction.create({
            article: articleId, user: userId, type: "bookmark"
        });
        return res.status(201).json(new ApiResponse(201, null, "Bookmark created"));

    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, "Interaction failed"));
    }
}

const getBookmarks = async (req, res) => {
    try {
        const userId = req.params;
        if (!userId || !mongoose.isValidObjectId(userId)) {
            return res.status(400).json(new ApiResponse(400, null, "User Id is required"));
        }

        const bookmarks = await Interaction.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(userId), type: "bookmark"
                }
            },
            {
                $lookup: {
                    from: "articles",
                    localField: "article",
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
                                        $project: {
                                            fullname: 1, username: 1, avatar: 1
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $unwind: "$user"
                        },
                        {
                            $project: {
                                title: 1, category: 1, createdAt: 1, user: 1
                            }
                        }
                    ]
                }
            },
            {
                $unwind: "$article"
            }
        ])

        if (!bookmarks || bookmarks.length === 0) {
            return res.status(200).json(new ApiResponse(200, null, "No bookmarks found"));
        }

        return res.status(200).json(new ApiResponse(200, bookmarks, "Bookmarks found"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, "Interaction failed"));
    }
}

export { likeDislike, toggleBookmark, getBookmarks };
