import dotenv from "dotenv"
import connectDB from "./db.js"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

dotenv.config({ path: "./env" })    // loading environment variables from a .env file.

const app = express()

app.use(cors({                              // express uses .use for using middlewares
    origin: process.env.CORS_ORIGIN,        // allow requests from the specified origin
    credentials: true                       // cookies to be included in cross-origin requests.
}))

// To handle data
app.use(express.json({limit: "16kb"}))                          // To accept json data of certain limit
app.use(express.urlencoded({extended: true, limit: "16kb"}))    // Accept data from url
app.use(express.static("public"))                               // To store static files like images,etc param:folder_name
app.use(cookieParser())                                         // To set and edit cookies


// Database connection
connectDB()                                                     // promise is returned
.then(() => {
    app.on("error", (error) => console.log("ERROR: ", error))

    app.listen(process.env.PORT || 8888, () => {
        console.log("Listening on port no.", process.env.PORT);
    })
})
.catch((e) => console.log("Connection error: ", e))


import userRoutes from './routes/user.route.js'
import articleRoutes from './routes/article.route.js'
import commentRoutes from './routes/comment.route.js'
import interactionRoutes from './routes/interaction.route.js'
import followRoutes from './routes/follow.route.js'

app.use("/api/users", userRoutes)
app.use("/api/articles", articleRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/interactions", interactionRoutes)
app.use("/api/follows", followRoutes)