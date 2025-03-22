const express = require("express");
const router = express.Router();
const {
  createUser,
  getUser,
  getUsers,
  getUserById,
  getUserByEmail,
  uploadProfilePicture,
} = require("../controllers/users.controller");

// Corrected Order
router.get("/", getUsers);
router.get("/id/:id", getUserById); // More specific path first
router.get("/email/:email", getUserByEmail); // More specific path first
router.get("/:name", getUser); // Less specific path last
router.post("/", createUser);
router.post("/upload", uploadProfilePicture);

module.exports = router;
