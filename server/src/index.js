import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { User } from "./models/user.models.js";
import authRoutes from "./routes/auth.routes.js";
import authProfiles from "./routes/auth.profiles.js"
import cookieParser from "cookie-parser";
import verifyToken from "./middlewares/auth.middlewares.js";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARES
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // allow frontend
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Error connecting to DB or starting server:", error);
        process.exit(1);
    }
};

startServer();

app.get("/", (req, res) => {
    res.send("Hello from backend!");
});


app.use("/api/auth", authRoutes);
app.use("/api/profile", verifyToken, authProfiles);

