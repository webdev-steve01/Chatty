const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of users
    lastMessage: { type: String, default: "" }, // Last message preview
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", ChatSchema);
