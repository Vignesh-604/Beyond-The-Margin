import { Router } from "express"
import {
    toggleFollow,
    getUserFollowers,
    getUserFollowing
} from "../controllers/follow.controller.js"
import verifyUser from "../middlewares/auth.js";

const router = Router()

router.post("/:followingId", verifyUser, toggleFollow)

router.get("/:userId", getUserFollowers)     // Return followers list of a user

router.get("/follow/:userId", getUserFollowing) // Get users that the current user is following

export default router
