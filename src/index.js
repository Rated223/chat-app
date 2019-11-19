import path from "path";
import http from "http";
import  socketio from "socket.io";

import { app, express } from './app';
import { generateMessage } from './utils/messages';
import { addUser, removeUser, getUser, getUsersInRoom } from './utils/users';

const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectory = path.join(__dirname, '../public');

app.use(express.static(publicDirectory));

io.on('connection', (socket) => {

    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room });

        if (error) {
            return callback(error);
        }

        socket.join(user.room);
        socket.emit('message', generateMessage({message: `Welcome ${user.username}!`}));
        socket.broadcast.to(user.room).emit('message', generateMessage({message: `${user.username} has join to the conversation.`}));
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom({ room: user.room })
        });
        callback();
    });

    socket.on('sendMessage', ({message, username, usercolor}, callback) => {
        const { error, user } = getUser({ id: socket.id });

        if (error) {
            return callback(error);
        }
        
        io.to(user.room).emit('message', generateMessage({message, username, usercolor}));
        callback();
    });

    socket.on('sendLocation', ({latitude, longitude, username, usercolor}, callback) => {
        const { error, user } = getUser({ id: socket.id });

        if (error) {
            return callback(error);
        }

        io.to(user.room).emit('locationMessage', generateMessage({message: `https://google.com/maps?q=${latitude},${longitude}`, username, usercolor}));
        callback();
    })

    socket.on('disconnect', () => {
        const user = removeUser({ id: socket.id });
        if (user) {
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom({ room: user.room })
            })
            io.to(user.room).emit('message', generateMessage({message: `${user.username} has left the conversation.`}));
        }
    })
});

server.listen(port, () => {
    console.log('Server up and running in port '+port);
});