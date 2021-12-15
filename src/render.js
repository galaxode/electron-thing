// Buttons
const videoElement = document.querySelector('video');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const videoSelectBtn = document.getElementById('videoSelectBtn');
videoSelectBtn.onclick = getVideoSources;

// const { Menu } = require('@electron/remote');

// Get available video resources
async function getVideoSources() {
    window.api.send("show-context-menu");

    window.api.receive("context-menu-command", (source) => {
        console.log("SOURCE: ", source);
        selectSource(source);
    });
}

async function selectSource(source) {
    videoSelectBtn.innerText = source.name;
    const constraints = {
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source.id
            }
        }
    };
    // create a stream
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    console.log("STREAM: ", stream);
    // preview the source in a video element
    videoElement.srcObject = stream;
    videoElement.play();
}