import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import validator from "validator";
import Token from "../models/Token.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import sendError from "../utils/sendError.js";
import sendSuccess from "../utils/sendSuccess.js";

// @route POST api/users/register
// @desc Register user
// @access Public
export const registerUser = async (req, res, next) => {
  const { name, email, password, repeatPassword, phone } = req.body; // Get data from request body

  // Validation
  if (!name) return sendError(res, "Name is required"); // Name is required
  if (!email) return sendError(res, "Email is required"); // Email is required
  if (!validator.isEmail(email)) return sendError(res, "Email is invalid"); // Email is invalid
  if (!password) return sendError(res, "Password is required"); // Password is required
  if (password.length < 6)
    return sendError(res, "Minimum password length is 6 characters"); // Minimum password length is 6 characters
  if (password.length > 20)
    return sendError(res, "Maximum password length is 20 characters"); // Maximum password length is 20 characters
  if (!repeatPassword) return sendError(res, "Repeat password is required"); // Repeat password is required
  if (password !== repeatPassword)
    return sendError(res, "Passwords do not match"); // Passwords do not match
  if (!phone) return sendError(res, "Phone is required"); // Phone is required
  if (!validator.isMobilePhone(phone, "vi-VN"))
    return sendError(res, "Phone is invalid"); // Phone is invalid

  try {
    // Check if user already exists
    const isExistWithEmail = await User.exists({ email }); // true or false
    if (isExistWithEmail)
      return sendError(res, "Email has already been registered"); // Email has already been registered
    const isExistWithPhone = await User.exists({ phone }); // true or false
    if (isExistWithPhone)
      return sendError(res, "Phone has already been registered"); // Phone has already been registered

    // Create new user
    await User.create({ ...req.body });

    // Send response
    return sendSuccess(res, "User registered successfully!", null, 201); // User registered successfully!
  } catch (err) {
    next(err); // 500 Internal Server Error
  }
};

// @route POST api/users/login
// @desc Login user
// @access Public
export const loginUser = async (req, res, next) => {
  const { email, phone } = req.body; // email or phone

  // Validation
  if (!email && !phone) return sendError(res, "Email or phone is required"); // Email or phone is required
  if (!req.body.password) return sendError(res, "Password is required"); // Password is required

  try {
    // Check if user exists
    const user = await User.findOne({ $or: [{ email }, { phone }] }); // Find user by email or phone
    if (!user) return sendError(res, "User does not exist", 404); // User does not exist

    // Check if password is correct
    const isMatch = bcrypt.compareSync(req.body.password, user.password); // true or false
    if (!isMatch) return sendError(res, "Password is incorrect", 401); // Password is incorrect

    // Generate access token
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Send HTTP-only cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true, // Only server can access the cookie
      secure: process.env.NODE_ENV === "production", // Cookie only works in HTTPS
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Cookie only works in the same site
      expires: new Date(Date.now() + 1000 * 86400), // 1 day
    });

    // Get information of user except _id, password, and __v
    const { _id, password, __v, ...rest } = user._doc; // _doc is a property of mongoose document

    // Send response
    return sendSuccess(res, "User logged in successfully!", {
      accessToken, // Send access token
      user: {
        id: _id, // Change _id to id
        ...rest, // Add other information of user
      },
    }); // User logged in successfully!
  } catch (err) {
    next(err); // 500 Internal Server Error
  }
};

// @route GET api/users/logout
// @desc Logout user
// @access Private
export const logoutUser = async (req, res, next) => {
  // Clear cookie
  res.cookie("accessToken", null, {
    httpOnly: true, // Only server can access the cookie
    secure: process.env.NODE_ENV === "production", // Cookie only works in HTTPS
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Cookie only works in the same site
    expires: new Date(0), // Expire the cookie immediately
  });

  // Send response
  return sendSuccess(res, "User logged out successfully!"); // User logged out successfully!
};

// @route GET api/users
// @desc Get all users
// @access Private
export const getAllUsers = async (req, res, next) => {
  try {
    // Get all users
    const users = await User.find(); // Find all users
    if (!users) return sendError(res, "Users not found", 404); // Users not found

    // Send response
    return sendSuccess(res, "Get all users successfully!", {
      length: users.length, // Number of users
      users: users.map((user) => {
        const { _id, password, __v, ...rest } = user._doc; // _doc is a property of mongoose document

        return { id: _id, ...rest }; // Change _id to id and add other information of user
      }),
    }); // Get all users successfully!
  } catch (err) {
    next(err); // 500 Internal Server Error
  }
};

// @route GET api/users/profile
// @desc Get user profile
// @access Private
export const getUserProfile = async (req, res, next) => {
  const { id } = req.userId; // Get id from request

  try {
    // Get user
    const user = await User.findById(id); // Find user by id
    if (!user) return sendError(res, "User not found", 404); // User not found

    // Get information of user except _id, password, and __v
    const { _id, password, __v, ...rest } = user._doc; // _doc is a property of mongoose document

    // Send response
    return sendSuccess(res, "Get user profile successfully!", {
      user: { id: _id, ...rest }, // Change _id to id and add other information of user
    }); // Get user profile successfully!
  } catch (err) {
    next(err); // 500 Internal Server Error
  }
};

// @route GET api/users/loggedIn
// @desc Get login status
// @access Public
export const loginStatus = async (req, res, next) => {
  const accessToken = req.cookies.accessToken; // Get access token from cookie

  if (!accessToken) {
    return res.json({ isLoggedIn: false }); // User is not logged in
  }

  jwt.verify(accessToken, process.env.JWT_SECRET, function (err, decoded) {
    if (err)
      return sendError(
        res,
        "Access token has expired or is otherwise invalid",
        498
      ); // if accessToken is invalid or expired, return error

    if (decoded) {
      return res.json({ isLoggedIn: true }); // User is logged in
    }
  });
};

// @route PUT api/users/profile
// @desc Update user profile
// @access Private
export const updateUserProfile = async (req, res, next) => {
  const { id } = req.userId; // Get id from request
  const { email, phone } = req.body;

  // Validation
  if (!email) return sendError(res, "Email is required"); // Email is required
  if (!validator.isEmail(email)) return sendError(res, "Email is invalid"); // Email is invalid
  if (!phone) return sendError(res, "Phone is required"); // Phone is required
  if (!validator.isMobilePhone(phone, "vi-VN"))
    return sendError(res, "Phone is invalid"); // Phone is invalid

  try {
    // Check if email or phone is already in use
    const userExists = await User.findOne({
      $or: [{ email }, { phone }],
      _id: { $ne: id },
    }); // Find user by email or phone and exclude the user itself
    if (userExists)
      return sendError(res, "Email or phone is already in use", 400); // Email or phone is already in use

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    ); // Find user by id and update user

    // Get information of user except _id, password, and __v
    const { _id, password, __v, ...rest } = updatedUser._doc; // _doc is a property of mongoose document

    // Send response
    return sendSuccess(res, "Update user profile successfully!", {
      user: { id: _id, ...rest }, // Change _id to id and add other information of user
    }); // Update user profile successfully!
  } catch (err) {
    next(err); // 500 Internal Server Error
  }
};

// @route PUT api/users/changePassword
// @desc Change password
// @access Private
export const updatePassword = async (req, res, next) => {
  const { email, phone, oldPassword, newPassword, repeatNewPassword } =
    req.body; // Get email, phone, and password from request

  // Validation
  if (!email && !phone) return sendError(res, "Email or phone is required"); // Email or phone is required
  if (!oldPassword) return sendError(res, "Old password is required"); // Old password is required
  if (!newPassword) return sendError(res, "New password is required"); // New password is required
  if (newPassword.length < 6)
    return sendError(res, "Minimum password length is 6 characters"); // Minimum password length is 6 characters
  if (newPassword.length > 20)
    return sendError(res, "Maximum password length is 20 characters"); // Maximum password length is 20 characters
  if (!repeatNewPassword)
    return sendError(res, "Repeat new password is required"); // Repeat new password is required
  if (newPassword !== repeatNewPassword)
    return sendError(res, "New password and repeat new password do not match"); // New password and repeat new password do not match

  try {
    // Check if user exists
    const user = await User.findOne({ $or: [{ email }, { phone }] }); // Find user by email or phone
    if (!user) return sendError(res, "User does not exist", 404); // User does not exist

    // Check if old password is correct
    const isMatch = bcrypt.compareSync(oldPassword, user.password); // Compare old password with password in database
    if (!isMatch) return sendError(res, "Old password is incorrect", 400); // Old password is incorrect

    // Generate salt
    const saltRounds = 10; // Salt rounds
    const salt = bcrypt.genSaltSync(saltRounds); // Generate salt

    // Update password
    await User.findByIdAndUpdate(
      user._id, // Find user by id
      {
        $set: { password: bcrypt.hashSync(newPassword, salt) }, // Hash new password and update password
      },
      { new: true } // Return updated user
    ); // Find user by id and update password

    // Send response
    return sendSuccess(res, "Change password successfully!"); // Change password successfully!
  } catch (err) {
    next(err); // 500 Internal Server Error
  }
};

// @route POST api/users/forgotPassword
// @desc Forgot password
// @access Public
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body; // Get email from request

  if (!email) return sendError(res, "Email is required"); // Email is required

  try {
    const user = await User.findOne({ email }); // Find user by email
    if (!user) return sendError(res, "User does not exist", 404); // User does not exist

    const token = await Token.findOne({ userId: user._id }); // Find token by userId
    if (token) await token.deleteOne(); // Delete token if it exists

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex") + user._id; // Generate reset token

    // Hash reset token before saving to database
    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save reset token to database
    await Token.create({
      userId: user._id,
      token: hashedResetToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 1000 * 60 * 10, // 10 minutes
    });

    // Construct reset password link
    const resetPasswordLink =
      process.env.NODE_ENV === "development"
        ? `http://localhost:3000/reset-password/${resetToken}`
        : [
            `https://${process.env.CLIENT_URL}/reset-password/${resetToken}`,
            `http://${process.env.CLIENT_URL}/reset-password/${resetToken}`,
          ]; // If in development mode, use localhost, otherwise use client url

    // Send email
    try {
      await sendEmail({
        subject: "Reset Password Request",
        message: `
					<p>Dear <b>${user.name}</b>,</p>
					<br />
					<p>Please use the url below to reset your password.</p>
					<p>Reset password link: ${resetPasswordLink}</p>
					<p style="color: #F00;">This reset link is valid for only 10 minutes.</p>
					<br />
					<p>If you have any concerns/ questions, please don't hesitate to get back to us.</p>
					<br />
					<p>Thanks and Best regards,</p>
					<p>Nguyen Lu Hoang Sang</p>
					<p>0776689228</p>
					<p>231/72, Duong Dinh Hoi, Tang Nhon Phu B, Thanh pho Thu Duc, Ho Chi Minh</p>
				`,
        sendTo: user.email,
      }); // Send email

      return sendSuccess(
        res,
        `Reset password link has been sent to ${user.email}`
      ); // Reset password link has been sent to your email
    } catch (error) {
      return sendError(res, "Error not sent, please try again", 500); // Error not sent, please try again
    }
  } catch (err) {
    next(err); // 500 Internal Server Error
  }
};

// @route PUT api/users/resetPassword/:token
// @desc Reset password
// @access Public
export const resetPassword = async (req, res, next) => {
  const { resetToken } = req.params; // Get reset token from request
  const { newPassword, repeatNewPassword } = req.body; // Get new password and repeat new password from request

  try {
    // Hash reset token before saving to database
    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex"); // Hash reset token

    const token = await Token.findOne({
      token: hashedResetToken, // Find token by hashed reset token
      expiresAt: { $gt: Date.now() }, // Token is not expired
    }); // Find token by token
    if (!token) return sendError(res, "Token is invalid or has expired", 404); // Token is invalid or has expired

    const user = await User.findById(token.userId); // Find user by id
    if (!user) return sendError(res, "User does not exist", 404); // User does not exist

    // Validation
    if (!newPassword) return sendError(res, "New password is required"); // New password is required
    if (newPassword.length < 6)
      return sendError(res, "Minimum password length is 6 characters"); // Minimum password length is 6 characters
    if (newPassword.length > 20)
      return sendError(res, "Maximum password length is 20 characters"); // Maximum password length is 20 characters
    if (!repeatNewPassword)
      return sendError(res, "Repeat new password is required"); // Repeat new password is required
    if (newPassword !== repeatNewPassword)
      return sendError(
        res,
        "New password and repeat new password do not match"
      ); // New password and repeat new password do not match

    // Generate salt
    const saltRounds = 10; // Salt rounds
    const salt = bcrypt.genSaltSync(saltRounds); // Generate salt

    // Update password
    await User.findByIdAndUpdate(
      user._id, // Find user by id
      {
        $set: { password: bcrypt.hashSync(newPassword, salt) }, // Update password
      },
      { new: true } // Return new user
    ); // Find user by id and update password

    // Delete token
    await token.deleteOne(); // Delete token

    // Send response
    return sendSuccess(res, "Reset password successfully!"); // Reset password successfully!
  } catch (err) {
    next(err); // Next error
  }
};
