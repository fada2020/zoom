const socket = io();
const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");
const roomForm = room.querySelector("form");
room.hidden = true;
let roomName;
 
const showRoom = () => {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector('h3');
    h3.innerText = `Room ${roomName}`;

}
const handleRoomSubmit = (event) => {
    event.preventDefault();
    const input = form.querySelector('input');
    roomName = input.value;
    socket.emit('enter_room',roomName, showRoom);
    input.value = '';
}
const handleMessageSubmit = (event) => {
    event.preventDefault();
    const input = roomForm.querySelector('input');
    const msg = input.value;
    socket.emit('message',msg, roomName, () => {
        getMessage(`You: ${msg}`);
    });
    input.value = '';
}
form.addEventListener("submit", handleRoomSubmit);
roomForm.addEventListener("submit", handleMessageSubmit);
const getMessage = (msg) => {
    const ul = room.querySelector('ul');
    const li = document.createElement('li');
    li.innerText = msg;
    ul.appendChild(li);
}
socket.on('welcome',()=>{
    getMessage('someone joined!!!');
});
socket.on('bye',()=>{
    getMessage('someone left!!!');
});
socket.on('message',(msg)=>{
    getMessage(msg);
});
