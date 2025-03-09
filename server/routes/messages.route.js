const express = require("express");
const router = express.Router();
const {
  getMessages,
  deleteMessage,
  sendMessage,
} = require("../controllers/messages.controller");

router.get("/:chatId", getMessages);
router.post("/", sendMessage);
router.delete("/:id", deleteMessage);

module.exports = router;
