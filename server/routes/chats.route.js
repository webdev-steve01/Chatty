const express = require("express");
const router = express.Router();
const {
  getChats,
  createChats,
  deleteChat,
  getChatById,
  updateChatsLastMessage,
} = require("../controllers/chats.controller");

router.get("/:userId", getChats);
router.post("/", createChats);
router.delete("/:chatId", deleteChat);
router.delete("/Id/:chatId", getChatById);
router.patch("/:chatId", updateChatsLastMessage);

module.exports = router;

//
