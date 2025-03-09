const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chatId: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  time: { type: Date, default: Date.now, required: true }, // Default to current time
});

module.exports = mongoose.model("Message", messageSchema);
