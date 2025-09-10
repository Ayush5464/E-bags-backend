import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

const ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI).then(() => {
            console.log("Data base is Connected");
        })
    } catch (error) {
        console.log(error.message);

    }
}

export default ConnectDB;