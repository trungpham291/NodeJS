const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });
server.on('connection', socket => { 
    console.log('🔗Client mới đã kêt nôi'); 
        socket.send('Chào mừng đê ́n với WebSocket Server!');
        socket.on('message', message => { 
            console.log(`📩Tin nhă ́n nhận được: ${message}`); 
            server.clients.forEach(client => { 
                if (client.readyState === WebSocket.OPEN) { 
                     client.send(`Người dùng: ${message}`); 
                } 
        });
    });
});
console.log('📡WebSocket chạy tại ws://localhost:8080');         
     