import express from 'express';
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
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
const wsServer = new Server(httpServer, {
    cors: {
      origin: "https://admin.socket.io",
      credentials: true
    }
  });
  instrument(wsServer, {
    auth:false
  });
const publicRooms = () => {
    const {
        sockets: {
            adapter: {
                sids , rooms
            },
        },
    } = wsServer;
    const publicRooms = [];
    rooms.forEach((_,key)=> {
        if (sids.get(key) === undefined) {
            publicRooms.push(key);
        }
    });
    return publicRooms;
}
const countRooms = (roomName) => {
    return wsServer.sockets.adapter.rooms.get(roomName)?.size;
}
 wsServer.on("connection", socket => {
    console.log(wsServer.sockets.adapter);
    socket.onAny(spy);
    socket['nick'] = 'Anonymous';
    socket.on('enter_room', (roomName, showRoom)=> {
        socket.join(roomName);
        showRoom();
        socket.to(roomName).emit('welcome', socket.nick, countRooms(roomName));
        wsServer.sockets.emit('room_change',publicRooms());
    });
    socket.on('nick', nick =>(socket['nick'] = nick));
    socket.on('message', (msg, roomName, callback)=> {
        socket.to(roomName).emit('message', `${socket.nick}: ${msg}`);
        callback();
    });
    socket.on("disconnecting", () => {
        console.log(socket.rooms); // the Set contains at least the socket ID
        socket.rooms.forEach(room=> socket.to(room).emit('bye', socket.nick, countRooms(room) -1));
    });

    socket.on("disconnect", () => {
        wsServer.sockets.emit('room_change',publicRooms());
    });
 });

 const spy = (event)=>{
    console.log(`socket event: ${event}`);
 }
httpServer.listen( 3000, handlerListen );
