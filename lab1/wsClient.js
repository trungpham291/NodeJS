const WebSocket = require('ws');
const socket = new WebSocket('ws://localhost:8080');
socket.on('open', () => { 
    console.log('🔗Đã kê ́t nô ́i với WebSocket Server'); 
    socket.send('Hello từ Node.js Client!'); 
    socket.send('Xin Chao Trung')
}); 
socket.on('message', message => { 
    console.log('📩Tin nhă ́n từ server:', message); 
});    