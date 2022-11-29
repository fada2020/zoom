import express from 'express';
import SocketIo from 'socket.io';
import http from 'http';
//import WebSocket from 'ws';
const app = express();
app.set("view engine", "pug");
app.set("views", __dirname+ "/views");
app.use("/public",express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));
const handlerListen = () => console.log('Listening on http://localhost:3000');
const httpServer = http.createServer(app);
const wsServer = SocketIo(httpServer);

 wsServer.on("connection", socket => {
    socket.onAny(spy);
    socket.on('enter_room', (roomName, showRoom)=> {
        socket.join(roomName);
        showRoom();
        socket.to(roomName).emit('welcome');
    });
    socket.on('message', (msg, roomName, callback)=> {
        socket.to(roomName).emit('message', msg);
        callback();
    });
    socket.on("disconnecting", () => {
        console.log(socket.rooms); // the Set contains at least the socket ID
        socket.rooms.forEach(room=> socket.to(room).emit('bye'));
    });

    socket.on("disconnect", () => {
        // socket.rooms.size === 0
    });
 });

 const spy = (event)=>{
    console.log(`socket event: ${event}`);
 }
httpServer.listen( 3000, handlerListen );
