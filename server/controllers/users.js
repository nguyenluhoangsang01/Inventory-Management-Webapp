import validator from "validator";
import User from "../models/User.js";
import sendError from "../utils/sendError.js";
import sendSuccess from "../utils/sendSuccess.js";

export const registerUser = async (req, res, next) => {
  const { name, email, password, repeatPassword, phone } = req.body;

  // Validation
  if (!name) return sendError(res, "Name is required");
  if (!email) return sendError(res, "Email is required");
  if (!validator.isEmail(email)) return sendError(res, "Email is invalid");
  if (!password) return sendError(res, "Password is required");
  if (password.length < 6)
    return sendError(res, "Minimum password length is 6 characters");
  if (password.length > 20)
    return sendError(res, "Maximum password length is 20 characters");
  if (!repeatPassword) return sendError(res, "Repeat password is required");
  if (password !== repeatPassword)
    return sendError(res, "Passwords do not match");
  if (!phone) return sendError(res, "Phone is required");
  if (!validator.isMobilePhone(phone, "vi-VN"))
    return sendError(res, "Phone is invalid");

  try {
    // Check if user already exists
    const isExistWithEmail = await User.exists({ email });
    if (isExistWithEmail)
      return sendError(res, "Email has already been registered");
    const isExistWithPhone = await User.exists({ phone });
    if (isExistWithPhone)
      return sendError(res, "Phone has already been registered");

    // Create new user
    const user = await User.create({ ...req.body });

    // Send response
    return sendSuccess(res, "User registered successfully", { user }, 201);
  } catch (err) {
    next(err);
  }
};
