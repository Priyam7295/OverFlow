import express from "express"
import { showProfile } from "../components/profile.controllers.js";

const router = express.Router();

router.get("/", showProfile);

export default router;