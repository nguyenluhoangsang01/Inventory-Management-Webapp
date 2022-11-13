import bcrypt from "bcrypt";
import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a name"],
      trim: true,
    }, // Name is required and trim
    email: {
      type: String,
      required: [true, "Please enter a email"],
      unique: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        "Please fill a valid email address",
      ],
    }, // Email is required, unique, trim and match
    password: {
      type: String,
      required: [true, "Please enter a password"],
      trim: true,
      minlength: [6, "Minimum password length is 6 characters"],
    }, // Password is required, trim, minlength and maxLength flowing from client
    photo: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCoS1h0huK1B606Qb4j_hHmwGH8wPmvKLSKQ&usqp=CAU",
    }, // Default photo
    phone: {
      type: String,
      required: [true, "Please enter a phone number"],
      unique: true,
      trim: true,
      match: [/^[0-9]{10}$/, "Please fill a valid phone number"],
    }, // Phone is required, unique, trim and match
    bio: {
      type: String,
      default: "Hey there! I am using Inventory Management Webapp.",
      maxLength: [300, "Maximum text length is 300 characters"],
    }, // Default bio and maxLength flowing from client
  },
  {
    timestamps: true, // Add createdAt and updatedAt
  }
);

// Encrypt password
userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next(); // Skip if password is not modified

  const saltRounds = 10; // Salt rounds
  const salt = bcrypt.genSaltSync(saltRounds); // Generate salt
  this.password = bcrypt.hashSync(this.password, salt); // Hash password
  next(); // Continue
});

const User = model("User", userSchema); // Create model
export default User;
