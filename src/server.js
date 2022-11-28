import express from 'express';
import http from 'http';
import WebSocket from 'ws';
const app = express();
app.set("view engine", "pug");
app.set("views", __dirname+ "/views");
app.use("/public",express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));
const handlerListen = () => console.log('Listening on http://localhost:3000');
// app.listen(3000, handlerListen);
// http, websocker 둘다 적용 시
const server = http.createServer(app);
const wss = new WebSocket.Server({server});
//const wss = new WebSocket.Server(); web socket만 필요할 시

const sockets = [];
const handleConnerction = (socket) =>{
    sockets.push(socket);
    socket["nick"] = "Anonymous";
    socket.on("close",()=>{console.log("Disconnected from browser!!")});
    socket.on("message",(message)=>{
        const parsed = JSON.parse(message);
        switch (parsed.type) {
            case 'new_msg':
                sockets.forEach(aSocket => {
                    aSocket.send(`${socket.nick} : ${parsed.payload}`);
                });
            case 'nick':
                socket["nick"] = parsed.payload;
                console.log(parsed.payload);
        }
    });
}
wss.on("connection", handleConnerction);

server.listen( 3000, handlerListen );
