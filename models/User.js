// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
