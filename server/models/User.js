import bcrypt from "bcrypt";
import { model, Schema } from "mongoose";

// Validator with:
// name is required
// email is required and must be unique
// password is required, must be at least 6 characters and must be at most 20 characters
// photo default is "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCoS1h0huK1B606Qb4j_hHmwGH8wPmvKLSKQ&usqp=CAU"
// phone is required and must be unique
// bio default is "Hey there! I am using Inventory Management Webapp." and max length is 300 characters

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please enter a email"],
      unique: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      trim: true,
      minlength: [6, "Minimum password length is 6 characters"],
    },
    photo: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCoS1h0huK1B606Qb4j_hHmwGH8wPmvKLSKQ&usqp=CAU",
    },
    phone: {
      type: String,
      required: [true, "Please enter a phone number"],
      unique: true,
      trim: true,
      match: [/^[0-9]{10}$/, "Please fill a valid phone number"],
    },
    bio: {
      type: String,
      default: "Hey there! I am using Inventory Management Webapp.",
      maxLength: [300, "Maximum text length is 300 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password
userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  this.password = bcrypt.hashSync(this.password, salt);
  next();
});

const User = model("User", userSchema);
export default User;
