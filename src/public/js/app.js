const socket = io();
const myFace = document.getElementById('myFace');
const myMute = document.getElementById('mute');
const myCamera = document.getElementById('camera');
const myCameras = document.getElementById('cameras');
const welcome = document.getElementById("welcome");
const call = document.getElementById("call");
const welcomeForm = welcome.querySelector('form');
call.hidden = true;
let myStream;
let muted = false;
let cameraOff = false;
let roomName = '';
let myPeerConnection;
async function getCameras(){
    try{

        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter((device)=>device.kind ==='videoinput');
        myCameras.innerHTML ='';
        const currCamera = myStream.getVideoTracks()[0];
        cameras.forEach(camera=>{
            const option = document.createElement('option');
            option.value = camera.deviceId;
            option.innerText = camera.label;
            if (currCamera.label === camera.label){
                option.selected = true;
            }
            myCameras.appendChild(option);
        });
    }catch(e){console.log(e);}

}
async function getMedia(deviceId){
    try{
        const constraints = {
            audio: true,
            video: {facingMode: 'user'}
        };
        const cameraConstranints = {  audio: true,
            video: {deviceId:{ exact: deviceId}}
        };
        myStream = await navigator.mediaDevices.getUserMedia(
            deviceId ? cameraConstranints : constraints
        );
        console.log(myStream);
        myFace.srcObject = myStream;
        await getCameras();
    } catch(e){
        console.log(e);
    }
}
function handleCameraCLick(){
    myStream.getVideoTracks().forEach((track) => track.enabled = !track.enabled);
    if(!cameraOff) {
        myCamera.innerText = 'camera Off';
        cameraOff = true;
    } else {
        myCamera.innerText = 'camera On';
        cameraOff = false;
    }
}
function handleMuteCLick(){
    myStream.getAudioTracks().forEach((track) => track.enabled = !track.enabled);
    if(!muted) {
        myMute.innerText = 'unmute';
        muted = true;
    } else {
        myMute.innerText = 'mute';
        muted = false;
    }
}
async function handleCameraChange(){
    await getMedia(myCameras.value);
}
async function startMedia(){
    welcome.hidden = true;
    call.hidden = false;
    await getMedia();
    makeConnection();
}
function handleWelcomeSubmit (event) {
    event.preventDefault();
    const input = welcomeForm.querySelector('input');
    roomName = input.value;
    socket.emit('join_room', roomName, startMedia);
    input.value = '';
}
myCamera.addEventListener('click', handleCameraCLick);
myMute.addEventListener('click', handleMuteCLick);
myCameras.addEventListener('input', handleCameraChange);
welcomeForm.addEventListener("submit", handleWelcomeSubmit);
socket.on("welcome", async()=>{
    console.log("somebody joined!!!");
    const offer = await myPeerConnection.createOffer();
    console.log(offer);
});

// with RTC code
function makeConnection(){
    myPeerConnection = new RTCPeerConnection();
    console.log(myStream.getTracks());
    myStream.getTracks().forEach((track)=>{
        myPeerConnection.addTrack(track, myStream);
    });
}