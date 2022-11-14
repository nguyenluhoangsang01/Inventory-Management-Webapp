import express from "express";
import {
  forgotPassword,
  getAllUsers,
  getUserProfile,
  loginStatus,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updatePassword,
  updateUserProfile,
} from "../controllers/users.js";
import { verifyToken } from "../middleWares/auth.js";

const router = express.Router(); // Create a router

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

// @route GET api/users/loggedIn
// @desc Get login status
// @access Public
router.get("/loggedIn", loginStatus);

// @route PUT api/users/profile
// @desc Update user profile
// @access Private
router.put("/profile", verifyToken, updateUserProfile);

// @route PUT api/users/changePassword
// @desc Change password
// @access Private
router.put("/changePassword", verifyToken, updatePassword);

// @route POST api/users/forgotPassword
// @desc Forgot password
// @access Public
router.post("/forgotPassword", forgotPassword);

// @route PUT api/users/resetPassword/:resetToken
// @desc Reset password
// @access Public
router.put("/resetPassword/:resetToken", resetPassword);

export default router;
