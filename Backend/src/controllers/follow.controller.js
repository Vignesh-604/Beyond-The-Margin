import ApiResponse from "../utils/ApiResponse.js";
import Follow from "../models/follow.model.js";
import mongoose from "mongoose";

const toggleFollow = async (req, res) => {
    try {
        const { followingId } = req.params;
        if (!followingId || !mongoose.Types.ObjectId) {
            return res.status(400).json(new ApiResponse(400, null, "Following ID is required"));
        }

        let follow = await Follow.findOneAndDelete({ follower: req.user._id, following: followingId });
        
        if (follow === null) {
            follow = await Follow.create({ follower: user, following: followingId });
            return res.status(200).json(new ApiResponse(200, follow, "User followed successfully"));
        } else {
            return res.status(200).json(new ApiResponse(200, null, "User unfollowed successfully"));
        }
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, error.message || "Something went wrong"));
    }
}

// Return followers list of a user
const getUserFollowers = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json(new ApiResponse(400, null, "User ID is required"));
        }

        const followers = await Follow.aggregate([
            {
                $match: {
                    following: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "follower",
                    foreignField: "_id",
                    as: "follower"
                }
            },
            {
                $addFields: {
                    follower: { $first: "$follower" }
                }
            },
            {
                $project: {
                    "follower._id": 1,
                    "follower.fullname": 1,
                    "follower.username": 1,
                    "follower.avatar": 1
                }
            }
        ])

        return res.status(200).json(new ApiResponse(200, followers, "Followers fetched successfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, error.message || "Something went wrong"));
    }
}

// Get users that the current user is following
const getUserFollowing = async (req, res) => {
    try {
        const user = req.user?._id;
        if (!user) {
            return res.status(400).json(new ApiResponse(400, null, "Not the user"));
        }

        const following = await Follow.aggregate([
            {
                $match: {
                    follower: new mongoose.Types.ObjectId(user)
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "following",
                    foreignField: "_id",
                    as: "following",
                    pipeline: [
                        {
                            $lookup: {
                                from: "follows",
                                localField: "_id",
                                foreignField: "following",
                                as: "followers"
                            }
                        },
                        {
                            $addFields: {
                                followers: { $size: "$followers" }
                            }
                        }
                    ]
                }
            },
            {
                $unwind: "$following"
            },
            {
                $project: {
                    following: {
                        _id: 1,
                        fullname: 1,
                        username: 1,
                        avatar: 1,
                        followers: 1
                    }
                }
            }
        ])

        return res.status(200).json(new ApiResponse(200, following, "Following users fetched successfully"));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, null, error.message || "Something went wrong"));
    }
}

export {
    toggleFollow,
    getUserFollowers,
    getUserFollowing
}