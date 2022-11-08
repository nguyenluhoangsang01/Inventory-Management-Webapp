import express from "express";
import { registerUser } from "../controllers/users.js";

const router = express.Router();

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", registerUser);

export default router;
