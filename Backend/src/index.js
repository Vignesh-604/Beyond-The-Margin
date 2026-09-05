import dotenv from "dotenv"
import connectDB from "./db.js"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

dotenv.config()

const app = express()

const allowedOrigins = (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)

app.use(cors({
    origin: (origin, callback) => {
        // Allow non-browser requests (no Origin header)
        if (!origin) return callback(null, true)

        // Allow explicitly configured origins
        if (allowedOrigins.includes(origin)) return callback(null, true)

        // Allow any localhost origin (any port) in development
        if (process.env.NODE_ENV !== "production" && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
            return callback(null, true)
        }

        return callback(new Error("Not allowed by CORS"))
    },
    credentials: true
}))

// To handle data
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())


connectDB()
    .then(() => {
        app.on("error", (error) => console.log("ERROR: ", error))

        const PORT = process.env.PORT || 5000

        app.listen(PORT, () => {
            console.log("Listening on port no.", PORT);
        })
    })
    .catch((e) => console.log("Connection error: ", e))


import userRoutes from './routes/user.route.js'
import articleRoutes from './routes/article.route.js'
import commentRoutes from './routes/comment.route.js'
import interactionRoutes from './routes/interaction.route.js'
import followRoutes from './routes/follow.route.js'
import aboutRoutes from './routes/about.route.js'
import categoryRoutes from './routes/category.route.js'

app.use("/api/users", userRoutes)
app.use("/api/articles", articleRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/interactions", interactionRoutes)
app.use("/api/follows", followRoutes)
app.use("/api/about", aboutRoutes)
app.use("/api/category", categoryRoutes)