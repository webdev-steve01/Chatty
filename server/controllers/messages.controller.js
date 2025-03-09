const Message = require("../models/messages.model");
const Chat = require("../models/chats.model"); // Import Chat model
const getMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const message = await Message.find({ chatId: chatId });
    if (!message) {
      res.status(404).json({ message: "message data unavailable" });
    }
    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// const Message = require("../models/Message"); // Import Message model

const sendMessage = async (req, res) => {
  try {
    const { chatId, sender, text } = req.body;

    // Save new message
    const newMessage = new Message({ chatId, sender, text });
    await newMessage.save();

    // Update lastMessage in Chat model
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: text,
      updatedAt: new Date(), // Manually update timestamp
    });

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findByIdAndDelete(id);
    if (!message) {
      res.status(404).json({ message: "message data unavailable" });
    }
    res.status(200).json({ message: "message deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getMessages,
  deleteMessage,
  sendMessage,
};
