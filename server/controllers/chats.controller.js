const Chat = require("../models/chats.model");

const getChats = async (req, res) => {
  try {
    const { userId } = req.params;
    const chats = await Chat.find({ members: { $in: [userId] } });
    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getChatById = async (req, res) => {
  try {
    const { Id } = req.params;
    const chats = await Chat.find(Id);
    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateChatsLastMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { lastMessage } = req.body;

    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { lastMessage, updatedAt: Date.now() }, // Ensure updatedAt is also updated
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createChats = async (req, res) => {
  try {
    const { userOne, userTwo } = req.body;

    // Check if a chat between these two users already exists
    const existingChat = await Chat.findOne({
      members: { $all: [userOne, userTwo] }, // Ensure both users are in the chat
    });

    if (existingChat) {
      return res.status(400).json({ message: "Chat already exists" });
    }

    // Create a new chat since no existing one was found
    const newChat = await Chat.create({
      members: [userOne, userTwo],
    });

    res.status(200).json(newChat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    const deletedChat = await Chat.findByIdAndDelete(chatId);

    if (!deletedChat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getChats,
  createChats,
  deleteChat,
  getChatById,
  updateChatsLastMessage,
};
