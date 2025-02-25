const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// Lưu trữ tin nhắn (có thể dùng database nếu muốn)
let chatHistory = [];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Gửi lịch sử tin nhắn cho người dùng mới
  socket.emit("load-messages", chatHistory);

  // Xử lý khi có người tham gia phòng chat
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected", userId);
  });

  // Xử lý chat
  socket.on("send-message", (data) => {
    const messageData = {
      sender: data.sender,
      message: data.message
    };

    // Lưu tin nhắn vào lịch sử
    chatHistory.push(messageData);

    // Gửi tin nhắn cho tất cả user
    io.emit("receive-message", messageData);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(3001, () => console.log("Server running on port 3001"));
