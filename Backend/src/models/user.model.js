import { Schema, model } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String,
        required: true
    },
    about: {
        type: String,
        trim: true,
        default: ""
    },
    userType: {
        type: String,
        enum: ["user", "editor", "admin"],
        default: "user"
    },
    userStatus: {
        type: String,
        enum: ["active", "suspended"],
        default: "active"
    },
}, {
    timestamps: true
});


const User = model("User", userSchema)
export default User
