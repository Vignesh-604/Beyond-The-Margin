import axios from "axios";
import jwt from "jsonwebtoken";
import { oauth2Client } from "../utils/googleClient.js";
import User from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import { nanoid } from "nanoid";
import CryptoJS from "crypto-js";

const googleAuth = async (req, res) => {
    const { code, mode } = req.query;

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    }

    const signedTokens = (_id, email) => {
        const token = jwt.sign(
            { _id, email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_TIMEOUT || "1d" }
        );
        return token
    }

    try {
        // Get tokens from Google
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // Get user info from Google
        const googleUser = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
        );

        const { email, name, given_name, picture } = googleUser.data;

        // Check if user exists
        let user = await User.findOne({ email });

        if (mode === "login") {
            if (!user) {
                return res.status(404).json(new ApiResponse(404, null, "User not found"))
            }
            const userData = CryptoJS.AES.encrypt(JSON.stringify(user), process.env.VITE_KEY).toString()

            return res
                .status(200)
                .cookie("token", signedTokens(user._id, user.email), options)
                .cookie("user", userData)
                .json(new ApiResponse(200, userData, "Login successful"))
        }

        if (user) {
            return res.status(400).json(new ApiResponse(400, null, "User already exists"))
        }

        // remove spaces, non-alphanumeric characters, and lowercase it
        const baseUsername = given_name
            .toLowerCase()
            .replace(/\s+/g, '')                // Remove spaces
            .replace(/[^a-z0-9]/g, '');         // Remove special chars

        user = await User.create({
            username: `${baseUsername}_${nanoid(5)}`,
            email,
            fullname: name,
            avatar: picture,
        });

        const userData = CryptoJS.AES.encrypt(JSON.stringify(user), process.env.VITE_KEY).toString()

        return res
            .cookie("token", signedTokens(user._id, user.email), options)
            .cookie("user", userData)
            .status(200)
            .json(new ApiResponse(201, user, "Signup successful"))

    } catch (err) {
        return res.status(500).json(new ApiResponse(500, err, "Google login failed"));
    }
};


const logout = (req, res) => {
    console.log("Working")
    return res.status(200).clearCookie("token").json(new ApiResponse(200, "", "Logged out successfully"))
};

const updateProfile = async (req, res) => {
    const { fullname, bio } = req.body


}

export {
    googleAuth,
    logout
}