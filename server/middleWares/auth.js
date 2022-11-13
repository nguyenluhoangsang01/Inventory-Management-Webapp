import jwt from "jsonwebtoken";
import sendError from "../utils/sendError.js";

export const verifyToken = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken; // get accessToken from cookie
    if (!accessToken)
      return sendError(res, "You are not authenticated, please login", 401); // if no accessToken, return error

    jwt.verify(accessToken, process.env.JWT_SECRET, function (err, decoded) {
      if (err)
        return sendError(
          res,
          "Access token has expired or is otherwise invalid",
          498
        ); // if accessToken is invalid or expired, return error

      req.userId = decoded; // if accessToken is valid, save userId to req.userId
      next();
    });
  } catch (err) {
    next(err); // 500 Internal Server Error
  }
};
