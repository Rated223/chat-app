import path from "path";
import http from "http";
import  socketio from "socket.io";
import { app, express } from './app';

const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectory = path.join(__dirname, '../public');

app.use(express.static(publicDirectory));

io.on('connection', () => {
    console.log('new connection!');
});

server.listen(port, () => {
    console.log('Server up and running in port '+port);
});