import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "src/.env" });
const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}`);
        console.log("MongoDb Connected!");
    } catch (error) {
        console.log("MongoDB Connection Error", error);
    }
}

export default connectDB;