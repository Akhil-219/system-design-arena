import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"
import authRouter from "../src/routes/auth.routes.js"
import problemsRouter from "../src/routes/problem.routes.js"
import designRouter from "../src/routes/design.routes.js"
import communityDesignRouter from "../src/routes/communityDesign.routes.js"
import userRouter from "../src/routes/user.routes.js"
const app =express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))

app.use(cookieParser())

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/problems", problemsRouter)
app.use("/api/v1/designs", designRouter)
app.use("/api/v1/community",communityDesignRouter)
app.use("/api/v1/users", userRouter)
export {app}