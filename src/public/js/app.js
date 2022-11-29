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
    socket.emit('enter_room',{payload: roomName}, showRoom);
    input.value = '';
}
const handleMessageSubmit = (event) => {
    event.preventDefault();
    const input = roomForm.querySelector('input');
    socket.emit('message',{payload: input.value});
    input.value = '';
}
form.addEventListener("submit", handleRoomSubmit);
roomForm.addEventListener("submit", handleMessageSubmit);