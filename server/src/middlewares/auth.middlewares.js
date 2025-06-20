import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
const verifyToken = async (req, res, next) => {
    try {
        const jwt_token = req?.cookies?.jwt;
        if (!jwt_token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }
        const decoded = jwt.verify(jwt_token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password -dp -replies -posts -createdAt -updatedAt");

        if (!user) {
            return res.status(401).json({ message: "Invalid token user." });
        }
        req.user = user;
        next();
    } catch (err) {
        console.log("Auth middleware error:", err);
        return res.status(401).json({ message: "Invalid or expired token." });
    }
}

export default verifyToken;