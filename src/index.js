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

    socket.on('userRegistered', (user, callback) => {
        //TODO: save here in the list
        socket.emit('message', generateMessage({message: `Welcome ${user}!`}));
        socket.broadcast.emit('message', generateMessage({message: 'A new user has join to the conversation.'}));
        callback('User registered');
    })


    socket.on('sendMessage', ({message, username, usercolor}, callback) => {
        io.emit('message', generateMessage({message, username, usercolor}));
        callback('Message delivered');
    });
    socket.on('sendLocation', ({latitude, longitude, username, usercolor}, callback) => {
        io.emit('locationMessage', generateMessage({message: `https://google.com/maps?q=${latitude},${longitude}`, username, usercolor}));
        callback('Location shared');
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage({message: 'A user has left the conversation.'}));
    })
});

server.listen(port, () => {
    console.log('Server up and running in port '+port);
});