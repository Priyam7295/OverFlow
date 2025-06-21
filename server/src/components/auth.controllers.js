import { User } from "../models/user.models.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/createjwttoken.js";
import cloudinary from "../utils/cloudinary.js";

import fs from 'fs';



const signupFunction = async (req, res) => {
    try {
        const { username, email, fullname, password } = req.body;
        if (!username || !email || !fullname || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // Password length validation
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        // 1. checking user exists or not
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ message: "Email or username already taken" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            fullname,
            password: hashedPassword
        })
        const token = generateToken(newUser._id);


        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "Signup successful",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (error) {
        console.log("Signup Error: ", error);
        res.status(500).json({ message: "Internal Server Error While Signup!" });


    }
}


const loginFunction = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = generateToken(user._id);

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1 * 24 * 60 * 60 * 1000,
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        })

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.log("Error while login:", error);
        return res.status(500).json({
            message: "Interval Server Error while Login"
        })
    }
}
const logoutFunction = async (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        });

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Logout Error:", error);
        res.status(500).json({ message: "Internal Server Error while Logout" });
    }
};



const uploadDp = async (req, res) => {
    try {
        console.log(req.file);

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image uploaded',
            });
        }

        const localFilePath = req.file.path;


        const result = await cloudinary.uploader.upload(localFilePath, {
            folder: 'profile_dps',
        });


        fs.unlink(localFilePath, (err) => {
            if (err) {
                console.error('Error deleting local file:', err);
            } else {
                console.log('Local file deleted:', localFilePath);
            }
        });


        return res.status(200).json({
            success: true,
            message: 'DP uploaded to Cloudinary successfully',
            cloudinaryUrl: result.secure_url,
            publicId: result.public_id,
        });
    } catch (err) {
        console.error('Cloudinary Upload Error:', err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

export { loginFunction, logoutFunction, signupFunction, uploadDp };