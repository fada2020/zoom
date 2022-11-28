const socket = new WebSocket(`ws://${window.location.host}`);
const messageList = document.querySelector('ul');
const messageForm = document.querySelector('form');
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
const handleSubmit = (event) => {
    event.preventDefault();
    const input = messageForm.querySelector('input');
    socket.send(input.value);
    console.log(input.value);
}
messageForm.addEventListener("submit", handleSubmit);