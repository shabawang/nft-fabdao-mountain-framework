let allMountainOffset = 0.0;
let mountains = [];
let mainMountainIndex = 0;
let w = 1080;
let h = 1920;
let pgMain;
//------------------------
let seed;
let mounNum = 1;
// let bg = ["#c27d90", "#c4b180", "#7da6c1", "#79bda6", "#9f9f9f", "#be907a"];
let bg = ["#a5322f", "#e6a332", "#d47533", "#dfc4a9", "#373e8e", "#505050", "#2f6156", "#a3a18c", "#dbd9d9", "#191b26"];
let bgid, bgid2, bgid3, bgid4, bgid5, bgid6, bgid7, bgid8, bgid9;
let ghMain, ghBird, ghWood,ghFrame,ghTree,ghWood2;
let clouds = [];
let cNum = 15;
let tNum = 10;
let y = 0;
let n = 0;
let k = 0;
let limit = 0;
let arboret = [];
let targetY = [];
let targetC = 0;
let ptn, ptnid, R;
let inc = 0.01;
let imgs = [];
let birds = [];
let ptnNum = 5;
let birdNum;
let birdImg = [];
let treeImg = [];
let mountNum, scal, ss, ss_w;
let lastRandom = 0;
let radId = [];
let colorArray = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let newArray, pictGfx;
let defultW = 1080;
let defultH = 1920;
let ww, hh;
let shiftL;
let shiftH;
let ptn_color = [];
let hscal;
let light;
let startMountainY = 0;
let endMountainY = 0;

//------------------------
function preload() {
  for (let i = 0; i < ptnNum; i++) imgs[i] = loadImage("./src/imgs/ptn_" + i + ".png");
  for (let i = 0; i < 7; i++) birdImg[i] = loadImage("./src/imgs/bird1_" + i + ".png");
  for (let i = 0; i < 23; i++) treeImg[i] = loadImage("./src/tree/tree_" + i + ".png");
  light=loadImage("./src/light.png");
}

function setup() {
  ww = windowHeight / 1.777;
  hh = windowHeight;
  createCanvas(ww, windowHeight, WEBGL);
  imageMode(CENTER);
  rectMode(CENTER);
  //-------------------------------
  ghMain = createGraphics(defultW, defultH);
  ghMain.pixelDensity(1);

  ghFrame = createGraphics(defultW, defultH);
  ghFrame.pixelDensity(1);
  ghFrame.rectMode(CENTER);
  ghFrame.imageMode(CENTER);

  ghBird = createGraphics(defultW, defultH);
  ghBird.pixelDensity(1);
  ghBird.rectMode(CENTER);
  ghBird.imageMode(CENTER);

  ghNoise = createGraphics(defultW, defultH);
  ghNoise.pixelDensity(1);
  ghNoise.rectMode(CENTER);
  ghNoise.imageMode(CENTER);

  ghTree = createGraphics(defultW, defultH);
  ghTree.pixelDensity(1);
  ghTree.rectMode(CENTER);
  ghTree.imageMode(CENTER);

  ghWood2 = createGraphics(defultW, defultH);
  ghWood2.pixelDensity(1);
  ghWood2.rectMode(CENTER);
  ghWood2.imageMode(CENTER);

  //-------------------------------
  seed = int(random(10000));
  R = new Random(seed);
  noiseSeed(seed);
  scal = width / 1000;
  ss = defultH;
  ss_w = ss * 0.02;

  mountNum = R.random_int(6, 9);
  tNum = R.random_int(4, 8);
  console.log("mount num:" + mountNum);
  console.log("tree num:" + tNum);
  hscal = R.random_choice([0.1, 0.05, 0.075]);

  let showSun = R.random_num(0, 1);
  // showSun = 0.1;

  ptn_color = [
    [0, 1, 6, 7, 1, 9, 1, 4, 9],
    [1, 1, 6, 9, 8, 9, 9, 0, 9],
    [2, 6, 3, 5, 8, 4, 6, 7, 6],
    [3, 4, 5, 9, 8, 1, 6, 8, 3],
    [4, 7, 6, 9, 8, 2, 9, 7, 9],
    [5, 3, 4, 6, 8, 1, 4, 6, 3],
    [6, 3, 5, 9, 8, 9, 6, 7, 9],
    [7, 5, 3, 9, 8, 9, 5, 8, 5],
    [8, 3, 9, 6, 9, 9, 5, 7, 8],
    [9, 9, 9, 5, 9, 0, 5, 9, 5],
    [8, 8, 8, 5, 9, 9, 5, 8, 9],
    [0, 0, 0, 1, 1, 1, 1, 0, 1],
    [6, 6, 6, 1, 1, 1, 1, 6, 1],
    [4, 4, 4, 8, 8, 8, 8, 4, 8],
    [0, 0, 6, 6, 8, 1, 4, 4, 1],
  ]

  let ch_ptn = R.random_int(0, 14);
  ch_ptn = 6;
  {
    bgid = ptn_color[ch_ptn][0];
    bgid2 = ptn_color[ch_ptn][1];
    bgid3 = ptn_color[ch_ptn][2];
    bgid4 = ptn_color[ch_ptn][3];
    bgid5 = ptn_color[ch_ptn][4];
    bgid6 = ptn_color[ch_ptn][5];
    bgid7 = ptn_color[ch_ptn][6];
    bgid8 = ptn_color[ch_ptn][7];
    bgid9 = ptn_color[ch_ptn][8];
  }

  // bgid = 8;//背景
  // bgid2 = 8;//小樹
  // bgid3 = 8; //山的顏色a
  // bgid4 = 5; //山的陰影a
  // bgid5 = 9;//太陽
  // bgid6 = 9;//鳥
  // bgid7 = 5;//山的陰影b
  // bgid8 = 8;//山的顏色b
  // bgid9 = 0;//樹的顏色


  ptnid = R.random_int(0, ptnNum - 1);

  ptn = imgs[ptnid];

  if (showSun > 0.8) {
    shiftL = R.random_choice([0, 0.1, 0.2, 0.3, 0.4, 0.5]);
    shiftH = defultH * shiftL;
    // console.log("shiftL:" + shiftL);
    drawSun();
    cNum = R.random_int(5, 20);
  } else {
    shiftL = R.random_choice([0, 0.1, 0.2, 0.3]);
    shiftH = defultH * shiftL;
    // console.log("shiftL:" + shiftL);
    cNum = R.random_int(15, 30);
  }

  for (let i = 0; i < cNum; i++) clouds[i] = new Cloud();
  for (let i = 0; i < cNum; i++)
    if (clouds[i].far < 0.5) clouds[i].draw(ghMain);
  drawMount();
  drawArboret();
  drawBirds();
  ghBird.fill(255);
  ghBird.noStroke();
  ghBird.textSize(32);
  for(let i=0;i,i<20;i++){
    ghBird.rect(50,i*96,80,10);
    ghBird.text(i*96,130,i*96);
  }
  drawFrame();

  if (hscal <0.1 && shiftL <=0.2) {
    for (let i = 0; i < tNum; i++) {
      ghTree.tint(bg[bgid9]);
      ghTree.push();
      let x = map(i/tNum,0,1,defultW*0.1+defultW*0.1,defultW)
      +R.random_num(-defultW*0.05,-defultW*0.05);
      ;
      let y = R.random_num(defultH * 0.88, defultH * 0.9);
      let id = R.random_int(0, 22);
      let ro = R.random_choice([-1, 1]);
      ghTree.translate(x, y);
      ghTree.scale(ro, 1);
      ghTree.image(treeImg[id], 0, 0, defultW/2, defultW/2);
      ghTree.pop();
    }
    let lightNum=R.random_int(5,20);

    for (let i = 0; i < lightNum; i++) {
      ghTree.tint(bg[bgid9]);
      ghTree.push();
      let x = R.random_num(defultW * 0.05, defultW * 0.95);
      let y = R.random_num(defultH * 0.1, defultH*0.9);
      let s = R.random_int(25,40);
      ghTree.translate(x, y);
      ghTree.image(light, 0, 0, defultW/s, defultW/s);
      ghTree.pop();
    }
  }

  for (let i = 0; i < cNum; i++)
    if (clouds[i].far > 0.5) clouds[i].draw(ghBird);

  ghWood = new Woodcut(ghMain, bg[bgid], "rgb(0,0)",70,10);
  ghWood2 = new Woodcut(ghTree, bg[bgid], "rgb(0,0)",0,7);
  drawNoise(35);
  //-------------------------------

  // imageMode(CENTER);
  let featureStrength = 6.0;
  NY_MountainReady(startMountainY, endMountainY, 1920, 4, featureStrength);
  // artist: 0:CheYu 1:Wen 2:Lien 3:JinYo 4:Oivm
}

function drawMountains() {
  blendMode(BLEND);
  background(bg[bgid]);
  image(ghMain, 0, 0, ww, hh);
  image(ghWood, 0, 0, width, height);

  image(ghTree, 0, 0, width, height);
  image(ghWood2, 0, 0, width, height);

  image(ghBird, 0, 0, width, height);
  image(ghFrame, 0, 0, width, height);
  blendMode(MULTIPLY);
  image(ghNoise, 0, 0, width, height);


  NY_FinishDrawMountain();
}

function fxRandomRange(from, to) {
  return fxrand() * (to - from) + from;
}

function NY_MountainReady(mountainStartY, mountainEndY, fullHeight, artistId, featureValue) {
  if (NY_isCollage) {
    let message = {
      'event': 'ready',
      'args': {
        'mountainIndex': NY_mountainIndex,
        'artistId':artistId,
        'startY': mountainStartY,
        'endY': mountainEndY,
        'fullHeight': fullHeight,
        'featureValue': featureValue
      }
    };

    window.top.postMessage(message, '*');
  } else {
    NY_StartDrawMountain(0.0, [], [], [], [], []);
  }
}

function NY_StartDrawMountain(borderWidth, CheYu, Wen, Lien, Jinyao, Oivm) {
  // you should overwrite this function for you own need,
  // the following code is only for demo purpose

  // collab features
  console.log("==== collab features ====");
  console.log(borderWidth);
  console.log(CheYu);
  console.log(Wen);
  console.log(Lien);
  console.log(Jinyao);
  console.log(Oivm);


  drawMountains();

  // let startPoint = mountains[mainMountainIndex].calculateY(0);
  // let endPoint = mountains[mainMountainIndex].calculateY(defultW);
}

function mouseClicked() {
  save(seed + ".png");
}

function NY_FinishDrawMountain() {
  if (NY_isCollage) {
    let message = {
      'event': 'draw_finish',
      'args': {
        'mountainIndex': NY_mountainIndex
      }
    };

    window.top.postMessage(message, '*');
  } else {
    // does nothing
  }
}
