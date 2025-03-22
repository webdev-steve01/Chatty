const express = require("express");
const router = express.Router();
const {
  getMessages,
  deleteMessage,
  sendMessage,
  getMessageById,
} = require("../controllers/messages.controller");

router.get("/:chatId", getMessages);
router.get("/id/:id", getMessageById);
router.post("/", sendMessage);
router.delete("/:id", deleteMessage);

module.exports = router;
