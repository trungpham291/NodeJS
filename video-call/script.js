const socket = io("http://localhost:3001");
const peer = new Peer(undefined, {
    host: "/",
    port: "3001"
});

const videoGrid = document.getElementById("video-grid");
const chatInput = document.getElementById("chat-input");
const sendChatBtn = document.getElementById("send-chat");
const chatMessages = document.getElementById("chat-messages");

const myVideo = document.createElement("video");
myVideo.muted = true;

// Lấy username ngẫu nhiên
const userName = "User-" + Math.floor(Math.random() * 1000);

// Lấy quyền truy cập camera/micro
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then((stream) => {
    myVideo.srcObject = stream;
    myVideo.play();
    videoGrid.append(myVideo);

    peer.on("open", (id) => {
        socket.emit("join-room", "room1", id);
    });

    peer.on("call", (call) => {
        call.answer(stream);
        const userVideo = document.createElement("video");
        call.on("stream", (userStream) => {
            userVideo.srcObject = userStream;
            userVideo.play();
            videoGrid.append(userVideo);
        });
    });

    socket.on("user-connected", (userId) => {
        console.log("User connected:", userId);
        const call = peer.call(userId, stream);
        const userVideo = document.createElement("video");
        call.on("stream", (userStream) => {
            userVideo.srcObject = userStream;
            userVideo.play();
            videoGrid.append(userVideo);
        });
    });
}).catch((error) => {
    console.error("Không thể truy cập camera/micro:", error);
    alert("Vui lòng kiểm tra quyền truy cập camera và thử lại!");
});

// Gửi tin nhắn khi nhấn nút gửi
sendChatBtn.addEventListener("click", () => {
    const message = chatInput.value;
    if (message.trim() !== "") {
        const messageData = { sender: userName, message: message };
        socket.emit("send-message", messageData);
        chatInput.value = "";
    }
});

// Hiển thị tin nhắn khi nhận từ server
socket.on("receive-message", (data) => {
    const messageElement = document.createElement("p");
    messageElement.innerHTML = `<strong>${data.sender}:</strong> ${data.message}`;
    messageElement.style.backgroundColor = data.sender === userName ? "#0d6efd" : "#333";
    messageElement.style.color = "white";
    messageElement.style.padding = "8px";
    messageElement.style.borderRadius = "10px";
    messageElement.style.margin = "5px 0";
    messageElement.style.width = "fit-content";
    chatMessages.appendChild(messageElement);

    // Cuộn xuống tin nhắn mới nhất
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Nhận lịch sử tin nhắn khi vào phòng
socket.on("load-messages", (messages) => {
    messages.forEach((data) => {
        const messageElement = document.createElement("p");
        messageElement.innerHTML = `<strong>${data.sender}:</strong> ${data.message}`;
        messageElement.style.backgroundColor = data.sender === userName ? "#0d6efd" : "#333";
        messageElement.style.color = "white";
        messageElement.style.padding = "8px";
        messageElement.style.borderRadius = "10px";
        messageElement.style.margin = "5px 0";
        messageElement.style.width = "fit-content";
        chatMessages.appendChild(messageElement);
    });

    // Cuộn xuống tin nhắn mới nhất
    chatMessages.scrollTop = chatMessages.scrollHeight;
});
