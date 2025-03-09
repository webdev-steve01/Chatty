const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Store hashed password
    profilePic: { type: String, default: "" }, // Profile picture URL
    isOnline: { type: Boolean, default: false }, // Online status
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
