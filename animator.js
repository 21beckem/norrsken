async function load() {
    let res = await fetch('https://services.swpc.noaa.gov/products/animations/ovation_north_24h.json');
    const frameSrcList = await res.json();
    console.log(frameSrcList);

    let waiters = Array();
    for (let i = 0; i < frameSrcList.length; i++) {
        const frm = frameSrcList[i];
        waiters.push(getFrame(frm.url, i));
    }
    for (let i = 0; i < waiters.length; i++) {
        await waiters[i];
        console.log(i);
    }
    for (let i = 0; i < Object.keys(framesObj).length; i++) {
        const myI = Object.keys(framesObj)[i];
        frames.push( framesObj[myI] );
    }
    hasLoaded = true;
}
let framesObj = {};
let frames = Array();
let hasLoaded = false;

const canvas = document.getElementById("animationCanvas");
const ctx = canvas.getContext("2d");
canvas.style.width='100%';
canvas.style.height='100%';
canvas.width = Math.min(canvas.offsetWidth, canvas.offsetHeight);
canvas.height = canvas.width;

let lastI = 0;
let animatorPaused = false;
let playLoop = setInterval(() => {
    if (!hasLoaded || animatorPaused) { return; }
    drawFrame(frames[lastI]);
    lastI++;
    if (lastI >= frames.length) { lastI = 0; }
}, 75);

function drawFrame(frm) {
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(frm, 0, 0, canvas.width, canvas.height);
}

async function getFrame(src, i) {
    let img = await new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = 'https://services.swpc.noaa.gov' + src;
    });
    frames[i] = img;
}

function testImage() {
    let img = new Image();
    img.onload = () => drawFrame(img);
    img.src = 'https://services.swpc.noaa.gov/images/animations/ovation/north/aurora_N_2024-01-17_2040.jpg';
}
testImage();
