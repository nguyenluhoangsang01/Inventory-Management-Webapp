import express from "express";
import {
	getAllUsers,
	getUserProfile,
	loginUser,
	logoutUser,
	registerUser
} from "../controllers/users.js";
import { verifyToken } from "../middleWares/auth.js";

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
router.get("/logout", verifyToken, logoutUser);

// @route GET api/users
// @desc Get all users
// @access Private
router.get("/", verifyToken, getAllUsers);

// @route GET api/users/profile
// @desc Get user profile
// @access Private
router.get("/profile", verifyToken, getUserProfile);

export default router;
