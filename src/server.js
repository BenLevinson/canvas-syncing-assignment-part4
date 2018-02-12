const http = require('http');
const socketio = require('socket.io');
const fs = require('fs');

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

const handler = (req, res) => {
  fs.readFile(`${__dirname}/../client/index.html`, (err, data) => {
    if (err) {
      throw err;
    }
    res.writeHead(200);
    res.end(data);
  });
};

const app = http.createServer(handler);

const io = socketio(app);


app.listen(PORT);

const onJoined = (sock) => {
    const socket = sock;
    
    socket.on('join', () => {
        socket.join('room1');
    });
};

const onDraw = (sock) => {
    const socket = sock;
    
    socket.on('draw', (data) => {
       io.sockets.in('room1').emit('drawCanvas', data);
    });
};

const onDisconnect = (sock) => {
    const socket = sock;
    socket.leave('room1');
};

io.sockets.on('connection', (socket) => {
    onJoined(socket);
    onDraw(socket);
    onDisconnect(socket);
});