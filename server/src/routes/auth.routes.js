import express from "express";
import { loginFunction, logoutFunction, signupFunction } from "../components/auth.controllers.js";

const router = express.Router();


// POST /auth/signup
router.post("/signup", signupFunction);

// POST /auth/login
router.post("/login", loginFunction);

// POST /auth/logout
router.post("/logout", logoutFunction);

export default router;
