const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of users
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" }, // Reference to last message
  },
  { timestamps: true } // ✅ Automatically updates when a message is sent
);

module.exports = mongoose.model("Chat", ChatSchema);
