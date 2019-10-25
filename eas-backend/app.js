const express = require('express');
const cookieParser = require('cookie-parser');
const usersRouter = require('./routes/message');

const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io').listen(server);
io.set("origins", "*:*");
server.listen(8000);
app.set('socketio', io)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/eas', usersRouter);

let clients =[];

io.on('connection', function (socket) {
    let clientInfo = {};
    clientInfo.FIPS_CODE = Math.floor(100000 + Math.random() * 900000);
    clientInfo.clientSocketId = socket.id;
    clients.push(clientInfo);

    global.clientsData = clients;
    socket.on('create room', function (url_path) {
        socket.emit('joined', clientInfo)
        socket.join('member')
    })
});

module.exports = app;
