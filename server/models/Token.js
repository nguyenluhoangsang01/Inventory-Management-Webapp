import { model, Schema } from "mongoose";

const tokenSchema = new Schema({
  token: {
    type: String,
    required: true,
  }, // Token is required
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  }, // User id is required and reference to User model
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400, // Token expires in 24 hours
  },
}); // Create schema

const Token = model("Token", tokenSchema); // Create model
export default Token;
