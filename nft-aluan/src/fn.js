function drawFrame(){
  ghFrame.noStroke();
  for (let i = 0; i < 1000; i++) {
    let x = (i / 1000) * defultW * 2.5;
    let y = (i / 1000) * defultH;
    let s = R.random_num(2*scal,10*scal);
    let cc=color(bg[bgid]);
    ghFrame.fill(red(cc),green(cc),blue(cc), R.random_int(100,200));
    ghFrame.ellipse(x, ss_w , s);
    ghFrame.ellipse(x, defultH - ss_w , s);
    ghFrame.ellipse(ss_w , y, s);
    ghFrame.ellipse(defultW - ss_w , y, s);
  }

  ghFrame.noFill();
  ghFrame.stroke(bg[bgid]);
  ghFrame.strokeWeight(ss_w*2.0);
  ghFrame.rect(defultW / 2, defultH / 2, defultW, defultH);
}



function drawSun(){
  ghMain.fill(bg[bgid5]);
  ghMain.noStroke();
  let sunx=R.random_num(defultW*0.1,defultW-defultW*0.1);
  let suny=R.random_num(defultH*0.1,defultH*0.3)+shiftH;

  let sumSize = R.random_num(0.12,0.3);
  ghMain.ellipse(sunx,suny,defultW*sumSize);
  ghMain.rectMode(CORNER);
  // ghMain.rect(sunx,suny,width*0.2,width*0.01);
  let sumLights = R.random_int(8,30);


  for(let i=0;i<sumLights;i++){
    ghMain.push();
    ghMain.translate(sunx,suny);
    ghMain.rotate(radians(i*(360/sumLights)));
    let kk=map(sumSize,0.08,0.2,0.005,0.02);
    let kkk=map(sumSize,0.08,0.2,0.8,0.6);
    ghMain.translate(defultW*(sumSize*kkk),0);

    ghMain.rect(0,0,defultW*0.6,defultW*kk);
    ghMain.pop();
  }
}



function newShuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(R.random_dec() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

function drawMount() {
  // ghMain.translate(-width/2,-height/2);;
  ghMain.rectMode(CENTER);
  ghMain.imageMode(CENTER);

  for (let i = 0; i < mountNum; i++) {
    ghMain.strokeWeight(5);
    ghMain.stroke(bg[bgid2]);
    if (i % 3 == 0) {//雲
      ghMain.beginShape();
      ghMain.fill(250); //draw mount cloud
      ghMain.vertex(0, defultH);
      for (let j = 0; j < defultH; j += 4) {
        n = noise(i, j / 300) * 280;
        k = fbm2D(i, j / 300) * 28;
        y = defultH * hscal * i + n + k+shiftH;
        ghMain.vertex(j, y);
      }
      ghMain.vertex(defultW * 1.5, defultH);
      ghMain.endShape();
    }
  //   //--------
    ghMain.beginShape();
    if (i % 2==0) ghMain.fill(bg[bgid3]);
    else if (i % 2==1) ghMain.fill(bg[bgid8]);
    let xx=[];
    let yy=[];
    let dd=[];
    ghMain.vertex(0, defultH);
    for (let j = 0; j < defultW; j += 4) {
      targetC++;
      n = noise(i, j / 300) * 300;
      k = fbm2D(i, j / 100) * 30;
      y = defultH * hscal * i + n + k+shiftH;
      targetY[targetC] = y;
      ghMain.vertex(j, y);
      xx[j]=j;
      yy[j]=y;
      dd[j]=R.random_num(0.05,0.3);
    }
    ghMain.vertex(defultW , defultH);
    ghMain.endShape();

    if(i==0){
      ghMain.noFill();
      ghMain.stroke(255,0,0);
      ghMain.strokeWeight(10);
      ghMain.beginShape();
      ghMain.vertex(0, defultH);
      for (let j = 0; j < defultW; j += 4) {
        n = noise(i, j / 300) * 300;
        k = fbm2D(i, j / 100) * 30;
        y = defultH * hscal * i + n + k+shiftH;
        if(j==40) console.log("start:",int(y)),startMountainY=int(y);
        else if(j==1040) console.log("end:",int(y)),endMountainY=int(y);
        ghMain.vertex(j, y);
      }
      ghMain.vertex(defultW , defultH);
      ghMain.endShape();
    }

    let lineCount = R.random_choice([2,4]);
    // console.log(lineCount);

    for (let j = 0; j < defultW; j += 8) {
      for(let k=0;k<50;k++){
        let d = defultW*dd[j];
        let r = d * (pow(random(random(random(random()))),2.0));
        ghBird.push();
        ghBird.strokeWeight(4);
        if (i % 2==0) ghBird.stroke(bg[bgid4]);
        else if (i % 2==1) ghBird.stroke(bg[bgid7]);

        ghBird.point(xx[j], yy[j]+r+6);
        ghBird.pop();
      }
    }
  }
}
function drawBirds(){
  birdNum =R.random_int(0,8);
  limit=0;
  let birdL=R.random_choice([0.2,0.3,0.4,0.5,0.6,0.7]);
  // console.log("birdL:",birdL);
  let birdH= defultH*birdL;
  console.log("birdNum:"+birdNum);
  while (birds.length < birdNum) {
    let rr=R.random_num(defultW*0.05,defultW*0.15);
    let a=R.random_num(0,6.28);
    let tt=R.random_int(0,1);

    if(tt==0){
      c = {
        x: defultW/2+cos(a)*rr,
        y: sin(a)*rr+birdH,
        r: R.random_num(defultW * 0.04, defultW * 0.045)
      }
    }else{
      c = {
        x: defultW/2+cos(a)*rr*3,
        y: sin(a)*rr*0.5+birdH,
        r: R.random_num(defultW * 0.04, defultW * 0.045)
      }
    }

    // console.log(c);
    overlapping = false;

    for (var j = 0; j < birds.length; j++) {
      var prev = birds[j];

      var d = dist(c.x, c.y, prev.x, prev.y);
      if (d < c.r + prev.r) {
        overlapping = true;
      }
    }

    if (!overlapping) {
      birds.push(c);
    }

    limit++;
    if (limit > 200) {
      // console.log("birds got limit");
      break;

    }
  }
  for (var i = 0; i < birds.length; i++) {
    let tt=R.random_int(0, 6)
    ghBird.tint(bg[bgid6]);
    ghBird.push();
    ghBird.translate(birds[i].x, birds[i].y);
    ghBird.rotate(R.random_num(-0.3, 0.3));
    ghBird.image(birdImg[tt], 0, 0, birds[i].r * 2.5, birds[i].r * 2.5);
    ghBird.pop();
  }
}
function drawArboret() {
  let layer3 = targetC / (mountNum-1);
  while (arboret.length < 120) {
    let choice = R.random_int(0,targetC);
    let step = [0, 1, 2, 3, 4, 5];
    let stepV = step[R.random_int(0,5)] + 1;
    c = {
      id: int(choice / layer3),
      x: (choice % layer3) * 4,
      y: targetY[choice] + R.random_num(defultH * 0.025, defultH * 0.05),
      r: map(stepV, 1, 6, defultH * 0.006, defultH * 0.01)
    }
    //y: targetY[choice]+(stepV*height*0.015),
    overlapping = false;

    for (var j = 0; j < arboret.length; j++) {
      var prev = arboret[j];

      var d = dist(c.x, c.y, prev.x, prev.y);
      if (d < c.r + prev.r) {
        overlapping = true;
      }
    }

    if (!overlapping) {
      arboret.push(c);
    }

    limit++;
    if (limit > 1000) {
      break;
    }
  }


  for (var i = 0; i < arboret.length; i++) {
    if (arboret[i].id %2==0) ghBird.tint(bg[bgid2]);
    else ghMain.tint(bg[bgid4]);
    ghBird.push();
    ghBird.translate(arboret[i].x, arboret[i].y);
    ghBird.rotate(R.random_num(-0.3, 0.3));
    if (arboret[i].r > 0) ghBird.image(ptn, 0, 0, arboret[i].r * 2, arboret[i].r * 2);
    ghBird.pop();
  }

}




class Cloud {
  constructor() {
    this.far=R.random_num(0,1);
    this.x = R.random_num(-defultW * 0.1, defultW - defultW * 0.1);
    this.y = R.random_num(5, 60);
    if(this.far<0.5){
      this.ypos = R.random_num(0.05, 0.3);
      this.len = R.random_int(20,60);
      this.w = R.random_num(60, 80);
      this.h = R.random_num(60, 80);
    }else{
      this.ypos = R.random_num(0.6, 0.9);
      this.len = R.random_int(20,60);
      this.w = R.random_num(60, 80);
      this.h = R.random_num(60, 80);
    }
  }
  draw(_gh) {
    _gh.beginShape(TRIANGLE_STRIP);
    _gh.stroke(250);
    _gh.fill(250);

    for (let i = 0; i < this.len; i++) {
      let x = i * 10 + this.x;
      let id = (1.0 - 2 * abs(i / this.len - 0.5)) * 1;
      n = noise(x / 100, this.ypos/100) * this.h;
      y = defultH * this.ypos - this.y + n * -id;

      _gh.vertex(x, y);
      let thisAngle = noise(x / 500, y / 500) * TWO_PI;
      let x2 = x;
      let y2 = cos(thisAngle + PI / 4.0) * -this.w * id + y;
      _gh.vertex(x2, y2);
    }

    _gh.endShape();
  }
}

const fbm2D = (a, b, scale = 1, level = 5) => {
  let n = 0;
  let t = 0;
  for (let i = 0; i < level; i++) {
    t = Math.pow(2, i);
    n += noise(a * scale * t, b * scale * t) / t;
  }

  return n;
};



function drawNoise(gA) {

  ghNoise.noStroke();

  for (let i = 0; i < defultW; i += 2) {
     for (let j = 0; j < defultH; j += 2) {
       ghNoise.fill(random(210, 235), 200);
       ghNoise.rect(i, j, 2, 2);
     }
   }
  for (let i = 0; i < 50; i++) {
    ghNoise.fill(random(70, 110), 180);
    ghNoise.ellipse(random(0, defultW), random(0, defultH), random(1, 3), random(1, 3));
  }

  //
  ghNoise.angleMode(DEGREES);
  //
  for (let i = 0; i < 4000; i++) {
    let x = R.random_num(0,defultW);
    let y = R.random_num(0,defultW);
    let angle = R.random_num(0,360);
    let len = defultW;
    ghNoise.push();
    ghNoise.stroke(0, 8);
    ghNoise.translate(x, y);
    ghNoise.line(
      cos(angle) * len,
      sin(angle) * len,
      cos(angle + 180) * len,
      sin(angle + 180) * len
    );
    ghNoise.pop();
  }
  // ghNoise.translate(defultW/2,defultH/2);
  // ghNoise.noFill();
  // ghNoise.strokeWeight(50);
  // ghNoise.stroke(0,0,250);
  // ghNoise.rect(0, 0, defultW, defultH);
  // ghNoise.loadPixels();
  // let d = ghNoise.pixelDensity();
  // let halfImage = 4 * (width * d) * (height * d);
  // for (let ii = 0; ii < halfImage; ii += 11) {
  //   grainAmount = random(-gA, gA);
  //   ghNoise.pixels[ii] = ghNoise.pixels[ii] + gA;
  //   ghNoise.pixels[ii + 1] = ghNoise.pixels[ii + 1] + grainAmount;
  //   ghNoise.pixels[ii + 2] = ghNoise.pixels[ii + 2] + grainAmount;
  //   ghNoise.pixels[ii + 3] = ghNoise.pixels[ii + 3] + gA * 1;
  // }
  // ghNoise.updatePixels();
}

function drawghB() {
  let yoff = 0;
  ghB.loadPixels();
  for (let y = 0; y < 100; y++) {
    let xoff = 0;
    for (let x = 0; x < 100; x++) {
      let index = (x + y * 100) * 4;
      let r = pow(noise(xoff, yoff), 0.1) * 255;
      ghB.pixels[index + 0] = r;
      ghB.pixels[index + 1] = r;
      ghB.pixels[index + 2] = r;
      ghB.pixels[index + 3] = 255;
      xoff += inc;
    }
    yoff += inc;
  }
  ghB.updatePixels();
}


class Random {
  constructor(seed) {
    this.seed = seed;
  }
  random_dec() {
    /* Algorithm "xor" from p. 4 of Marsaglia, "Xorshift RNGs" */
    this.seed ^= this.seed << 13;
    this.seed ^= this.seed >> 17;
    this.seed ^= this.seed << 5;
    return ((this.seed < 0 ? ~this.seed + 1 : this.seed) % 1000) / 1000;
  }
  random_num(a, b) {
    return a + (b - a) * this.random_dec();
  }
  random_int(a, b) {
    return Math.floor(this.random_num(a, b + 1));
  }
  random_bool(p) {
    return this.random_dec() < p;
  }
  random_choice(list) {
    return list[Math.floor(this.random_num(0, list.length * 0.99))];
  }
}
