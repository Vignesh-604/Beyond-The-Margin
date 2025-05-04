import Comment from "../models/comment.model.js";
import Interaction from "../models/interaction.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const addComment = async (req, res) => {
    try {
        const { articleId, content, commentId = null } = req.body
        const userId = req.user._id

        if (!mongoose.Types.ObjectId.isValid(articleId) || !content) {
            return res.status(404).json(new ApiResponse(404, null, "ArticleID or content not found."));
        }

        const newComment = await Comment.create({
            content,
            article: articleId,
            user: userId,
            comment: commentId
        })
        if (!newComment) {
            return res.status(500).json(new ApiResponse(500, null, "Comment creation failed."));
        }

        return res.status(201).json(new ApiResponse(201, newComment, "Comment created!"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, "Server error."));
    }
}

const editComment = async (req, res) => {
    try {
        const { commentId, content } = req.body

        if (!mongoose.Types.ObjectId.isValid(commentId) || !content) {
            return res.status(404).json(new ApiResponse(404, null, "commentId or content not found."));
        }

        const comment = await Comment.findByIdAndUpdate(
            commentId,
            { content },
            { new: true }
        )
        if (!comment) {
            return res.status(500).json(new ApiResponse(500, null, "Comment updation failed."));
        }

        return res.status(200).json(new ApiResponse(200, comment, "Comment updated!"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, "Server error."));
    }
}

const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json(new ApiResponse(400, null, "Invalid comment ID."));
        }

        // Delete the main comment
        await Comment.findByIdAndDelete(commentId);

        // Delete all replies to this comment
        await Comment.deleteMany({ comment: commentId });

        return res.status(200).json(new ApiResponse(200, null, "Comment and its replies deleted."));
    } catch (err) {
        return res.status(500).json(new ApiResponse(500, null, "Failed to delete comment."));
    }
};


const getComments = async (req, res) => {
    const { articleId, userId } = req.params;
    const loggedIn = mongoose.isValidObjectId(userId)

    if (!mongoose.Types.ObjectId.isValid(articleId)) {
        return res.status(400).json(new ApiResponse(400, null, "Invalid article ID."));
    }

    const comments = await Comment.find({ article: articleId })
        .sort({ createdAt: 1 })
        .populate("user", "fullname username avatar");

    let modifiedComments = []

    if (loggedIn) {
        const commentIds = comments.map(comment => comment._id)

        const likeDislikes = await Interaction.find({ comment: { $in: commentIds }, user: userId }).select(" comment type ")

        const commentToType = {}
        likeDislikes.forEach(doc => {
            commentToType[doc.comment._id.toString()] = doc.type       // Object with commentId as key and type as object
        })

        modifiedComments = comments.map(com => {
            const type = commentToType[com._id.toString()]      // checking for commentId to get it's type

            return { ...com.toObject(), isLiked: type == "like", isDisliked: type == "dislike" }
        })
    } else {
        modifiedComments = comments
    }

    const commentMap = new Map();           // Used easier lookups than array
    const parentComments = [];

    for (let doc of modifiedComments) {
        const commentObj = loggedIn ? doc : doc.toObject();          // converting mongoose doc to normal obj

        if (!commentObj.comment) {                  // if comment doesn't have comment = parent
            commentObj.replies = [];
            commentMap.set(commentObj._id.toString(), commentObj);
            parentComments.push(commentObj);                                   // Parent comment - push to parentArray and have a replies array
        } else {
            const parent = commentMap.get(commentObj.comment.toString());      // Child comment – find its parent and push directly
            if (parent) {
                parent.replies.push(commentObj);
            } else {
                // If parent not found (edge case), treat as top-level with reference
                parentComments.push(commentObj);
            }
        }
    }

    return res.status(200).json(new ApiResponse(200, parentComments, "Comments fetched."));
};


export {
    addComment, editComment, deleteComment, getComments
}