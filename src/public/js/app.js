const socket = new WebSocket(`ws://${window.location.host}`);

socket.addEventListener("open",()=>{
    console.log("connected to browser !!")

});
socket.addEventListener("message", (message) => {
    console.log(message.data);
});
socket.addEventListener("close", () => {
    console.log("close to browser !!");
});
const fn = (event) => {

}

setTimeout(()=>{
    socket.send("nice!!");
},10000);