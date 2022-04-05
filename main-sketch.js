
let allMountainOffset = 0.0;
let mountains = [];
let mainMountainIndex = 0;

function setup () {
    createCanvas(windowWidth, windowHeight);
    background(0);

    let seed = fxrand() * 10000;
    noiseSeed(seed);

    // random mountain nums
    let mountainCounter = 0;

    let upMountains = floor(fxRandomRange(3, 6));
    let bottomMountains = floor(fxRandomRange(3, 6));
    mainMountainIndex = upMountains;

    let totalMountainNum = upMountains + bottomMountains + 1;

    console.log("total mountain: " + totalMountainNum);
    console.log("main mountain index: " + upMountains);

    let mainHue = fxrand() * 255;
    let mainMountainStartY = windowHeight * 0.5 + fxRandomRange(-0.3, 0.3) * windowWidth;

    for(let i=0; i< totalMountainNum; i++)
    {
        let startY = 0.0;
        let mountainOffsetUnit = windowWidth * 0.3;

        // set start Y
        if(i < upMountains)
        {
            let offsetValue = i - upMountains;
            startY = mainMountainStartY + (mountainOffsetUnit * offsetValue) + (fxRandomRange(-0.1, 0.1) * windowWidth);
        }
        else if(i == upMountains)
        {
            startY = mainMountainStartY;
        }
        else
        {
            let offsetValue = i - upMountains;
            startY = mainMountainStartY + mountainOffsetUnit * offsetValue + fxRandomRange(-0.1, 0.1) * windowWidth;
        }

        // random color
        colorMode(HSB, 255);
        let currentHue = mainHue + fxrand() * 10;
        let currentSat = fxrand() * 100 + 100;
        let currentBright = fxrand() * 150 + 50;

        if(currentHue > 255)
            currentHue -= 255;

        if(i == upMountains)
        {
            currentSat = 0;
            currentBright = 255;
        }

        let colorA = color(currentHue, currentSat, currentBright);
        let colorB = color(currentHue + fxrand() * 10, currentSat, currentBright - 50);

        mountains[i] = new MountainCurve(colorA, colorB, startY);
    }

    // get start point & end point
    let startMountainY = mountains[mainMountainIndex].calculateY(0);
    let endMountainY = mountains[mainMountainIndex].calculateY(windowWidth);

    NY_MountainReady(startMountainY, endMountainY);
}

function drawMountains () {
    for(let i=0; i< mountains.length; i++)
    {
        mountains[i].drawMountain();
    }
}

function fxRandomRange (from, to)
{
    return fxrand() * (to - from) + from;
}

// function drawMountain (colorA, colorB) {
//     let noiseStart = fxrand() * 10000;
//     let noiseWidth = 2 + fxrand() * 6;
//     let mountainHeight = windowWidth * 0.5;
//
//     for(let x=0; x< windowWidth; x++)
//     {
//         let t = x/windowWidth;
//         let nowNoiseValue = noiseStart + noiseWidth * t;
//         let y = noise(nowNoiseValue) * mountainHeight;
//
//         var grad = this.drawingContext.createLinearGradient(x, 0, x, windowHeight);
//         grad.addColorStop(0, colorA);
//         grad.addColorStop(1, colorB);
//
//         this.drawingContext.strokeStyle = grad;
//         line(x, y, x, windowHeight);
//     }
// }

class MountainCurve {
    constructor(colorA, colorB, startY) {
        this.noiseStart = fxrand() * 10000;
        this.noiseWidth = floor(fxRandomRange(1, 3));
        this.mountainHeight = windowWidth * 0.7;

        this.end = -1; // no known yet

        this.startY = startY;

        this.colorA = colorA;
        this.colorB = colorB;
    }

    drawMountain () {
        console.log("mountin y: " + this.startY);

        for(let x=0; x< windowWidth; x++)
        {
            let t = x/windowWidth;
            let nowNoiseValue = this.noiseStart + this.noiseWidth * t;
            let y = this.startY + (noise(nowNoiseValue) - 0.5) * this.mountainHeight;
            y += allMountainOffset;

            var grad = drawingContext.createLinearGradient(x, 0, x, windowHeight);
            grad.addColorStop(0, this.colorA);
            grad.addColorStop(1, this.colorB);

            drawingContext.strokeStyle = grad;
            line(x, y, x, windowHeight);
        }
    }

    calculateY (x) {
        let t = x/windowWidth;
        let noiseValue = this.noiseStart + this.noiseWidth * t;
        return allMountainOffset + this.startY + (noise(noiseValue) - 0.5) * this.mountainHeight;
    }
}

//////////////////////////////////////////////////////////////
// PLEASE INCLUDE THIS PART INTO YOUR SKETCH SCRIPT
// THE
/////////////////////////////////////////////////////////////


// please call this function when you calculated your StartY and EndY
function NY_MountainReady (mountainStartY, mountainEndY)
{
    let message = {
        'event':'ready',
        'args':{
            'mountainIndex':NY_mountainIndex,
            'startY':mountainStartY,
            'endY':mountainEndY
        }
    };

    if(NY_isCollage)
        window.top.postMessage(message, '*');
    else
        NY_StartDrawMountain(0.0);
}

// please use this function to start draw
// this will be called after the offset value is calulated,
// or will be called if no offset value needed (when viewing the NFT alone)
function NY_StartDrawMountain (offset)
{
    // you should overwrite this function for you own need,
    // the following code is only for demo purpose
    allMountainOffset = offset;
    drawMountains();

    let startPoint = mountains[mainMountainIndex].calculateY(0);
    let endPoint = mountains[mainMountainIndex].calculateY(windowWidth);
}
