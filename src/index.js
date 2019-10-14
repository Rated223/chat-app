import path from "path";
import http from "http";
import  socketio from "socket.io";

import { app, express } from './app';
import { generateMessage } from './utils/messages';

const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectory = path.join(__dirname, '../public');

app.use(express.static(publicDirectory));

io.on('connection', (socket) => {

    socket.emit('message', generateMessage('Welcome!'));
    socket.broadcast.emit('message', generateMessage('A new user has join to the conversation.'));

    socket.on('sendMessage', (message, callback) => {
        io.emit('message', generateMessage(message));
        callback('Message delivered');
    });
    socket.on('sendLocation', ({latitude, longitude}, callback) => {
        io.emit('locationMessage', generateMessage(`https://google.com/maps?q=${latitude},${longitude}`));
        callback('Location shared');
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left the conversation.'));
    })
});

server.listen(port, () => {
    console.log('Server up and running in port '+port);
});