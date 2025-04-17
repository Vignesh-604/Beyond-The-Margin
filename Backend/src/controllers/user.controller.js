import axios from "axios";
import jwt from "jsonwebtoken";
import { oauth2Client } from "../utils/googleClient.js";
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const googleAuth = async (req, res) => {
    const code = req.query.code;

    try {
        // Get tokens from Google
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // Get user info from Google
        const googleUser = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
        );

        const { email, name, picture } = googleUser.data;

        // Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                username: email.split("@")[0], // or any unique logic
                email,
                fullname: name,
                avatar: picture,
            });
        }

        // Create JWT
        const token = jwt.sign(
            { _id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_TIMEOUT || "1d" }
        );

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        }

        res.status(200)
            .cookie("token", token, options)
            .json(new ApiResponse(200, user, "Login successful"))

    } catch (err) {
        console.error("Google Auth Error:", err.message);
        res.status(500).json(new ApiResponse(500, null, "Google login failed"));
    }
};


const logout = (req, res) => {
    console.log("Working")
    return res.status(200).clearCookie("token").json(new ApiResponse(200, "", "Logged out successfully"))
};


export {
    googleAuth,
    logout
}