import express from "express"
import { logoutUser, userLogin, userSignup } from "../controlers/userControler.js"
import { protect } from "../middleware/authMiddleware.js"
const userRouter = express.Router()


userRouter.post("/signup", userSignup)
userRouter.post("/login", userLogin)
userRouter.post("/logout", logoutUser)
userRouter.get("/me", protect, (req, res) => {
    res.status(200).json(req.user);
});



export default userRouter