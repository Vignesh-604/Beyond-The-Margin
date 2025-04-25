import { Router } from "express"
import {
    toggleFollow,
    getUserFollowers,
    getUserFollowing
} from "../controllers/follow.controller.js"
import verifyUser from "../middlewares/auth.js";

const router = Router()

router.post("/toggle/:followingId", verifyUser, toggleFollow)

router.get("/", getUserFollowers)     // Return followers list of a user

router.get("/follow/:userId", verifyUser, getUserFollowing) // Get users that the current user is following

export default router
