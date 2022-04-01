
function setup () {
    createCanvas(windowWidth, windowHeight);
    background(0);

    let seed = fxrand() * 10000;
    noiseSeed(seed);

    // random mountain nums
    let mountains = [];

    let mountainNum = floor(3 + fxrand() * 10);
    let specialIndex = floor(fxrand() * mountainNum);


    console.log("total mountain: " + mountainNum);
    console.log("main mountain index: " + specialIndex);

    let mainHue = fxrand() * 255;

    for(let i=0; i< mountainNum; i++)
    {
        // set start Y
        let startY = windowHeight/mountainNum * i ;

        // random color
        colorMode(HSB, 255);
        let currentHue = mainHue + fxrand() * 10;
        let currentSat = fxrand() * 100 + 100;
        let currentBright = fxrand() * 150 + 50;

        if(currentHue > 255)
            currentHue -= 255;

        if(specialIndex == i)
        {
            currentSat = 0;
            currentBright = 255;
        }

        let colorA = color(currentHue, currentSat, currentBright);
        let colorB = color(currentHue + fxrand() * 10, currentSat, currentBright - 50);

        mountains[i] = new MountainCurve(colorA, colorB, startY);
        mountains[i].drawMountain();
    }
}

function setupSize () {

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

function draw () {

}


class MountainCurve {
    constructor(colorA, colorB, startY) {
        this.noiseStart = fxrand() * 10000;
        this.noiseWidth = 1 + fxrand() * 3;
        this.mountainHeight = windowWidth * 0.5;
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

            var grad = drawingContext.createLinearGradient(x, 0, x, windowHeight);
            grad.addColorStop(0, this.colorA);
            grad.addColorStop(1, this.colorB);

            drawingContext.strokeStyle = grad;
            line(x, y, x, windowHeight);
        }
    }
}
