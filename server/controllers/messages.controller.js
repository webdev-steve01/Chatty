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

const getMessageById = async (req, res) => {
  try {
    const { id } = req.params; // Extract message ID from request params

    // Find message by ID
    const message = await Message.findById(id);

    // If no message is found, return 404
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // Return the found message
    res.status(200).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { chatId, sender, text } = req.body;

    // 1️⃣ Save new message
    const newMessage = new Message({ chatId, sender, text });
    await newMessage.save();

    // 2️⃣ Update lastMessage in Chat model
    await Chat.findByIdAndUpdate(chatId, {
      lastMessage: newMessage._id, // ✅ Use newMessage._id
      updatedAt: new Date(), // Ensure `updatedAt` is refreshed
    });

    // 3️⃣ Respond with the new message
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
  getMessageById,
};
