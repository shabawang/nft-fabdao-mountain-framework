
function setup () {
    background(255);
    createCanvas(windowWidth, windowHeight);

    let seed = fxrand() * 10000;
    noiseSeed(seed);
    console.log(seed);

    let _color = color(255, 255, 0);
    drawMountain(_color);
}

function setupSize () {

}


function drawMountain (color) {
    let noiseStart = fxrand() * 10000;
    let noiseWidth = fxrand() * 20;
    let mountainHeight = windowWidth * 0.5;

    console.log(noiseStart);
    console.log(noiseWidth);

    for(let x=0; x< windowWidth; x++)
    {
        let t = x/windowWidth;
        let nowNoiseValue = noiseStart + noiseWidth * t;
        let y = noise(nowNoiseValue) * mountainHeight;

        noStroke();
        fill(color);
        rect(x, y, 1, (windowHeight-y));
    }
}
function draw () {

}


class MountainCurve {

}
