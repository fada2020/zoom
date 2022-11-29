const socket = io();
const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");
const msgForm = room.querySelector("#msg");
const nickForm = room.querySelector("#nick");
room.hidden = true;
let roomName;
const changeRoomCount = (count) => {
    const h3 = room.querySelector('h3');
    h3.innerText = `Room ${roomName} (${count})`;

} 
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
const handleNickSubmit = (event) => {
    event.preventDefault();
    const input = nickForm.querySelector('input');
    const nick = input.value;
    socket.emit('nick', nick);
    input.value = '';
    nickForm.hidden = true;
}
const handleMessageSubmit = (event) => {
    event.preventDefault();
    const input = msgForm.querySelector('input');
    const msg = input.value;
    socket.emit('message',msg, roomName, () => {
        getMessage(`You: ${msg}`);
    });
    input.value = '';
}
const getMessage = (msg) => {
    const ul = room.querySelector('ul');
    const li = document.createElement('li');
    li.innerText = msg;
    ul.appendChild(li);
}
form.addEventListener("submit", handleRoomSubmit);
msgForm.addEventListener("submit", handleMessageSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
socket.on('welcome',(user, count)=>{
    getMessage(`${user} joined!!!`);
    changeRoomCount(count);

});
socket.on('bye',(user, count)=>{
    getMessage(`${user} left!!!`);
    changeRoomCount(count);
});
socket.on('message',(msg)=>{
    getMessage(msg);
});
socket.on('room_change',(rooms)=>{
    const roomsList = welcome.querySelector('ul');
    roomsList.innerHTML ='';
    rooms.forEach(room=>{
        const li = document.createElement('li');
        li.innerText = room;
        roomsList.append(li);
    });
    console.log(rooms);
});
