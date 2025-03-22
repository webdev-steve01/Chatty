const User = require("../models/users.model");
import cloudinary from "../cloudinary.js";

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    return res.status(201).json(user);
  } catch (err) {
    return res.status(409).json({ message: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { name } = req.params;

    // Use a case-insensitive regex to find matches
    const users = await User.find({
      username: { $regex: name, $options: "i" },
    });

    if (!users.length) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" }); // ✅ Stops execution
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err); // ✅ Logs error for debugging
    return res.status(500).json({ message: "Internal Server Error" }); // ✅ Avoid exposing internal errors
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profile_pictures", // Store images in a specific Cloudinary folder
    });

    // Save image URL in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      req.body.userId,
      { profilePicture: result.secure_url },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Image uploaded successfully", user: updatedUser });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({ error: "Image upload failed" });
  }
};
module.exports = {
  createUser,
  getUser,
  getUsers,
  getUserById,
  getUserByEmail,
  uploadProfilePicture,
};
