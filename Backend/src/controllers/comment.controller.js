import Comment from "../models/comment.model.js";
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
    try {
        const { articleId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(articleId)) {
            return res.status(400).json(new ApiResponse(400, null, "Invalid article ID."));
        }

        const comments = await Comment.find({ article: articleId })
            .sort({ createdAt: 1 })
            .populate("user", "fullname username avatar");

        const commentMap = new Map();           // Used easier lookups than array
        const parentComments = [];


        for (let doc of comments) {
            const commentObj = doc.toObject();          // converting mongoose doc to normal obj
            
            if (!commentObj.comment) {
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
    } catch (err) {
        return res.status(500).json(new ApiResponse(500, null, "Failed to fetch comments."));
    }
};


export {
    addComment, editComment, deleteComment, getComments
}