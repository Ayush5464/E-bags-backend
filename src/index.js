import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
import ConnectDB from "./config/db.js"
import userRouter from "./routes/userRoutes.js"
import productRoute from "./routes/productRouter.js"
import orderRouter from "./routes/orderRouter.js"
import cookieParser from "cookie-parser"
import cartRouter from "./routes/cartRouter.js"
import adminRouter from "./routes/adminRouter.js"
// import { createAdmin } from "./Admin/createAdmin.js"

const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(cors(
    {
        origin: 'http://localhost:5173',
        credentials: true,
    }
))

app.use("/uploads", express.static("uploads"));

app.use("/ebagmart/auth", userRouter)
app.use("/ebagmart/products", productRoute)
app.use("/ebagmart/orders", orderRouter)
app.use("/ebagmart/cart", cartRouter)
app.use("/ebagmart/admin", adminRouter)

// createAdmin();
ConnectDB().then(() => {

    try {
        app.listen(process.env.PORT || 3000, () => {
            console.log("server is Running");

        })

    } catch (error) {
        console.log(error);


    }

})
