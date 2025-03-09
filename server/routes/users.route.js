const express = require("express");
const router = express.Router();
const {
  createUser,
  getUser,
  getUsers,
  getUserById,
  getUserByEmail,
} = require("../controllers/users.controller");

router.get("/", getUsers);
router.get("/:name", getUser);
router.get("/id/:id", getUserById);
router.post("/", createUser);
router.get("/email/:email", getUserByEmail);

module.exports = router;
