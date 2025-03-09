const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const UserRoutes = require("./routes/users.route");
const MessagesRoutes = require("./routes/messages.route");
const ChatRoutes = require("./routes/chats.route");
require("dotenv").config();

// middlewares
app.use(cors());
app.use(express.json());

// setting up
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// connection string for mongodb
const connection_string = `mongodb+srv://osesojehssp:${process.env.MONGODB_PASSWORD}@chatty.9g02m.mongodb.net/?retryWrites=true&w=majority&appName=Chatty`;

// initializing websocket functions
io.on("connection", (socket) => {
  console.log("A user connected just now");

  socket.on("join_room", (data) => {
    socket.join(data.roomId);
    console.log(
      `${data.name} with id: ${socket.id} joined room: ${data.roomId}`
    );
  });

  socket.on("text", (data) => {
    console.log(data);
    io.to(data.room).emit("receive-text", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

// using routes

app.use("/api/users", UserRoutes);
app.use("/api/messages", MessagesRoutes);
app.use("/api/chats", ChatRoutes);

// starting server and connecting to database
mongoose
  .connect(connection_string)
  .then(() => {
    server.listen(8080, () => {
      console.log("Server is running on port 8080");
    });
  })
  .catch((err) => {
    console.log("connection failed", err.message);
  });
