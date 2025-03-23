const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const UserRoutes = require("./routes/users.route");
const User = require("./models/users.model"); // Make sure the path is correct
const MessagesRoutes = require("./routes/messages.route");
const ChatRoutes = require("./routes/chats.route");
require("dotenv").config();

// Middlewares
app.use(cors());
app.use(express.json());

// Setting up server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// MongoDB connection string
const connection_string = `mongodb+srv://osesojehssp:${process.env.MONGODB_PASSWORD}@chatty.9g02m.mongodb.net/?retryWrites=true&w=majority&appName=Chatty`;

const activeUsers = new Map();

// WebSocket functions
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Listen for user login
  socket.on("user-online", async (userId) => {
    activeUsers.set(userId, socket.id);

    try {
      await User.findByIdAndUpdate(userId, { isOnline: true });
    } catch (error) {
      console.error("Error updating user online status:", error);
    }

    io.emit("active-users", Array.from(activeUsers.keys()));
    console.log("Active Users:", Array.from(activeUsers.keys()));
  });

  // User joins a chat room
  socket.on("join_room", (data) => {
    socket.join(data.roomId);
    console.log(
      `${data.name} with id: ${socket.id} joined room: ${data.roomId}`
    );
  });

  // Handle incoming messages
  socket.on("text", (data) => {
    console.log("Received message:", data);
    io.to(data.room).emit("receive-text", data);
  });

  // Handle user disconnect
  socket.on("disconnect", async () => {
    console.log("User disconnected:", socket.id);

    // Find the userId associated with this socket
    let disconnectedUserId = null;
    for (let [userId, socketId] of activeUsers.entries()) {
      if (socketId === socket.id) {
        disconnectedUserId = userId;
        activeUsers.delete(userId);
        break;
      }
    }

    if (disconnectedUserId) {
      try {
        await User.findByIdAndUpdate(disconnectedUserId, { isOnline: false });
      } catch (error) {
        console.error("Error updating user offline status:", error);
      }

      // Emit updated active users list
      io.emit("active-users", Array.from(activeUsers.keys()));
    }
  });
});

// Using routes
app.use("/api/users", UserRoutes);
app.use("/api/messages", MessagesRoutes);
app.use("/api/chats", ChatRoutes);

// Start server and connect to database
mongoose
  .connect(connection_string)
  .then(() => {
    server.listen(8080, () => {
      console.log("Server is running on port 8080");
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed:", err.message);
  });
