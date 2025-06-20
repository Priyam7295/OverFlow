import express from "express";
import { loginFunction, logoutFunction, signupFunction, uploadDp } from "../components/auth.controllers.js";
import { uploadSingleDp } from "../middlewares/multer.middlewares.js";

const router = express.Router();


// POST /auth/signup
router.post("/signup", signupFunction);

// POST /auth/login
router.post("/login", loginFunction);

// POST /auth/logout
router.post("/logout", logoutFunction);

router.post("/createdp", uploadSingleDp, uploadDp);

export default router;
