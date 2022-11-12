import express from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/users.js";

const router = express.Router();

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", registerUser);

// @route POST api/users/login
// @desc Login user
// @access Public
router.post("/login", loginUser);

// @route GET api/users/logout
// @desc Logout user
// @access Private
router.get("/logout", logoutUser);

export default router;
