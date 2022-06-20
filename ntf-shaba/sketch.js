// generate mountains
let maxNumber;
let minDistance;
let mPs = [];
let ims = [];

// Trees
let backRoots = [];
let backLeafs = [];
let frontRoots = [];
let frontLeafs = [];
let leafs = [];
let LUs = [];

let backTreeP, frontTreeP;
let drawSmallBackTreeFlag, drawSmallFrontTreeFlag;

// Mountain
let mountainP;
let drawMountainFlag;
let drawMountainNum;
let leftPointX, leftPointY, rightPointX, rightPointY;
let mPs_leftnumber, ims_leftNumber;

// bg
let bg;
let bgKindNumber, bgDrawCount;
let globalAngle;
let bgDrawFlag;

// ink_bg
let ink_bg_up, ink_bg_down;

//front tree
let Rs = [];
let CRsw = [];
let CRsg1 = [];
let CRsg2 = [];
let CRsb = [];
let startGrow, rootCount, rootSizeMax;
let FsBack = [];
let FsFront = [];
let leafBackShowFlag, leafFrontShowFlag;
let rootDir, FsBackLeafCount, FsFrontLeafCount;
let rootGrowDec;
let treeFrontPG, leafFrontPG;
let CRswFlag, CRsg1Flag, CRsg2Flag, CRsbFlag;
let CRswDrawCount, CRsg1DrawCount, CRsg2DrawCount, CRsbDrawCount;


// for test
let allP;

// ship
let S1;
let shipP;
let shipX, shipY, shipRotation;
let shipFlag;

// smoke
let ps = [];
let flowfield = [];
let smokeInc, smokePx, smokePy;
let smokeScl, smokeFrameCount, smokeFrameCountMax;
let smokeP;

// color
let mountainColorR = [],mountainColorG = [],mountainColorB = [];
let bgColorR = [], bgColorG = [], bgColorB = [];
let leafDarkColorR = [],leafDarkColorG = [],leafDarkColorB = [];
let leafLightColorR = [],leafLightColorG = [],leafLightColorB = [];
let randomMountainColorNumber, randomBgColorNumber;
let randomLeafDarkColorNumber, randomLeafLightColorNumber;

// logic state
let logic_state;

// border
let borderP;
let sealPx, sealPy, sealRotateAngle;


// new add
let allW, allH, realW, realH;

function setup() {
  createCanvas(windowHeight*0.5625, windowHeight, WEBGL);
  
  allW = 1080;
  allH = 1920;
  smooth(8);
  
  init_color();
  bgKindNumber = int(shafxrand()*4)+1;
  randomMountainColorNumber = int(shafxrand()*11);
  randomBgColorNumber = int(shafxrand()*14);
  randomLeafDarkColorNumber = int(shafxrand()*15);
  randomLeafLightColorNumber = randomLeafDarkColorNumber;
  
  // border 
  borderP = createGraphics(1080, 1920, WEBGL);
  borderP.translate(-540,-960);
  sealPx = 0;
  sealPy = 0;
  sealRotateAngle = -3+shafxrand()*6;
  
  mountainP = createGraphics(1080, 1920, WEBGL);
  mountainP.translate(-540,-960);
  mountainP.setAttributes('depth', true);
  mountainP.setAttributes('alpha', true);
  mountainP.setAttributes('premultipliedAlpha', true);
  
  // generate mountains
  maxNumber = 25;
  minDistance = 80;
  drawMountainNum = 0;
  
  // Ink_tree
  backTreeP = createGraphics(1080, 1920, P2D);
  frontTreeP = createGraphics(1080, 1920, P2D);

  drawSmallBackTreeFlag = false;
  drawSmallFrontTreeFlag = false;

  loadFile();
  
  leftPointX = -100;
  leftPointY = -100;
  rightPointX = -100;
  rightPointY = -100;
  mPs_leftnumber = 0;
  ims_leftNumber = 0;
  
  // bg
  bg = createGraphics(1080, 1920, P2D);
  //bg.translate(-540,-960);
  globalAngle = shafxrand()*360;
  bgDrawFlag = true;
  initBGCount();
  
  // ink_bg
  ink_bg_up = createGraphics(1080, 1920, P2D);
  ink_bg_down = createGraphics(1080, 1920, P2D);

  // frontTree
  treeFrontPG = createGraphics(1080, 1920, P2D);
  //treeFrontPG.translate(-540,-960);
  startGrow = 0;
  rootCount = 0;
  FsBackLeafCount = 0;
  FsFrontLeafCount = 0;
  frontTreePosition = 0;
  frontTreeCount = 0;

  leafBackShowFlag = false;
  leafFrontShowFlag = false;
  rootDir = -1;
  rootGrowDec = 1;
  rootSizeMax = 40;

  leafFrontPG = createGraphics(1080,1920,P2D);
  CRswFlag = false;
  CRsg1Flag = false;
  CRsg2Flag = false; 
  CRsbFlag = false;
  CRswCount = 0;
  CRsg1Count = 0;
  CRsg2Count = 0;
  CRsbCount = 0;
  
  // ship
  S1 = new Ship();
  shipP = createGraphics(600, 600, P2D);
  S1.drawShip(shipP);
  shipFlag = false;
  
  // smoke
  smokeP = createGraphics(1080, 1920, WEBGL);
  smokeP.translate(-540,-960);
  smokeP.setAttributes('depth', false);
  smokeP.blendMode(ADD);
  smokePx = -100;
  smokePy = -100;
  smokeInc = 0.2;
  smokeScl = 10;
  //smokeScl = 8;
  for(let x = 0; x < allW/smokeScl; x++){
    flowfield[x] = []; // create nested array
    for(let y = 0; y < smokeP.height/smokeScl; y++){
      let localr = noise(float(x)*smokeInc, float(y)*smokeInc, frameCount*0.01);
      let a = p5.Vector.fromAngle(-localr*PI,1);
      flowfield[x][y] = a;
    }
  }

  //ps = new ArrayList<SmokeParticle>();
  smokeFrameCount = 0;
  noiseSeed(int(shafxrand()*100));
  smokeFrameCountMax = 4;

  allP = createGraphics(1080, 1920, WEBGL);
  allP.translate(-540,-960);
  allP.setAttributes('depth', false);
  logic_state = 0;
  
}

function draw() {
  if (logic_state == 0) {
    paintMountain();
    logic_state = 1;
    calLeftRightPoint();
    NY_MountainReady(leftPointY*(height/allP.height), rightPointY*(height/allP.height), windowHeight, 2, 0);
  }
  if (logic_state >= 2) {
    logic_state++;
  }
  if (logic_state == 10) {
    initBorder(borderP);
  }
  if (logic_state > 20) {
    if((leafFrontShowFlag == false)&&(bgDrawFlag == false)) {
      cheng_seal(borderP, sealPx, sealPy);
    }
  }
  
  
  if (bgDrawFlag == true) {
    updateBG();
  }
  for (let i = 0; i < backRoots.length; i++) {
    if (backRoots[i].timeAlpha < 0.5) {
      backRoots.splice(i,1);
    }
  }
  for (let i = 0; i < backLeafs.length; i++) {
    if (backLeafs[i].alpha < 0.5) {
      backLeafs.splice(i,1);
    }
  }
  for (let i = 0; i < frontRoots.length; i++) {
    if (frontRoots[i].timeAlpha < 0.5) {
      frontRoots.splice(i,1);
    }
  }
  for (let i = 0; i < frontLeafs.length; i++) {
    if (frontLeafs[i].alpha < 0.5) {
      frontLeafs.splice(i,1);
    }
  }
  for (let i = 0; i < ims.length; i++) {
    if ( ims[i].mAlpha < 0.5 ) {
      ims.splice(i,1);
    }
  }
  
  
  for (let i = 0; i < backRoots.length; i++) {
    backRoots[i].update_and_draw_Root(backTreeP, 3+shafxrand()*2);
  }
  for (let i = 0; i < backLeafs.length; i++) {
    backLeafs[i].drawLeaf(leafs, backTreeP);
  }
  
  
  if(frameCount %4 == 0){
    if (drawMountainFlag == true) {
      ims[drawMountainNum].drawInkMountain(mountainP, true);
      drawMountainNum++;
      
      if(drawMountainNum == ims.length-3){
         for (let j = 0; j < 16; j++) {
          if (ims.length < 1) {
            break;
        }
      let randomMountainNumber = int(shafxrand()*ims.length);
      if (ims[randomMountainNumber].mAlpha < 128) {
        continue;
      }
      let P = ims[randomMountainNumber].getRandomMountainPoint(2);
      let isInsideMountain = false;
      for (let k = 0; k < ims.length; k++) {
        if (ims[k].isInsideMountain(P.x, P.y) == true) {
          isInsideMountain = true;
          break;
        }
      }
      if (isInsideMountain == true) {
        generateFrontTree(3+shafxrand()*2, P.x, P.y + 5, degrees(P.z)-shafxrand()*20, 0);
      } else {
        generateBackTree(3+shafxrand()*2, P.x, P.y + 10, degrees(P.z)-shafxrand()*20, 0);
      }
    }
  }
      if(drawMountainNum >= ims.length){
         drawMountainFlag = false;
      }
    }
  }
  
  if (drawMountainFlag == false) {
    for (let i = 0; i < frontRoots.length; i++) {
      frontRoots[i].update_and_draw_Root(frontTreeP, 3+shafxrand()*2);
    }
    for (let i = 0; i < frontLeafs.length; i++) {
      frontLeafs[i].drawLeaf(leafs, frontTreeP);
    }
    
    for (let i = 0; i < backRoots.length; i++) {
      if (backRoots[i].growState == false ) {
        backRoots.splice(i,1);
      }
    }
    for (let i = 0; i < backLeafs.length; i++) {
      if (backLeafs[i].drawFlag == false ) {
        backLeafs.splice(i,1);
      }
    }

    for (let i = 0; i < frontRoots.length; i++) {
      if (frontRoots[i].growState == false ) {
        frontRoots.splice(i,1);
      }
    }
    for (let i = 0; i < frontLeafs.length; i++) {
      if (frontLeafs[i].drawFlag == false ) {
        frontLeafs.splice(i,1);
      }
    }
  }
  
  // frontTree
  for (let i = 0; i < Rs.length; i++) {
    Rs[i].updateRoot(FsBack, FsFront);
  }
  for (let i = 0; i < 12; i++) {
    if (leafBackShowFlag == true) {
      FsBack[FsBackLeafCount].drawLeaf(treeFrontPG);
      FsBackLeafCount++;
      if (FsBackLeafCount >= FsBack.length) {
        leafBackShowFlag = false;
      }
    }
  }
  for (let i = 0; i < 12; i++) {
    if (leafFrontShowFlag == true) {
      FsFront[FsFrontLeafCount].drawLeaf(treeFrontPG);
      FsFrontLeafCount++;
      if (FsFrontLeafCount >= FsFront.length) {
        leafFrontShowFlag = false;
      }
    }
  }
  
  for (let i = 0; i < Rs.length; i++) {
    Rs[i].drawRoot(treeFrontPG, CRsw, CRsg1, CRsg2, CRsb);
  }
  for (let i = 0; i < Rs.length; i++) {
    if (Rs[i].r <= 4.99) {
      let x = Rs[i].x;
      let y = Rs[i].y;
      recursionCircle(FsBack, FsFront, x, y, 100, 5);
      Rs.splice(i,1);
    }
  }
      
      if(CRswFlag == true){
        for(let i = 0; i < 12; i++){
          CRsw[CRswCount].drawColorRoot(treeFrontPG);
          CRswCount++;
          if(CRswCount >= CRsw.length){
            CRsw.splice(0 , CRsw.length);
            CRswFlag = false;
            CRsg1Flag = true;
            break;
          }
        }
      }
      if(CRsg1Flag == true){
        for(let i = 0; i < 12; i++){
          CRsg1[CRsg1Count].drawColorRoot(treeFrontPG);
          CRsg1Count++;
          if(CRsg1Count >= CRsg1.length){
            CRsg1.splice(0,CRsg1.length);
            CRsg1Flag = false;
            CRsg2Flag = true;
            break;
          }
        }
      }
      
      if(CRsg2Flag == true){
        for(let i = 0; i < 12; i++){
          CRsg2[CRsg2Count].drawColorRoot(treeFrontPG);
          CRsg2Count++;
          if(CRsg2Count >= CRsg2.length){
            CRsg2.splice(0,CRsg2.length);
            CRsg2Flag = false;
            CRsbFlag = true;
            break;
          }
        }
      }
  
      if(CRsbFlag == true){
        for(let i = 0; i < 12; i++){
          CRsb[CRsbCount].drawColorRoot(treeFrontPG);
          CRsbCount++;
          if(CRsbCount >= CRsb.length){
            CRsb.splice(0,CRsb.length);
            CRsbFlag = false;
            leafBackShowFlag = true;
            leafFrontShowFlag = true;
            break;
          }
        }
        
      }

  if (startGrow == 1) {
    if (Rs.length == 0) {
      CRswFlag = true;
      startGrow = 0;
    }
  }
  
  // for nextstep
  if(drawMountainFlag == false){
    if (logic_state == 1) {
      paintBG();
      logic_state = 2;
    }
  }
  if(frameCount > 100){
    if(shipFlag == false){
      let tempShipX = 200+shafxrand()*(mountainP.width-400);
      let tempShipY = 400+shafxrand()*(mountainP.height-800);
      if(tempShipY > mountainP.height*0.6){
         if(frontTreePosition == -1){
            tempShipX = mountainP.width*0.6+shafxrand()*(mountainP.width-200-mountainP.width*0.6);
         }else{
           tempShipX = 200+shafxrand()*(mountainP.width*0.4-200);
         }
      }
      let tempShowFlag = true;
      for(let i = 0; i < ims.length; i++){
        if(ims[i].isInsideMountain_forShip(tempShipX,tempShipY) == true){
          tempShowFlag = false;
          break;
        }
      }
      if(tempShowFlag == true){
         shipFlag = true;
      }
      
      print('shipFlag:'+shipFlag);
      if(shipFlag == true){
        shipX = tempShipX;
        shipY = tempShipY;
      }
    }
  }
  
  allP.background(255);
  allP.imageMode(CORNER);
  allP.image(bg, 0, 0, allP.width, allP.height);

  allP.image(backTreeP, 0, 0, allP.width, allP.height);
  if (shipFlag == true) {
    allP.push();
    allP.translate(shipX, shipY);
    allP.imageMode(CENTER);
    allP.image(shipP, 0, 0, 
      sqrt(shipY)*10, sqrt(shipY)*10);
    allP.imageMode(CORNER);
    allP.pop();
  }
  allP.image(ink_bg_up, 0, 0, allP.width, allP.height);
  allP.image(mountainP, 0, 0, allP.width, allP.height);
  //allP.blendMode(ADD);
  allP.image(smokeP, 0, 0, allP.width, allP.height);
  //allP.blendMode(BLEND);
  allP.image(frontTreeP, 0, 0, allP.width, allP.height);
  allP.image(ink_bg_down, 0, 0, allP.width, allP.height);


  allP.image(treeFrontPG, 0, 0, allP.width, allP.height);
  allP.image(leafFrontPG,0, 0, allP.width, allP.height);
  allP.image(borderP, 0, 0, allP.width, allP.height);
  
  
  if(frameCount % 30 == 0){
     //print(frameRate());
  }
  translate(-windowHeight*0.5625*0.5, -windowHeight*0.5);
  image(allP, 0, 0, width, height);
  
  
  fill(0,0,255);
  ellipse(leftPointX*(width/allP.width),leftPointY*(height/allP.height),5,5);
  ellipse(rightPointX*(width/allP.width),rightPointY*(height/allP.height),5,5);
  
  //background(225, 0, 0);
}


function keyPressed(){
  if(key == 's'){
     saveCanvas(allP, 'Ink_mountain.jpg');
     }
}

// rand
function shafxrand(){
  return random(1);
}


// ==================================
// GradientLine
// ==================================

function Gradientl2c(_P, _px1, _py1, _r1, _g1, _b1, _a1, _px2, _py2, _r2, _g2, _b2, _a2, _w){
  let d = sqrt(sq(_px1-_px2)+sq(_py1-_py2));
  let shift = (_w/d)*0.5;
  for(let t = 0; t < 1-shift; t = t + shift){
    let px1 = _px1 + t*(_px2-_px1);
    let py1 = _py1 + t*(_py2-_py1);
    let px2 = _px1 + (t+shift)*(_px2-_px1);
    let py2 = _py1 + (t+shift)*(_py2-_py1);
    
    let r = int(_r1 + t*(_r2-_r1));
    let g = int(_g1 + t*(_g2-_g1));
    let b = int(_b1 + t*(_b2-_b1));
    let a = int(_a1 + t*(_a2-_a1));
    
    _P.fill(r,g,b,a);
    _P.noStroke();
    //fill(strokeColor);
    _P.ellipse(px1,py1,_w*(1+shafxrand()*0.5),_w*(1+shafxrand()*0.5));
    //line(px1, py1, px2, py2);
    //point(px1,py1);
  }
}

function GradientLine3(_P, _px1, _py1, _pz1, _r1, _g1, _b1, _a1, _px2, _py2, _pz2, _r2, _g2, _b2, _a2, _w){
  
  let shift = 0.05;
  for(let t = 0; t <= 1; t = t + shift){
    let px1 = _px1 + t*(_px2-_px1);
    let py1 = _py1 + t*(_py2-_py1);
    let pz1 = _pz1 + t*(_pz2-_pz1);
    
    let px2 = _px1 + (t+shift)*(_px2-_px1);
    let py2 = _py1 + (t+shift)*(_py2-_py1);
    let pz2 = _pz1 + (t+shift)*(_pz2-_pz1);
    
    
    let r = int(_r1 + t*(_r2-_r1));
    let g = int(_g1 + t*(_g2-_g1));
    let b = int(_b1 + t*(_b2-_b1));
    let a = int(_a1 + t*(_a2-_a1));
    
    let strokeColor = '#'+ hex(r*pow(16,6)+g*pow(16,4)+b*pow(16,2)+a);
    //stroke(r,g,b);
    _P.strokeWeight(_w);
    _P.stroke(strokeColor);
    _P.line(px1, py1, pz1, px2, py2, pz2);
    //point(px1,py1);
  }
}

function GradientLine(_P, _px1, _py1, _r1, _g1, _b1, _a1, _px2, _py2, _r2, _g2, _b2, _a2, _w){
  
  let shift = 0.05;
  for(let t = 0; t <= 1; t = t + shift){
    let px1 = _px1 + t*(_px2-_px1);
    let py1 = _py1 + t*(_py2-_py1);
    let px2 = _px1 + (t+shift)*(_px2-_px1);
    let py2 = _py1 + (t+shift)*(_py2-_py1);
    
    let r = int(_r1 + t*(_r2-_r1));
    let g = int(_g1 + t*(_g2-_g1));
    let b = int(_b1 + t*(_b2-_b1));
    let a = int(_a1 + t*(_a2-_a1));
    
    let strokeColor = '#'+ hex(r*pow(16,6)+g*pow(16,4)+b*pow(16,2)+a);
    //stroke(r,g,b);
    _P.strokeWeight(_w);
    _P.stroke(strokeColor);
    _P.line(px1, py1, px2, py2);
    //point(px1,py1);
  }
}


// ==================================
// Ink_Mountain
// ==================================
class Ink_Mountain {
  constructor(
    enterMPx,
    enterMPy,
    enterMW,
    enterMH,
    enterRandomMountainPointProbality,
    enterMLeftPeakProportion,
    enterMRightPeakProportion,
    decA,
    _centerColorR,
    _centerColorG,
    _centerColorB
  ) {
    this.mPx = enterMPx;
    this.mPy = enterMPy;
    this.mW = enterMW;
    this.mH = enterMH;

    this.mPoints0 = [];
    this.mPoints1 = [];
    this.mPoints2 = [];

    this.mPoints3 = [];
    this.mPoints4 = [];
    this.mPoints5 = [];
    this.mPoints6 = [];
    this.mPoints7 = [];
    this.mPoints8 = [];
    this.mPoints9 = [];
    this.mPoints10 = [];

    this.randomMountainPointProbality = enterRandomMountainPointProbality;
    this.mLeft_peak_proportion = enterMLeftPeakProportion;
    this.mRight_peak_proportion = enterMRightPeakProportion;

    this.mShiftCPx = -this.mW*0.3+shafxrand()*this.mW*0.6;
    this.mShiftCPy = -this.mH*0.1+shafxrand()*(this.mW*0.1+this.mH*0.1);

    this.centerColorR = _centerColorR;
    this.centerColorG = _centerColorG;
    this.centerColorB = _centerColorB;
      
    //this.leftColorR = 230;
    //this.leftColorG = 230;
    //this.leftColorB = 230;
    this.leftColorR = sqrt(_centerColorR+1)*13;
    this.leftColorG = sqrt(_centerColorG+1)*13;
    this.leftColorB = sqrt(_centerColorB+1)*13;

      
    //this.rightColorR = 230;
    //this.rightColorG = 230;
    //this.rightColorB = 230;
      
    this.rightColorR = sqrt(_centerColorR+1)*13;
    this.rightColorG = sqrt(_centerColorG+1)*13;
    this.rightColorB = sqrt(_centerColorB+1)*13;

    this.proportionLength = 0.8+shafxrand()*0.4;
      
    let tempStrokeColor = int(10+shafxrand()*90);
    this.strokeColorR = tempStrokeColor;
    this.strokeColorG = tempStrokeColor;
    this.strokeColorB = tempStrokeColor;
      
    this.mAlpha = 255;
    this.mDecAlpha = decA;

    // for p5js initial
    this.randomMountainPointProbality = 0;
    this.tempLeftPxShift = 0;
    this.tempLeftPyShift = 0;
    this.tempLeftPx = 0;
    this.tempLeftPy = 0;
    this.tempRightPxShift = 0;
    this.tempRightPyShift = 0;
    this.tempRightPx = 0;
    this.tempRightPy = 0;
      
    this.drawFlag = false;
  }

  releaseMountain() {
    this.mPoints0.splice(0, this.mPoints0.length);
    this.mPoints1.splice(0, this.mPoints1.length);

    this.mPoints2.splice(0, this.mPoints2.length);

    this.mPoints3.splice(0, this.mPoints3.length);
    this.mPoints4.splice(0, this.mPoints4.length);
    this.mPoints5.splice(0, this.mPoints5.length);
    this.mPoints6.splice(0, this.mPoints6.length);
    this.mPoints7.splice(0, this.mPoints7.length);
    this.mPoints8.splice(0, this.mPoints8.length);
    this.mPoints9.splice(0, this.mPoints9.length);
    this.mPoints10.splice(0, this.mPoints10.length);
  }

  sumOfLeftDownPoint(_P) {
    let sum = 0;
    for (let i = 0; i < this.mPoints2.length; i++) {
      let x = this.mPoints2[i].x;
      let y = this.mPoints2[i].y;
      sum = sum + dist(0, _P.height, x, y);
    }
    return sum;
  }

  sumOfRightDownPoint(_P) {
    let sum = 0;
    for (let i = 0; i < this.mPoints2.length; i++) {
      let x = this.mPoints2[i].x;
      let y = this.mPoints2[i].y;
      sum = sum + dist(allW, allH, x, y);
    }
    return sum;
  }

  generate_a_lof_of_point_mountain() {
    let keepValue = 0;
    for (let t = 0; t <= 1; ) {
      let randomTadd = 0.2+shafxrand()*0.1;
      t = t + randomTadd;
      if (t > 1) {
        keepValue = t - 1;
        break;
      }
      let x = float(curvePoint(
        this.mPx - this.mW/2.0,
        this.mPx - this.mW/2.0,
        this.mPx - (this.mW/2.0)*(-this.mLeft_peak_proportion),
        this.mPx + (this.mW/2.0)*(-this.mRight_peak_proportion),
        t));
      let y = float(curvePoint(
        this.mPy,
        this.mPy,
        this.mPy - this.mH,
        this.mPy - this.mH,
        t
      ));
      let tx = float(curveTangent(
        this.mPx - this.mW / 2.0,
        this.mPx - this.mW / 2.0,
        this.mPx - (this.mW / 2.0) * -this.mLeft_peak_proportion,
        this.mPx + (this.mW / 2.0) * -this.mRight_peak_proportion,
        t
      ));
      let ty = float(curveTangent(
        this.mPy,
        this.mPy,
        this.mPy - this.mH,
        this.mPy - this.mH,
        t
      ));
      let a = atan2(ty, tx);
      if (shafxrand()*2 > 1) {
        a -= PI / 2.0;
      } else {
        a += PI / 2.0;
      }

      this.mPoints2.push(
        new mountainPoint(
          cos(a) * (this.mW + this.mH) * shafxrand()*0.03 + x,
          sin(a) * (this.mW + this.mH) * shafxrand()*0.03 + y,
          int(200+shafxrand()*55), 0, 0, int(230+shafxrand()*25)));

      a = atan2(ty, tx);
      a -= PI / 2.0;

      this.mPoints0.push(
        new mountainPoint(
          this.mPoints2[this.mPoints2.length - 1].x - cos(a) * 4,
          this.mPoints2[this.mPoints2.length - 1].y - sin(a) * 4,
          int(shafxrand()*100),0,0,0));
      this.mPoints1.push(
        new mountainPoint(
          this.mPoints2[this.mPoints2.length - 1].x - cos(a) * 2,
          this.mPoints2[this.mPoints2.length - 1].y - sin(a) * 2,
          int(100+shafxrand()*100),0,0,0));

      this.mPoints3.push(
        new mountainPoint(
          this.mPoints2[this.mPoints2.length - 1].x + cos(a) * 2,
          this.mPoints2[this.mPoints2.length - 1].y + sin(a) * 2,
          int(175+shafxrand()*25),0,0,0));
      this.mPoints4.push(
        new mountainPoint(
          this.mPoints2[this.mPoints2.length - 1].x + cos(a) * 4,
          this.mPoints2[this.mPoints2.length - 1].y + sin(a) * 4,
          int(150+shafxrand()*25),0,0,0));
      this.mPoints5.push(
        new mountainPoint(
          this.mPoints2[this.mPoints2.length - 1].x + cos(a) * 6,
          this.mPoints2[this.mPoints2.length - 1].y + sin(a) * 6,
          int(125+shafxrand()*25),0,0,0));
      this.mPoints6.push(
        new mountainPoint(
          this.mPoints2[this.mPoints2.length - 1].x + cos(a) * 8,
          this.mPoints2[this.mPoints2.length - 1].y + sin(a) * 8,
          int(100+shafxrand()*25),0,0,0));
      this.mPoints7.push(
        new mountainPoint(
          this.mPoints2[this.mPoints2.length - 1].x + cos(a) * 10,
          this.mPoints2[this.mPoints2.length - 1].y + sin(a) * 10,
          int(75+shafxrand()*25),0,0,0));
      this.mPoints8.push(
        new mountainPoint(
          this.mPoints2[this.mPoints2.length - 1].x + cos(a) * 12,
          this.mPoints2[this.mPoints2.length - 1].y + sin(a) * 12,
          int(50+shafxrand()*25),0,0,0));
      this.mPoints9.push(
        new mountainPoint(
          this.mPoints2[this.mPoints2.length - 1].x + cos(a) * 14,
          this.mPoints2[this.mPoints2.length - 1].y + sin(a) * 14,
          int(25+shafxrand()*25),0,0,0));
      this.mPoints10.push(
        new mountainPoint(
          this.mPoints2[this.mPoints2.length - 1].x + cos(a) * 16,
          this.mPoints2[this.mPoints2.length - 1].y + sin(a) * 16,
          int(shafxrand()*25),0,0,0));
    }
    let keepFlag = false;
    for (let t = 0; t <= 1; ) {
      let randomTadd = 0.2+shafxrand()*0.1;
      if (keepFlag == false) {
        t = keepValue;
        keepFlag = true;
      } else {
        t = t + randomTadd;
      }
      if (t > 1) {
        keepValue = t - 1;
        break;
      }
      let x = curvePoint(
        this.mPx - this.mW / 2,
        this.mPx - (this.mW / 2) * -this.mLeft_peak_proportion,
        this.mPx + (this.mW / 2) * -this.mRight_peak_proportion,
        this.mPx + this.mW / 2,t);
      let y = curvePoint(
        this.mPy,
        this.mPy - this.mH,
        this.mPy - this.mH,
        this.mPy,t);
      let tx = curveTangent(
        this.mPx - this.mW / 2,
        this.mPx - (this.mW / 2) * -this.mLeft_peak_proportion,
        this.mPx + (this.mW / 2) * -this.mRight_peak_proportion,
        this.mPx + this.mW / 2,t);
      let ty = curveTangent(
        this.mPy,
        this.mPy - this.mH,
        this.mPy - this.mH,
        this.mPy,t);
      let a = atan2(ty, tx);
      if (shafxrand()*2 > 1) {
        a -= PI / 2.0;
      } else {
        a += PI / 2.0;
      }
      this.mPoints2.push(
        new mountainPoint(
          cos(a) * (this.mW + this.mH) * shafxrand()*0.01 + x,
          sin(a) * (this.mW + this.mH) * shafxrand()*0.01 + y,
          int(200+shafxrand()*55),0,0,int(230+shafxrand()*25)));

      a = atan2(ty, tx);
      a -= PI / 2.0;

      this.mPoints0.push(
        new mountainPoint(
          this.mPoints2[this.mPoints2.length - 1].x - cos(a) * 4,
          this.mPoints2[this.mPoints2.length - 1].y - sin(a) * 4,
          int(shafxrand()*100),0,0,0));
      this.mPoints1.push(
        new mountainPoint(
          this.mPoints2[this.mPoints2.length - 1].x - cos(a) * 2,
          this.mPoints2[this.mPoints2.length - 1].y - sin(a) * 2,
          int(100+shafxrand()*100),0,0,0));
      this.mPoints3.push(
        new mountainPoint(
          this.mPoints2[this.mPoints2.length - 1].x + cos(a) * 2,
          this.mPoints2[this.mPoints2.length - 1].y + sin(a) * 2,
          int(175+shafxrand()*25),0,0,0));
      this.mPoints4.push(
        new mountainPoint(
          this.mPoints2[this.mPoints2.length - 1].x + cos(a) * 4,
          this.mPoints2[this.mPoints2.length - 1].y + sin(a) * 4,
          int(150+shafxrand()*25),0,0,0));
      this.mPoints5.push(
        new mountainPoint(
          this.mPoints2[this.mPoints2.length - 1].x + cos(a) * 6,
          this.mPoints2[this.mPoints2.length - 1].y + sin(a) * 6,
          int(125+shafxrand()*150),0,0,0));
      this.mPoints6.push(
        new mountainPoint(
          this.mPoints2[this.mPoints2.length - 1].x + cos(a) * 8,
          this.mPoints2[this.mPoints2.length - 1].y + sin(a) * 8,
          int(100+shafxrand()*25),0,0,0));
      this.mPoints7.push(
        new mountainPoint(
          this.mPoints2[this.mPoints2.length - 1].x + cos(a) * 10,
          this.mPoints2[this.mPoints2.length - 1].y + sin(a) * 10,
          int(75+shafxrand()*25),0,0,0));
      this.mPoints8.push(
        new mountainPoint(
          this.mPoints2[this.mPoints2.length - 1].x + cos(a) * 12,
          this.mPoints2[this.mPoints2.length - 1].y + sin(a) * 12,
          int(50+shafxrand()*25),0,0,0));
      this.mPoints9.push(
        new mountainPoint(
          this.mPoints2[this.mPoints2.length - 1].x + cos(a) * 14,
          this.mPoints2[this.mPoints2.length - 1].y + sin(a) * 14,
          int(25+shafxrand()*25),0,0,0));
      this.mPoints10.push(
        new mountainPoint(
          this.mPoints2[this.mPoints2.length - 1].x + cos(a) * 16,
          this.mPoints2[this.mPoints2.length - 1].y + sin(a) * 16,
          int(shafxrand()*25),0,0,0));
    }
    keepFlag = false;
    for (let t = 0; t <= 1; ) {
      let randomTadd = 0.2+shafxrand()*0.1;
      if (keepFlag == false) {
        t = keepValue;
        keepFlag = true;
      } else {
        t = t + randomTadd;
      }
      if (t > 1) {
        keepValue = t - 1;
        break;
      }
      let x = curvePoint(
        this.mPx - (this.mW / 2) * -this.mLeft_peak_proportion,
        this.mPx + (this.mW / 2) * -this.mRight_peak_proportion,
        this.mPx + this.mW / 2,
        this.mPx + this.mW / 2,t);
      let y = curvePoint(
        this.mPy - this.mH,
        this.mPy - this.mH,
        this.mPy,this.mPy,t);
      let tx = curveTangent(
        this.mPx - (this.mW / 2) * -this.mLeft_peak_proportion,
        this.mPx + (this.mW / 2) * -this.mRight_peak_proportion,
        this.mPx + this.mW / 2,
        this.mPx + this.mW / 2,t);
      let ty = curveTangent(
        this.mPy - this.mH,
        this.mPy - this.mH,
        this.mPy,this.mPy,t);
      let a = atan2(ty, tx);
      if (shafxrand()*2 > 1) {
        a -= PI / 2.0;
      } else {
        a += PI / 2.0;
      }

      this.mPoints2.push(
        new mountainPoint(
          cos(a) * (this.mW + this.mH) * shafxrand()*0.01 + x,
          sin(a) * (this.mW + this.mH) * shafxrand()*0.01 + y,
          int(200+shafxrand()*55),0,0,int(230+shafxrand()*25)));
      a = atan2(ty, tx);
      a -= PI / 2.0;

      this.mPoints0.push(
        new mountainPoint(
          this.mPoints2[this.mPoints2.length - 1].x - cos(a) * 4,
          this.mPoints2[this.mPoints2.length - 1].y - sin(a) * 4,
          int(shafxrand()*100),0,0,0));
      this.mPoints1.push(
        new mountainPoint(
          this.mPoints2[this.mPoints2.length - 1].x - cos(a) * 2,
          this.mPoints2[this.mPoints2.length - 1].y - sin(a) * 2,
          int(100+shafxrand()*100),0,0,0));
      this.mPoints3.push(
        new mountainPoint(
          this.mPoints2[this.mPoints2.length - 1].x + cos(a) * 2,
          this.mPoints2[this.mPoints2.length - 1].y + sin(a) * 2,
          int(175+shafxrand()*25),0,0,0));
      this.mPoints4.push(
        new mountainPoint(
          this.mPoints2[this.mPoints2.length - 1].x + cos(a) * 4,
          this.mPoints2[this.mPoints2.length - 1].y + sin(a) * 4,
          int(150+shafxrand()*25),0,0,0));
      this.mPoints5.push(
        new mountainPoint(
          this.mPoints2[this.mPoints2.length - 1].x + cos(a) * 6,
          this.mPoints2[this.mPoints2.length - 1].y + sin(a) * 6,
          int(125+shafxrand()*25),0,0,0));
      this.mPoints6.push(
        new mountainPoint(
          this.mPoints2[this.mPoints2.length - 1].x + cos(a) * 8,
          this.mPoints2[this.mPoints2.length - 1].y + sin(a) * 8,
          int(100+shafxrand()*25),0,0,0));
      this.mPoints7.push(
        new mountainPoint(
          this.mPoints2[this.mPoints2.length - 1].x + cos(a) * 10,
          this.mPoints2[this.mPoints2.length - 1].y + sin(a) * 10,
          int(75+shafxrand()*25),0,0,0));
      this.mPoints8.push(
        new mountainPoint(
          this.mPoints2[this.mPoints2.length - 1].x + cos(a) * 12,
          this.mPoints2[this.mPoints2.length - 1].y + sin(a) * 12,
          int(50+shafxrand()*25),0,0,0));
      this.mPoints9.push(
        new mountainPoint(
          this.mPoints2[this.mPoints2.length - 1].x + cos(a) * 14,
          this.mPoints2[this.mPoints2.length - 1].y + sin(a) * 14,
          int(25+shafxrand()*25),0,0,0));
      this.mPoints10.push(
        new mountainPoint(
          this.mPoints2[this.mPoints2.length - 1].x + cos(a) * 16,
          this.mPoints2[this.mPoints2.length - 1].y + sin(a) * 16,
          int(shafxrand()*25),0,0,0));
    }

    this.tempLeftPxShift = abs(this.mPx - this.mW / 2 - this.mPoints2[0].x);
    this.tempLeftPyShift = abs(this.mPy - this.mPoints2[0].y);
    this.tempLeftPx =
      this.mPx -this.mW / 2 -
      this.tempLeftPxShift - shafxrand()*this.tempLeftPxShift;
    this.tempLeftPy =
      this.mPy + this.tempLeftPyShift + shafxrand()*this.tempLeftPyShift;
    this.tempRightPxShift = abs(
      this.mPx + this.mW / 2 - this.mPoints2[this.mPoints2.length - 1].x
    );
    this.tempRightPyShift = abs(
      this.mPy - this.mPoints2[this.mPoints2.length - 1].y
    );
    this.tempRightPx =
      this.mPx +this.mW / 2 +
      this.tempRightPxShift +shafxrand()*this.tempRightPxShift;
    this.tempRightPy =
      this.mPy + this.tempRightPyShift + shafxrand()*this.tempRightPyShift;

  }

  generateInnerPoints() {
    let randomPointNumber = int(shafxrand()*this.mPoints2.length);
    let tempPx = this.mPoints2[randomPointNumber].x;
    let tempPy = this.mPoints2[randomPointNumber].y;
    let randomProportion = shafxrand()*0.9;
    let innerPx = tempPx * randomProportion + this.mPx * (1 - randomProportion);
    let innerPy = tempPy * randomProportion + this.mPy * (1 - randomProportion);
    let P = new createVector(innerPx, innerPy);
    return P;
  }
  
  drawInkMountainViaPoint(){
    this.drawFlag = true;
  }
  
  drawInkMountain(P, displayMode) {
    if (displayMode == true) {
      P.noStroke();
      P.beginShape(TRIANGLE_FAN);
      P.fill(this.centerColorR, this.centerColorG, this.centerColorB, this.mAlpha);
      P.vertex(this.mPx + this.mShiftCPx, this.mPy);
      P.fill(this.leftColorR,this.leftColorG,this.leftColorB, this.mAlpha * 0.7);
      P.vertex(this.mPx - this.mW / 2, this.mPy);
      for (let i = 0; i < this.mPoints2.length; i++) {
        P.fill(this.mPoints2[i].fillColor, this.mPoints2[i].fillColor, this.mPoints2[i].fillColor, this.mAlpha * 0.7);
        P.vertex(this.mPoints2[i].x, this.mPoints2[i].y);
      }
      P.fill(this.rightColorR, this.rightColorG, this.rightColorB, this.mAlpha * 0.7);
      P.vertex(this.mPx + this.mW / 2, this.mPy);
      P.fill(this.centerColorR, this.centerColorG, this.centerColorB, this.mAlpha * 0.7);
      P.vertex(this.mPx + this.mShiftCPx, this.mPy);
      P.endShape();

      P.noStroke();
      P.beginShape();
      P.fill(this.leftColorR,this.leftColorG,this.leftColorB, this.mAlpha * 0.7);
      P.vertex(this.mPx - this.mW / 2, this.mPy);
      P.fill(this.centerColorR, this.centerColorG, this.centerColorB, this.mAlpha * 0.7);
      P.vertex(this.mPx + this.mShiftCPx, this.mPy);
      P.fill(this.centerColorR, this.centerColorG, this.centerColorB, 0);
      P.vertex(this.mPx + this.mShiftCPx,
        this.mPy + this.mH * this.proportionLength);
      P.fill(this.leftColorR, this.leftColorG, this.leftColorB, 0);
      P.vertex(this.mPx - this.mW / 2,
        this.mPy + this.mH * this.proportionLength);
      P.endShape();

      P.beginShape();
      P.fill(this.centerColorR, this.centerColorG, this.centerColorB, this.mAlpha * 0.7);
      P.vertex(this.mPx + this.mShiftCPx, this.mPy);
      P.fill(this.rightColorR, this.rightColorG, this.rightColorB, this.mAlpha * 0.7);
      P.vertex(this.mPx + this.mW / 2, this.mPy);
      P.fill(this.rightColorR, this.rightColorG, this.rightColorB, 0);
      P.vertex(this.mPx + this.mW / 2,
        this.mPy + this.mH * this.proportionLength);
      P.fill(this.centerColorR, this.centerColorG, this.centerColorB, 0);
      P.vertex(this.mPx + this.mShiftCPx,
        this.mPy + this.mH * this.proportionLength);
      P.endShape();
    }

    Gradientl2c(P,this.tempLeftPx, this.tempLeftPy,
                 this.strokeColorR,this.strokeColorG,this.strokeColorB, 0,
                 this.mPx - this.mW / 2, this.mPy,
                 this.strokeColorR,this.strokeColorG,this.strokeColorB, (150* this.mAlpha)/255,2);
    Gradientl2c(P, this.mPx - this.mW / 2, this.mPy, 
                 this.strokeColorR,this.strokeColorG,this.strokeColorB, (150* this.mAlpha)/255,
                 this.mPoints2[0].x, this.mPoints2[0].y, 
                 this.strokeColorR,this.strokeColorG,this.strokeColorB, 
                 (this.mPoints2[0].strokeAlpha*this.mAlpha)/255,2);
    
    
    for (let i = 0; i < this.mPoints2.length-1; i++) {      
      Gradientl2c(P,this.mPoints2[i].x, this.mPoints2[i].y,
                  this.strokeColorR,this.strokeColorG,this.strokeColorB, 
                   (this.mPoints2[i].strokeAlpha*this.mAlpha)/255,
                  this.mPoints2[i+1].x, this.mPoints2[i+1].y,
                  this.strokeColorR,this.strokeColorG,this.strokeColorB, 
                   (this.mPoints2[i+1].strokeAlpha*this.mAlpha)/255,2);
    }
    Gradientl2c(P,this.mPoints2[this.mPoints2.length-1].x,
                 this.mPoints2[this.mPoints2.length-1].y,
                 this.strokeColorR,this.strokeColorG,this.strokeColorB, 
                 (this.mPoints2[this.mPoints2.length-1].strokeAlpha*this.mAlpha)/255,
                  this.mPx + this.mW/2, this.mPy,
                  this.strokeColorR,this.strokeColorG,this.strokeColorB,(150*this.mAlpha)/255,2);
    Gradientl2c(P,this.mPx + this.mW/2, this.mPy,
                 this.strokeColorR,this.strokeColorG,this.strokeColorB, (150*this.mAlpha)/255,
                  this.tempRightPx, this.tempRightPy,
                  this.strokeColorR, this.strokeColorG, this.strokeColorB, 0, 2);
    
    if (displayMode == true) {  
      Gradientl2c(P,this.tempLeftPx,this.tempLeftPy, 
                  this.strokeColorR,this.strokeColorG, this.strokeColorB, 0,
                  this.mPoints3[0].x, this.mPoints3[0].y,
                  this.strokeColorR, this.strokeColorG, this.strokeColorB, 
                   (this.mPoints3[0].strokeAlpha * this.mAlpha) / 255,2);
      
      
      for (let i = 0; i < this.mPoints3.length-1; i++) {
        Gradientl2c(P, this.mPoints3[i].x, this.mPoints3[i].y, 
                    this.strokeColorR, this.strokeColorG, this.strokeColorB,
                     (this.mPoints3[i].strokeAlpha * this.mAlpha) / 255, 
                    this.mPoints3[i+1].x, this.mPoints3[i+1].y, 
                    this.strokeColorR, this.strokeColorG, this.strokeColorB,
                     (this.mPoints3[i+1].strokeAlpha * this.mAlpha) / 255,2);
      }
      Gradientl2c(P, this.mPoints3[this.mPoints3.length-1].x, 
                   this.mPoints3[this.mPoints3.length-1].y, 
                   this.strokeColorR, this.strokeColorG, this.strokeColorB,
                     (this.mPoints3[this.mPoints3.length-1].strokeAlpha*this.mAlpha)/255,
                   this.tempRightPx,this.tempRightPy,
                   this.strokeColorR, this.strokeColorG, this.strokeColorB, 0,2);

      Gradientl2c(P, this.tempLeftPx, this.tempLeftPy,
                   this.strokeColorR, this.strokeColorG, this.strokeColorB, 0,
                   this.mPoints4[0].x, this.mPoints4[0].y,
                   this.strokeColorR, this.strokeColorG, this.strokeColorB, 
                   (this.mPoints4[0].strokeAlpha * this.mAlpha) / 255,2);
      
      for (let i = 0; i < this.mPoints4.length-1; i++) {
        Gradientl2c(P,this.mPoints4[i].x, this.mPoints4[i].y,
                    this.strokeColorR, this.strokeColorG, this.strokeColorB, 
                     (this.mPoints4[i].strokeAlpha * this.mAlpha) / 255,
                    this.mPoints4[i+1].x, this.mPoints4[i+1].y,
                    this.strokeColorR, this.strokeColorG, this.strokeColorB, 
                     (this.mPoints4[i+1].strokeAlpha * this.mAlpha) / 255,2);
      }
      
      Gradientl2c(P,this.mPoints4[this.mPoints4.length-1].x, 
                   this.mPoints4[this.mPoints4.length-1].y,
                    this.strokeColorR, this.strokeColorG, this.strokeColorB, 
                     (this.mPoints4[this.mPoints4.length-1].strokeAlpha*this.mAlpha)/255,
                   this.tempRightPx, this.tempRightPy,
                   this.strokeColorR, this.strokeColorG, this.strokeColorB, 0,2);

      Gradientl2c(P, this.tempLeftPx,this.tempLeftPy,
                   this.strokeColorR, this.strokeColorG, this.strokeColorB, 0,
                   this.mPoints5[0].x, this.mPoints5[0].y,
                   this.strokeColorR, this.strokeColorG, this.strokeColorB,
                   (this.mPoints5[0].strokeAlpha * this.mAlpha) / 255,2);
      
      for (let i = 0; i < this.mPoints5.length-1; i++) {
        Gradientl2c(P, this.mPoints5[i].x, this.mPoints5[i].y,
                     this.strokeColorR, this.strokeColorG, this.strokeColorB,
                     (this.mPoints5[i].strokeAlpha * this.mAlpha) / 255,
                     this.mPoints5[i+1].x, this.mPoints5[i+1].y,
                     this.strokeColorR, this.strokeColorG, this.strokeColorB,
                     (this.mPoints5[i+1].strokeAlpha * this.mAlpha) / 255,2);
      }
            
      Gradientl2c(P, this.mPoints5[this.mPoints5.length-1].x, 
                   this.mPoints5[this.mPoints5.length-1].y,
                     this.strokeColorR, this.strokeColorG, this.strokeColorB,
                     (this.mPoints5[this.mPoints5.length-1].strokeAlpha * this.mAlpha) / 255,
                   this.tempRightPx, this.tempRightPy,
                  this.strokeColorR, this.strokeColorG, this.strokeColorB, 0,2);

      Gradientl2c(P, this.tempLeftPx,this.tempLeftPy,
                   this.strokeColorR,this.strokeColorG, this.strokeColorB, 0,
                   this.mPoints6[0].x, this.mPoints6[0].y,
                   this.strokeColorR, this.strokeColorG, this.strokeColorB, 
                   this.mPoints6[0].strokeAlpha,2);
      
      for (let i = 0; i < this.mPoints6.length-1; i++) {
        Gradientl2c(P, this.mPoints6[i].x, this.mPoints6[i].y,
                     this.strokeColorR, this.strokeColorG, this.strokeColorB,
                     this.mPoints6[i].strokeAlpha,
                     this.mPoints6[i+1].x, this.mPoints6[i+1].y,
                     this.strokeColorR, this.strokeColorG, this.strokeColorB,
                     this.mPoints6[i+1].strokeAlpha,2);
      }
      Gradientl2c(P, this.mPoints6[this.mPoints6.length-1].x, 
                   this.mPoints6[this.mPoints6.length-1].y,
                     this.strokeColorR, this.strokeColorG, this.strokeColorB,
                     this.mPoints6[this.mPoints6.length-1].strokeAlpha,
                   this.tempRightPx, this.tempRightPy,
                   this.strokeColorR, this.strokeColorG, this.strokeColorB, 0,2);
      Gradientl2c(P, this.tempLeftPx,this.tempLeftPy,
                   this.strokeColorR,this.strokeColorG, this.strokeColorB, 0,
                   this.mPoints7[0].x, this.mPoints7[0].y,
                   this.strokeColorR,this.strokeColorG,this.strokeColorB, 
                   this.mPoints7[0].strokeAlpha,2);
      
      for (let i = 0; i < this.mPoints7.length-1; i++) {
        Gradientl2c(P, this.mPoints7[i].x, this.mPoints7[i].y, 
                     this.strokeColorR,this.strokeColorG,this.strokeColorB, this.mPoints7[i].strokeAlpha,
                     this.mPoints7[i+1].x, this.mPoints7[i+1].y, 
                     this.strokeColorR,this.strokeColorG,this.strokeColorB, 
                    this.mPoints7[i+1].strokeAlpha,2);
      }
      
      Gradientl2c(P, this.mPoints7[this.mPoints7.length-1].x, 
                   this.mPoints7[this.mPoints7.length-1].y, 
                     this.strokeColorR,this.strokeColorG,this.strokeColorB, 
                   this.mPoints7[this.mPoints7.length-1].strokeAlpha,
                   this.tempRightPx, this.tempRightPy,
                   this.strokeColorR,this.strokeColorG,this.strokeColorB, 0,2);
      
      Gradientl2c(P, this.tempLeftPx,this.tempLeftPy,
                   this.strokeColorR,this.strokeColorG, this.strokeColorB, 0,
                   this.mPoints8[0].x, this.mPoints8[0].y,
                   this.strokeColorR,this.strokeColorG,this.strokeColorB, this.mPoints8[0].strokeAlpha,2);
      
      for (let i = 0; i < this.mPoints8.length-1; i++) {
        Gradientl2c(P, this.mPoints8[i].x, this.mPoints8[i].y, 
                     this.strokeColorR,this.strokeColorG,this.strokeColorB, this.mPoints8[i].strokeAlpha,
                     this.mPoints8[i+1].x, this.mPoints8[i+1].y, 
                     this.strokeColorR,this.strokeColorG,this.strokeColorB, 
                    this.mPoints8[i+1].strokeAlpha,2);
      }
      Gradientl2c(P, this.mPoints8[this.mPoints8.length-1].x, 
                   this.mPoints8[this.mPoints8.length-1].y, 
                     this.strokeColorR,this.strokeColorG,this.strokeColorB, 
                   this.mPoints8[this.mPoints8.length-1].strokeAlpha,
                   this.tempRightPx, this.tempRightPy,
                   this.strokeColorR,this.strokeColorG,this.strokeColorB, 0,2);
      
      Gradientl2c(P, this.tempLeftPx,this.tempLeftPy,
                   this.strokeColorR,this.strokeColorG, this.strokeColorB, 0,
                   this.mPoints9[0].x, this.mPoints9[0].y,
                   this.strokeColorR,this.strokeColorG,this.strokeColorB, this.mPoints9[0].strokeAlpha,2);
      
      for (let i = 0; i < this.mPoints9.length-1; i++) {
        Gradientl2c(P, this.mPoints9[i].x, this.mPoints9[i].y, 
                     this.strokeColorR,this.strokeColorG,this.strokeColorB, this.mPoints9[i].strokeAlpha,
                     this.mPoints9[i+1].x, this.mPoints9[i+1].y, 
                     this.strokeColorR,this.strokeColorG,this.strokeColorB, 
                    this.mPoints9[i+1].strokeAlpha,2);        
      }
      Gradientl2c(P, this.mPoints9[this.mPoints9.length-1].x, this.mPoints9[this.mPoints9.length-1].y, 
                     this.strokeColorR,this.strokeColorG,this.strokeColorB, 
                   this.mPoints9[this.mPoints9.length-1].strokeAlpha,
                   this.tempRightPx, this.tempRightPy,
                   this.strokeColorR,this.strokeColorG,this.strokeColorB, 0,2);

      Gradientl2c(P, this.tempLeftPx,this.tempLeftPy,
                   this.strokeColorR,this.strokeColorG, this.strokeColorB, 0,
                   this.mPoints10[0].x, this.mPoints10[0].y,
                   this.strokeColorR,this.strokeColorG,this.strokeColorB, 
                   this.mPoints10[0].strokeAlpha,2);
      
      for (let i = 0; i < this.mPoints10.length-1; i++) {
        Gradientl2c(P, this.mPoints10[i].x, this.mPoints10[i].y, 
                     this.strokeColorR,this.strokeColorG,this.strokeColorB, this.mPoints10[i].strokeAlpha,
                     this.mPoints10[i+1].x, this.mPoints10[i+1].y, 
                     this.strokeColorR,this.strokeColorG,this.strokeColorB,
                    this.mPoints10[i+1].strokeAlpha,2);
      }
      Gradientl2c(P, this.mPoints10[this.mPoints10.length-1].x, this.mPoints10[this.mPoints10.length-1].y, 
                     this.strokeColorR,this.strokeColorG,this.strokeColorB, 
                   this.mPoints10[this.mPoints10.length-1].strokeAlpha,
                   this.tempRightPx, this.tempRightPy,
                   this.strokeColorR,this.strokeColorG,this.strokeColorB, 0,2);
      Gradientl2c(P, this.tempLeftPx,this.tempLeftPy,
                   this.strokeColorR,this.strokeColorG, this.strokeColorB, (50*this.mAlpha)/255,
                   this.mPoints1[0].x, this.mPoints1[0].y,
                   this.strokeColorR,this.strokeColorG,this.strokeColorB, this.mPoints1[0].strokeAlpha,2);
      
      for (let i = 0; i < this.mPoints1.length-1; i++) {
        Gradientl2c(P, this.mPoints1[i].x, this.mPoints1[i].y, 
                     this.strokeColorR,this.strokeColorG,this.strokeColorB, this.mPoints1[i].strokeAlpha,
                     this.mPoints1[i+1].x, this.mPoints1[i+1].y, 
                     this.strokeColorR,this.strokeColorG,this.strokeColorB, 
                    this.mPoints1[i+1].strokeAlpha,2);
      }
      Gradientl2c(P, this.mPoints1[this.mPoints1.length-1].x, this.mPoints1[this.mPoints1.length-1].y, 
                     this.strokeColorR,this.strokeColorG,this.strokeColorB, 
                   this.mPoints1[this.mPoints1.length-1].strokeAlpha,
                   this.tempRightPx, this.tempRightPy,
                   this.strokeColorR,this.strokeColorG,this.strokeColorB, (50 * this.mAlpha) / 255,2);
      Gradientl2c(P, this.tempLeftPx,this.tempLeftPy,
                   this.strokeColorR,this.strokeColorG, this.strokeColorB, (100*this.mAlpha)/255,
                   this.mPoints0[0].x, this.mPoints0[0].y,
                   this.strokeColorR,this.strokeColorG,this.strokeColorB, this.mPoints0[0].strokeAlpha,2);
      
      for (let i = 0; i < this.mPoints0.length-1; i++) {
        Gradientl2c(P, this.mPoints0[i].x, this.mPoints0[i].y, 
                     this.strokeColorR,this.strokeColorG,this.strokeColorB, this.mPoints0[i].strokeAlpha,
                     this.mPoints0[i+1].x, this.mPoints0[i+1].y, 
                     this.strokeColorR,this.strokeColorG,this.strokeColorB, this.mPoints0[i+1].strokeAlpha,
                     2);
      }
      Gradientl2c(P, this.mPoints0[this.mPoints0.length-1].x, 
                   this.mPoints0[this.mPoints0.length-1].y, 
                     this.strokeColorR,this.strokeColorG,this.strokeColorB, 
                   this.mPoints0[this.mPoints0.length-1].strokeAlpha,
                   this.tempRightPx, this.tempRightPy,
                   this.strokeColorR,this.strokeColorG,this.strokeColorB, (50 * this.mAlpha) / 255,2);     
    }
    
    if (this.mAlpha > 0) {
      this.mAlpha = this.mAlpha - this.mDecAlpha;
      if (this.mAlpha < 0) {
        this.mAlpha = 0;
      }
    } else {
      this.mAlpha = 0;
    }
  }
  drawMountainPoint(P) {
    for (let i = 0; i < this.mPoints2.length; i++) {
      let x = this.mPoints2[i].x;
      let y = this.mPoints2[i].y;
      P.noFill();
      P.strokeWeight(1);
      P.stroke(255, 0, 0);
      P.ellipse(x, y, 5, 5);
    }
  }

  getRandomMountainPoint(decRange) {
    let maxSize = this.mPoints2.length;
    let randomNumber = int(shafxrand()*(maxSize - decRange * 2)) + decRange;
    let x = this.mPoints2[randomNumber].x;
    let y = this.mPoints2[randomNumber].y;
    let a = atan2(y - this.mPy, x - this.mPx);
    let P = new createVector(x, y, a);
    return P;
  }

  isInsideMountain_forShip(enterPx, enterPy) {
    let distance = dist(this.mPx, this.mPy, enterPx, enterPy);
    if (this.mW / 2 > this.mH) {
      if (enterPy <= this.mPy) {
        if (distance < this.mH * 4) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      if (enterPy <= this.mPy) {
        if (distance < (this.mW / 2) * 3) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  }

  isInsideMountain(enterPx, enterPy) {
    let distance = dist(this.mPx, this.mPy, enterPx, enterPy);
    if (this.mW / 2 > this.mH) {
      if (enterPy <= this.mPy) {
        if (distance < this.mH) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      if (enterPy <= this.mPy) {
        if (distance < this.mW / 2) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  }

  getAlpha() {
    return this.mAlpha;
  }

  getMountainLeftBorderPoint() {
    return createVector(this.tempLeftPx, this.tempLeftPy);
  }
  getMountainRightBorderPoint() {
    return createVector(this.tempRightPx, this.tempRightPy);
  }
}

class mountainPoint {
  constructor(enterX,enterY,enterSAlpha,enterSColor,enterFAlpha,enterFColor) {
    this.x = enterX;
    this.y = enterY;
    this.strokeAlpha = enterSAlpha;
    this.strokeColor = enterSColor;
    this.fillAlpha = enterFAlpha;
    this.fillColor = enterFColor;
  }
}

function generateCenterMountain(_P, _r, _g, _b) {
  let mountainNumber = shafxrand()*4;
  for (let k = 0; k < mountainNumber; k++) {
    let mountainCx = allW*0.25+shafxrand()*(allW*0.76-allW*0.25);
    let mountainCy = allH*0.25+shafxrand()*(allH*0.76-allH*0.25);
      generate_a_lot_of_mountains(
        mountainCx,mountainCy,0,
        _r - int(shafxrand()*8),_g + int(shafxrand()*8),_b - int(shafxrand()*8));
  }
}

function generateLeftMountain(_P, _r, _g, _b) {
  for (let k = 0; k < 10000; k++) {
    generate_a_lot_of_mountains(
      allW/4,_P.height*0.3+shafxrand()*(_P.height*0.67-_P.height*0.3),0,
      _r - int(shafxrand()*8),_g + int(shafxrand()*8),_b - int(shafxrand()*8));

    let regenerateFlag = false;
    let closedLeftDistance = allW;
    for (let i = 0; i < ims.length; i++) {
      if (ims[i].getMountainLeftBorderPoint().x < -2) {
        regenerateFlag = true;
        break;
      }
      if (abs(ims[i].getMountainLeftBorderPoint().x) < closedLeftDistance) {
        closedLeftDistance = abs(ims[i].getMountainLeftBorderPoint().x);
      }
    }
    if (closedLeftDistance > 5) {
      regenerateFlag = true;
    }
    if (regenerateFlag == true) {
      mPs.splice(0, mPs.length);
      ims.splice(0, ims.length);
      continue;
    } else {
      break;
    }
  }
  mPs_leftnumber = mPs.length;
  ims_leftNumber = ims.length;
}

function generateRightMountain(_P, _r, _g, _b) {
  for (let k = 0; k < 10000; k++) {
    generate_a_lot_of_mountains(
      (allW*3)/4,_P.height*0.3+shafxrand()*(_P.height*0.67-_P.height*0.3),0,
      _r - int(shafxrand()*8),_g + int(shafxrand()*8),_b - int(shafxrand()*8));

    let regenerateFlag = false;
    let closedRightDistance = allW;
    for (let i = 0; i < ims.length; i++) {
      if (ims[i].getMountainRightBorderPoint().x > allW + 2) {
        regenerateFlag = true;
        break;
      }
      if (abs(allW - ims[i].getMountainRightBorderPoint().x) <closedRightDistance) {
        closedRightDistance = abs(allW - ims[i].getMountainRightBorderPoint().x);
      }
    }
    if (closedRightDistance > 5) {
      regenerateFlag = true;
    }
    if (regenerateFlag == true) {
      for (let i = mPs_leftnumber + 1; i < mPs.length; i++) {
        mPs.splice(i, 1);
      }
      for (let i = ims_leftNumber + 1; i < ims.length; i++) {
        ims.splice(i, 1);
      }
      continue;
    } else {
      break;
    }
  }
}

// ===================================
// shipP
// ===================================
class Ship {
  constructor() {
    this.shipW = 200;
    this.shipH = 100;
    this.shipCx = 150;
    this.shipCy = 150;
    this.virtualD1 = this.shipW * 2;
    this.aRange = 15;
    this.aCenter = 85+shafxrand()*5;
    this.roofX = 140;
    this.roofY = 118;
    this.structureTempX = this.roofX+this.shipW*0.15-1+
      shafxrand()*(this.roofX+this.shipW*0.15+1-(this.roofX+this.shipW*0.15-1));
    this.structureTempY = this.roofY+33+shafxrand()*(this.roofY-75-(this.roofY+33));
    this.shipX = 300;
    this.shipY = 300;
  }
  drawShip(_P) {
    _P.stroke(0,200);
    _P.strokeWeight(2);
    _P.push();
    _P.translate(this.shipX - 170, this.shipY - 150);
    for (let x = this.shipW + 10; x < this.shipW + 80; x++) {
      let y1 = this.shipCy - this.shipH + sq(x - (this.shipW + 90)) * 0.015 + 5;
      let y2 = this.shipCy - this.shipH + sq(x + 1 - (this.shipW + 90)) * 0.015 + 5;
      _P.line(x, y1, x + 1, y2);
    }

    // structure
    _P.line(this.roofX + this.shipW * 0.15,this.roofY + 33,this.structureTempX,this.structureTempY);
    _P.line(this.structureTempX,this.structureTempY,this.roofX + this.shipW * 0.15,this.roofY - 75);
    _P.line(this.roofX+this.shipW*0.15,this.roofY+5-80,this.roofX+this.shipW*0.4,this.roofY+5-85);
    _P.line(this.roofX+this.shipW*0.15,this.roofY-75,this.roofX+this.shipW*0.15,this.roofY+5-110);
    _P.line(this.roofX+this.shipW*0.15,this.roofY-85,this.roofX + this.shipW * 0.2,this.roofY+5-80);

    // lantern
    _P.noStroke();
    _P.fill(240, 0, 0, 64);
    _P.ellipse(this.roofX + this.shipW * 0.3, this.roofY - 60, 20, 20);
    _P.fill(220, 0, 0, 128);
    _P.ellipse(this.roofX + this.shipW * 0.3, this.roofY - 60, 15, 15);
    _P.fill(200, 0, 0, 255);
    _P.ellipse(this.roofX + this.shipW * 0.3, this.roofY - 60, 10, 10);

    _P.noStroke();
    _P.fill(240, 0, 0, 64);
    _P.ellipse(this.roofX + this.shipW * 0.3, this.roofY - 35, 20, 20);
    _P.fill(220, 0, 0, 128);
    _P.ellipse(this.roofX + this.shipW * 0.3, this.roofY - 35, 15, 15);
    _P.fill(200, 0, 0, 255);
    _P.ellipse(this.roofX + this.shipW * 0.3, this.roofY - 35, 10, 10);

    // person
    _P.noStroke();
    _P.fill(0, 200);
    _P.ellipse(this.roofX + this.shipW * 0.3,this.roofY + this.shipH * 0.25,15,40);
    _P.ellipse(this.roofX + this.shipW * 0.33, this.roofY + 5, 10, 10);

    // hat
    _P.arc(this.roofX + this.shipW * 0.33 - 2,this.roofY + 11,
      30,30,PI + QUARTER_PI + 0.3,PI + QUARTER_PI + 2.2,CHORD);

    let boatBottomX1 =this.virtualD1 * cos(radians(90 + this.aRange * 0.7)) + this.shipCx;
    let boatBottomY1 =this.virtualD1 * sin(radians(90 + this.aRange)) +this.shipCy -this.virtualD1 * 0.93;
    let boatBottomX2 =this.virtualD1 * cos(radians(90 - this.aRange * 0.7)) + this.shipCx;
    let boatBottomY2 =this.virtualD1 * sin(radians(90 - this.aRange)) +this.shipCy -this.virtualD1 * 0.93;

    _P.strokeWeight(5);
    for (let x = this.roofX + 9; x > this.roofX; x = x - 0.1) {
      let y = sq(x - this.roofX) * 0.4 + this.roofY - 2;
      _P.stroke(50);
      _P.point(x, y);
    }

    _P.noStroke();
    _P.beginShape();
    for (let x = this.roofX - 9; x < this.roofX; x = x + 1) {
      let y = sq(x - this.roofX) * 0.4 + this.roofY;
      _P.fill((x - (this.roofX - 9)) * 10);
      _P.vertex(x, y);
    }

    for (let x = this.roofX; x > this.roofX - 50; x--) {
      let y = this.roofY + sq(this.roofX - x) * 0.005 - 4;
      _P.fill(150);
      _P.vertex(x, y);
    }

    for (let x = this.roofX - 50; x > this.roofX - 50 - 7; x = x - 0.1) {
      let y =sq(x - (this.roofX - 50)) * 0.3 +this.roofY +sq(this.roofX - x) * 0.005 -4;
      _P.fill(150);
      _P.vertex(x, y);
    }
    _P.endShape(CLOSE);

    _P.noStroke();
    _P.beginShape();
    _P.fill(50);
    for (let a = this.aCenter + this.aRange;a > this.aCenter - this.aRange;a--) {
      let x1 = this.virtualD1 * cos(radians(a)) + this.shipCx;
      let y1 = this.virtualD1 * sin(radians(a)) + this.shipCy - this.virtualD1;
      _P.vertex(x1, y1);
    }
    _P.fill(150);
    _P.vertex(boatBottomX2, boatBottomY2);
    _P.vertex(boatBottomX1, boatBottomY1);
    _P.endShape(CLOSE);
    _P.pop();
  }
}


// =========================
// Tree
// =========================
class backRoot {
  constructor(x, y, a, R, enterAlpha, enterDecA) {
    this.alpha = enterAlpha;
    this.px = x;
    this.py = y;
    this.newX = this.px;
    this.newY = this.py;
    this.pa = a;
    this.pR = R;
    this.growState = true;
    this.timeAlpha = 255;
    this.decA = enterDecA;
  }

  update_and_draw_Root(P, initialR) {
    if (this.growState == true) {
      if (this.timeAlpha > 0) {
        this.timeAlpha = this.timeAlpha - this.decA;
        if (this.timeAlpha < 0) {
          this.timeAlpha = 0;
        }
      } else {
        this.timeAlpha = 0;
      }
      this.pR = this.pR*0.92;
      if (shafxrand()*2 > 1) {
        this.pa = this.pa + shafxrand()*3;
      } else {
        this.pa = this.pa - shafxrand()*3;
      }
      this.newX = this.px + this.pR*cos(radians(this.pa));
      this.newY = this.py + this.pR*sin(radians(this.pa));

      P.strokeWeight(sqrt(this.pR)*2);
      P.stroke(0, this.alpha*this.timeAlpha/255);
      P.line(this.px, this.py, this.newX, this.newY);
      P.strokeWeight(sqrt(this.pR)*1.5);
      P.stroke(150, this.alpha*this.timeAlpha/255);
      P.line(this.px, this.py, this.newX, this.newY);
      P.strokeWeight(sqrt(this.pR)*1);
      P.stroke(255, this.alpha*this.timeAlpha/255);
      P.line(this.px, this.py, this.newX, this.newY);
      P.strokeWeight(sqrt(this.pR)*1.5);
      P.point(this.px, this.py);
      P.point(this.newX, this.newY);

      this.px = this.newX;
      this.py = this.newY;

      if (this.timeAlpha > 0) {
        this.timeAlpha = this.timeAlpha - this.decA;
        if (this.timeAlpha < 0) {
          this.timeAlpha = 0;
        }
      } else {
        this.timeAlpha = 0;
      }

      if (this.alpha < 255) {
        this.alpha = this.alpha + 25;
        if (this.alpha > 255) {
          this.alpha = 255;
        }
      } else {
        this.alpha = 255;
      }
      if (this.pR < initialR*0.5) {
        if (shafxrand()*8 > 7) {
          let randomPicProportion = 0.05+shafxrand()*0.25;
          let randomPicNumber = int(shafxrand()*5);
          backLeafs.push(new backLeaf(this.px,this.py,randomPicProportion*initialR*0.1,randomPicNumber, this.decA));
        }
      } 
      if (this.pR < initialR*0.2) {
        if (shafxrand()*7 > 6) {
          let randomPicProportion = 0.05+shafxrand()*0.25;
          let randomPicNumber = int(shafxrand()*5);
          backLeafs.push(new backLeaf(this.px, this.py, randomPicProportion*initialR*0.1, randomPicNumber, this.decA));
        }
      }
      if (this.pR < initialR*0.1) {
        this.growState = false;
        let randomPicProportion = 0.1+shafxrand()*0.2;
        if (shafxrand()*10 > 9) {
          let randomPicNumber = int(shafxrand()*5);
          backLeafs.push(new backLeaf(this.px, this.py, randomPicProportion*initialR*0.1, randomPicNumber, this.decA));
        }
      }
      if (shafxrand()*11> 10) {
        if (shafxrand()*2 > 1) {
          this.pa = this.pa + (3+shafxrand()*27);
        } else {
          this.pa = this.pa - (3+shafxrand()*27);
        }
        backRoots.push(new backRoot(this.px, this.py, this.pa, this.pR*1.15, this.alpha, this.decA));
      }
    }
  }

  getGrowState() {
    return this.growState;
  }
}


class backLeaf {
  constructor(enterX, enterY, enterProportion, i, enterDec) {
    this.x = enterX;
    this.y = enterY;
    this.proportion = enterProportion;
    this.picNumber = i;
    this.alpha = 255;
    this.decAlpha =enterDec;
    this.drawFlag = true;
  }
  drawLeaf(images, P) {
    P.imageMode(CENTER);
    P.tint(255, this.alpha);
    P.image(images[this.picNumber], this.x, this.y, 200*this.proportion, 200*this.proportion);
    if (this.alpha > 0) {
      this.alpha = this.alpha - this.decAlpha;
      if (this.alpha < 0) {
        this.alpha = 0;
      }
    } else {
      this.alpha = 0;
    }
    this.drawFlag = false;
  }
}


class frontRoot {
  constructor(x, y, a, R, enterAlpha, enterDecA) {
    this.alpha = enterAlpha;
    this.px = x;
    this.py = y;
    this.newX = this.px;
    this.newY = this.py;
    this.pa = a;
    this.pR = R;
    this.growState = true;
    this.timeAlpha = 255;
    this.decA = enterDecA;
  }

  update_and_draw_Root(P, initialR) {
    if (this.growState == true) {
      if (this.timeAlpha > 0) {
        this.timeAlpha = this.timeAlpha - this.decA;
        if (this.timeAlpha < 0) {
          this.timeAlpha = 0;
        }
      } else {
        this.timeAlpha = 0;
      }
      this.pR = this.pR*0.92;
      if (shafxrand()*2 > 1) {
        this.pa = this.pa + shafxrand()*3;
      } else {
        this.pa = this.pa - shafxrand()*3;
      }
      this.newX = this.px + this.pR*cos(radians(this.pa));
      this.newY = this.py + this.pR*sin(radians(this.pa));

      P.strokeWeight(sqrt(this.pR)*2);
      P.stroke(0, this.alpha*this.timeAlpha/255);
      P.line(this.px, this.py, this.newX, this.newY);
      P.strokeWeight(sqrt(this.pR)*1.5);
      P.stroke(150, this.alpha*this.timeAlpha/255);
      P.line(this.px, this.py, this.newX, this.newY);
      P.strokeWeight(sqrt(this.pR)*1);
      P.stroke(255, this.alpha*this.timeAlpha/255);
      P.line(this.px, this.py, this.newX, this.newY);
      P.strokeWeight(sqrt(this.pR)*1.5);
      P.point(this.px, this.py);
      P.point(this.newX, this.newY);

      this.px = this.newX;
      this.py = this.newY;

      if (this.timeAlpha > 0) {
        this.timeAlpha = this.timeAlpha - this.decA;
        if (this.timeAlpha < 0) {
          this.timeAlpha = 0;
        }
      } else {
        this.timeAlpha = 0;
      }

      if (this.alpha < 255) {
        this.alpha = this.alpha + 25;
        if (this.alpha > 255) {
          this.alpha = 255;
        }
      } else {
        this.alpha = 255;
      }
      if (this.pR < initialR*0.5) {
        if (shafxrand()*8 > 7) {
          let randomPicProportion = 0.05+shafxrand()*0.25;;
          let randomPicNumber = int(shafxrand()*5);
          frontLeafs.push(new frontLeaf(this.px, this.py, randomPicProportion*initialR*0.1, randomPicNumber, this.decA));
        }
      } 
      if (this.pR < initialR*0.2) {
        if (shafxrand()*7 > 6) {
          let randomPicProportion = 0.05+shafxrand()*0.25;
          let randomPicNumber = int(shafxrand()*5);
          frontLeafs.push(new frontLeaf(this.px, this.py, randomPicProportion*initialR*0.1, randomPicNumber, this.decA));
        }
      }
      if (this.pR < initialR*0.1) {
        this.growState = false;
        let randomPicProportion = 0.1+shafxrand()*0.2;
        if (shafxrand()*10 > 9) {
          let randomPicNumber = int(shafxrand()*5);
          frontLeafs.push(new frontLeaf(this.px, this.py, randomPicProportion*initialR*0.1, randomPicNumber, this.decA));
        }
      }
      if (shafxrand()*11> 10) {
        if (shafxrand()*2 > 1) {
          this.pa = this.pa + (3+shafxrand()*27);
        } else {
          this.pa = this.pa - (3+shafxrand()*27);
        }
        frontRoots.push(new frontRoot(this.px, this.py, this.pa, this.pR*1.15, this.alpha, this.decA));
      }
    }
  }

  getGrowState() {
    return this.growState;
  }
}


class frontLeaf {
  constructor(enterX, enterY, enterProportion, i, enterDec) {
    this.x = enterX;
    this.y = enterY;
    this.proportion = enterProportion;
    this.picNumber = i;
    this.alpha = 255;
    this.decA = enterDec;
    this.drawFlag = true;
  }
  drawLeaf(images, P) {
    P.imageMode(CENTER);
    P.tint(255, this.alpha);
    P.image(images[this.picNumber], this.x, this.y, 200*this.proportion, 200*this.proportion);
    if (this.alpha > 0) {
      this.alpha = this.alpha - this.decA;
      if (this.alpha < 0) {
        this.alpha = 0;
      }
    } else {
      this.alpha = 0;
    }
    this.drawFlag = false;
  }
}

function generateBackTree(initialRandom, px, py, initial_a, decA) {
  let initialR = initialRandom*0.86+shafxrand()*(initialRandom*1.1-initialRandom*0.86);
  backRoots.push(new backRoot(px, py, initial_a, initialR, 5, decA));
}

function generateFrontTree(initialRandom, px, py, initial_a, decA) {
  let initialR = initialRandom*0.86+shafxrand()*(initialRandom*1.1-initialRandom*0.86);
  frontRoots.push(new frontRoot(px, py, initial_a, initialR, 5, decA));
}

// about_leaf
function recursionLeaf(_lus, x, y, r, n) {
  if (n > 0) {
    _lus.push(new leafUnit(x, y, r));
    for (let a = 0; a < 360; a = a + 30+shafxrand()*60) {
      let r_proportion = 0.3+shafxrand()*0.4;
      let newX = x + r*r_proportion*cos(radians(a));
      let newY = y + r*r_proportion*sin(radians(a));
      if (shafxrand()*2 > 1) {
        recursionLeaf(_lus, newX, newY, r*0.5, n-1);
      }
    }
  }
}

class leafUnit {
  constructor(_x, _y, _r) {
    this.px = _x;
    this.py = _y;
    this.R = _r;
  }
  drawLeaf(_P) {
    _P.noStroke();
    _P.fill(50+shafxrand()*50, 2);
    _P.ellipse(this.px, this.py, 50*(0.5+this.R*0.05), 50*(0.5+this.R*0.05));
  }
}

// ===================================
// bg
// ===================================
function cheng_seal(_P, x, y) {
  _P.push();
  _P.translate(x - 100, y - 100);
  _P.rotate(radians(sealRotateAngle));
  _P.scale(0.4);
  _P.noFill();
  _P.stroke(180, 16, 8);
  _P.strokeWeight(7);
  _P.rectMode(CENTER);
  _P.rect(100, 100, 200, 200, 15);

  // wang
  _P.strokeWeight(3);
  _P.point(107, 19);
  _P.point(180, 19);
  _P.line(107, 19, 180, 19);
  _P.point(107, 38);
  _P.point(180, 38);
  _P.line(107, 38, 180, 38);
  _P.line(143, 19, 143, 89);
  _P.point(108, 89);
  _P.point(179, 89);
  _P.curve(108, 89, 108, 89, 108, 62, 113, 55);
  _P.curve(108, 89, 108, 62, 113, 55, 121, 55);
  _P.curve(108, 62, 113, 55, 121, 55, 125, 62);
  _P.curve(113, 55, 121, 55, 125, 62, 125, 83);
  _P.curve(121, 55, 125, 62, 125, 83, 131, 89);
  _P.curve(125, 62, 125, 83, 131, 89, 155, 89);
  _P.curve(125, 83, 131, 89, 155, 89, 161, 83);
  _P.curve(131, 89, 155, 89, 161, 83, 161, 62);
  _P.curve(155, 89, 161, 83, 161, 62, 165, 55);
  _P.curve(161, 83, 161, 62, 165, 55, 174, 55);
  _P.curve(161, 62, 165, 55, 174, 55, 179, 62);
  _P.curve(165, 55, 174, 55, 179, 62, 179, 89);
  _P.curve(174, 55, 179, 62, 179, 89, 179, 89);

  // lien
  _P.point(108, 108);
  _P.point(135, 108);
  _P.line(108, 108, 135, 108);
  _P.point(108, 121);
  _P.curve(108, 121, 108, 121, 128, 121, 133, 127);
  _P.curve(108, 121, 128, 121, 133, 127, 121, 126);
  _P.curve(128, 121, 133, 127, 128, 133, 108, 133);
  _P.point(108, 133);
  _P.curve(133, 127, 128, 133, 108, 133, 108, 133);
  _P.line(120, 133, 120, 179);
  _P.point(108, 145);
  _P.curve(108, 145, 108, 145, 108, 173, 116, 179);
  _P.curve(108, 145, 108, 173, 116, 179, 179, 179);
  _P.point(179, 179);
  _P.curve(108, 173, 116, 179, 179, 179, 179, 179);

  _P.curve(133, 145, 133, 145, 133, 157, 120, 163);
  _P.curve(133, 145, 133, 157, 120, 163, 120, 163);

  _P.point(144, 115);
  _P.point(179, 115);
  _P.line(144, 115, 179, 115);
  _P.rect(162, 141, 35, 30, 10);
  _P.line(145, 141, 179, 141);
  _P.point(144, 166);
  _P.point(179, 166);
  _P.line(144, 166, 179, 166);
  _P.line(132, 89, 154, 89);
  _P.point(162, 108);
  _P.line(162, 108, 162, 180);

  // cheng
  _P.point(20, 33);
  _P.point(20, 90);
  _P.line(20, 33, 20, 90);
  _P.point(90, 42);
  _P.line(20, 42, 90, 42);
  _P.point(50, 60);
  _P.line(20, 60, 50, 60);
  _P.point(39, 90);
  _P.line(39, 60, 39, 90);
  _P.point(20, 19);
  _P.curve(20, 19, 20, 19, 40, 19, 54, 30);
  _P.curve(20, 19, 40, 19, 54, 30, 90, 88);
  _P.point(90, 88);
  _P.curve(40, 19, 54, 30, 90, 88, 90, 88);
  _P.curve(53, 29, 53, 29, 84, 29, 91, 24);
  _P.curve(53, 29, 84, 29, 91, 24, 91, 19);
  _P.point(91, 19);
  _P.curve(84, 29, 91, 24, 91, 19, 91, 19);

  _P.point(91, 51);
  _P.curve(91, 51, 91, 51, 91, 55, 86, 59);
  _P.curve(91, 51, 91, 55, 86, 59, 66, 59);
  _P.curve(91, 55, 86, 59, 66, 59, 60, 68);
  _P.curve(86, 59, 66, 59, 60, 68, 60, 90);
  _P.point(60, 90);
  _P.curve(66, 59, 60, 68, 60, 90, 60, 90);

  // in
  _P.point(20, 108);
  _P.curve(20, 108, 20, 108, 20, 170, 29, 179);
  _P.curve(20, 108, 20, 170, 29, 179, 79, 179);
  _P.point(79, 179);
  _P.curve(20, 170, 29, 179, 79, 179, 79, 179);
  _P.point(78, 155);
  _P.line(20, 155, 78, 155);
  _P.point(78, 168);
  _P.line(20, 168, 78, 168);
  _P.point(31, 108);
  _P.curve(31, 108, 31, 108, 83, 108, 91, 115);
  _P.curve(31, 108, 83, 108, 91, 115, 91, 123);
  _P.curve(83, 108, 91, 115, 91, 123, 83, 129);
  _P.curve(91, 115, 91, 123, 83, 129, 38, 129);
  _P.curve(91, 123, 83, 129, 38, 129, 31, 136);
  _P.curve(83, 129, 38, 129, 31, 136, 38, 144);
  _P.curve(38, 129, 31, 136, 38, 144, 82, 144);
  _P.curve(31, 136, 38, 144, 82, 144, 91, 152);
  _P.curve(38, 144, 82, 144, 91, 152, 91, 179);
  _P.point(91, 179);
  _P.curve(82, 144, 91, 152, 91, 179, 91, 179);
  _P.point(60, 120);
  _P.line(60, 109, 60, 120);
  _P.pop();
}

function initBorder(_P) {
  _P.noStroke();
  _P.fill(255);
  _P.beginShape();
  for (let i = 20; i <= allW - 20; i++) {
    _P.vertex(i, 5 * noise(i * 0.07, 100) + 20);
  }
  _P.vertex(allW - 20, 0);
  _P.vertex(20, 0);
  _P.endShape(CLOSE);

  _P.beginShape();
  for (let i = 20; i <= allW - 20; i++) {
    _P.vertex(i, _P.height - 20 - 5 * noise(i * 0.07, 100));
  }
  _P.vertex(allW - 20, _P.height);
  _P.vertex(20, _P.height);
  _P.endShape();

  _P.beginShape();
  for (let i = 20; i <= _P.height - 20; i++) {
    _P.vertex(5 * noise(i * 0.07, 100) + 20, i);
  }
  _P.vertex(0, _P.height - 20);
  _P.vertex(0, 20);
  _P.endShape();

  _P.beginShape();
  for (let i = 20; i <= _P.height - 20; i++) {
    _P.vertex(allW - 20 - 5 * noise(i * 0.07, 100), i);
  }
  _P.vertex(allW, _P.height - 20);
  _P.vertex(allW, 20);
  _P.endShape();

  _P.rect(0, 0, 20, 20);
  _P.rect(allW - 20, 0, 20, 20);
  _P.rect(0, _P.height - 20, 20, 20);
  _P.rect(allW - 20, _P.height - 20, 20, 20);
  _P.fill(255);
  _P.beginShape();
  for (let i = 20; i <= allW - 20; i++) {
    _P.vertex(i, 5 * noise(i * 0.07, 100) + 20);
  }
  _P.vertex(allW - 20, 0);
  _P.vertex(20, 0);
  _P.endShape();

  _P.beginShape();
  for (let i = 20; i <= allW - 20; i++) {
    _P.vertex(i, _P.height - 20 - 5 * noise(i * 0.07, 100));
  }
  _P.vertex(allW - 20, _P.height);
  _P.vertex(20, _P.height);
  _P.endShape();

  _P.beginShape();
  for (let i = 20; i <= _P.height - 20; i++) {
    _P.vertex(5 * noise(i * 0.07, 100) + 20, i);
  }
  _P.vertex(0, _P.height - 20);
  _P.vertex(0, 20);
  _P.endShape();

  _P.beginShape();
  for (let i = 20; i <= _P.height - 20; i++) {
    _P.vertex(allW - 20 - 5 * noise(i * 0.07, 100), i);
  }
  _P.vertex(allW, _P.height - 20);
  _P.vertex(allW, 20);
  _P.endShape();

  _P.rect(0, 0, 20, 20);
  _P.rect(allW - 20, 0, 20, 20);
  _P.rect(0, _P.height - 20, 20, 20);
  _P.rect(allW - 20, _P.height - 20, 20, 20);
}

function init_inkBG(ink_white_height) {
  for (let i = 0; i < 60; i++) {
    ink_bg_up.noStroke();
    ink_bg_up.fill(bgColorR[randomBgColorNumber],
             bgColorG[randomBgColorNumber],bgColorB[randomBgColorNumber], 5);
    ink_bg_up.beginShape();
    let randomH_seed =
      ink_white_height -(i*7*float(ink_bg_down.height)) / float(height) +100;
    for (let x = 0; x <= allW; x = x + 1) {
      let y = noise(x * 0.005, randomH_seed) * 100;
      ink_bg_up.vertex(x, y + randomH_seed);
    }
    ink_bg_up.vertex(allW, 0);
    ink_bg_up.vertex(0, 0);
    ink_bg_up.endShape(CLOSE);
  }

  for (let i = 0; i < 100; i++) {
    ink_bg_down.noStroke();
    ink_bg_down.fill(
      bgColorR[randomBgColorNumber]*0.8,bgColorG[randomBgColorNumber]*0.8,
      bgColorB[randomBgColorNumber] * 0.8, 4);
    ink_bg_down.beginShape();
    let randomH_seed =ink_white_height +(i * 13 * float(ink_bg_down.height)) / float(height) -100;
    for (let x = 0; x <= allW; x = x + 1) {
      let y = noise(x * 0.005, randomH_seed) * 100;
      ink_bg_down.vertex(x, y + randomH_seed);
    }
    ink_bg_down.vertex(allW, ink_bg_down.height);
    ink_bg_down.vertex(0, ink_bg_down.height);
    ink_bg_down.endShape(CLOSE);
  }
}

function updateBG() {
  bg.colorMode(HSB, 360, 100, 100, 255);
  if (bgKindNumber == 1) {
    for (let k = 0; k < 3; k++) {
      for (let x = 0; x <= bg.width; x = x + 2) {
        let y = bgDrawCount;
        let r = shafxrand()*3;
        bg.noStroke();
        bg.fill(0, 25);
        bg.ellipse(x, y, r, r);
      }
      bgDrawCount++;
    }
    if (bgDrawCount > bg.height) {
      bgDrawFlag = false;
    }
  } else if (bgKindNumber == 2) {
    for (let k = 0; k < 3; k++) {
      for (let x = 0; x <= bg.width; x = x + 3) {
        let y = bgDrawCount;
        let r = 1+shafxrand()*2;
        bg.noStroke();
        bg.fill(0, 30);
        bg.ellipse(x, y, r, r);
      }
      bgDrawCount++;
    }
    if (bgDrawCount > bg.height) {
      bgDrawFlag = false;
    }
  } else if (bgKindNumber == 3) {
    for (let k = 0; k < 3; k++) {
      let cx = shafxrand()*allW;
      let cy = shafxrand()*allH;
      let angle = shafxrand()*360;
      for (let R = -int(bg.height * 0.7); R < int(bg.height * 0.7); R = R + 3) {
        let r = 1+shafxrand()*2;
        bg.noStroke();
        bg.fill(0, 20);
        bg.ellipse(cx + R * cos(radians(angle)),cy + R * sin(radians(angle)),r,r);
      }
      bgDrawCount++;
    }
    if (bgDrawCount > 3000) {
      bgDrawFlag = false;
    }
  } else if (bgKindNumber == 4) {
    for (let k = 0; k < 3; k++) {
      for (let x = 0; x <= bg.width; x++) {
        let y = bgDrawCount;
        let tempRandomValueSeed = int(shafxrand()*5);
        let tempRandomValue = 0;
        if (tempRandomValueSeed == 0) {
          tempRandomValue = 60;
        }
        if (tempRandomValueSeed == 1) {
          tempRandomValue = 150;
        }
        bg.stroke(0, noise(x * 0.1, y * 0.1) * tempRandomValue);
        bg.point(x, y);
      }
      bgDrawCount++;
    }
    if (bgDrawCount > bg.height) {
      bgDrawFlag = false;
    }
  }
}

function initBGCount() {
  bg.colorMode(HSB, 360, 100, 100, 255);
  bg.background(45 + int(-15+shafxrand()*30), int(shafxrand()*7), 100);
  if (bgKindNumber == 1) {
    bgDrawCount = 0;
  } else if (bgKindNumber == 2) {
    bgDrawCount = 0;
  } else if (bgKindNumber == 3) {
    bgDrawCount = 0;
  } else if (bgKindNumber == 4) {
    bgDrawCount = 0;
  }
}

function initBG() {
  bg.colorMode(HSB, 360, 100, 100, 255);
  bg.background(45, 3, 100);
  if (bgKindNumber == 1) {
    bg.translate(allW / 2, bg.height / 2);
    bg.rotate(radians(globalAngle));
    for (let x = -allW; x < allW; x = x + 2) {
      for (let y = -bg.height; y < bg.height; y++) {
        let r = 1+shafxrand()*2;
        bg.noStroke();
        bg.fill(0, 20);
        bg.ellipse(x, y, r, r);
      }
    }
  } else if (bgKindNumber == 2) {
    bg.translate(allW / 2, bg.height / 2);
    bg.rotate(radians(globalAngle));
    for (let x = -allW; x < allW; x = x + 3) {
      for (let y = -bg.height; y < bg.height; y++) {
        let r = 1+shafxrand()*2;
        bg.noStroke();
        bg.fill(0, 30);
        bg.ellipse(x, y, r, r);
      }
    }
  } else if (bgKindNumber == 3) {
    for (let i = 0; i < 3000; i++) {
      let cx = shafxrand()*allW;
      let cy = shafxrand()*bg.height;
      let angle = shafxrand()*360;
      for (let R = -allW; R < allW; R = R + 3) {
        let r = 1+shafxrand()*2;
        bg.noStroke();
        bg.fill(0, 10);
        bg.ellipse(cx + R * cos(radians(angle)),cy + R * sin(radians(angle)),r,r);
      }
    }
  } else if (bgKindNumber == 4) {
    bg.translate(allW / 2, bg.height / 2);
    bg.rotate(radians(globalAngle));
    for (let x = -allW; x < allW; x++) {
      for (let y = -bg.height; y < bg.height; y++) {
        let tempRandomValueSeed = int(shafxrand()*5);
        let tempRandomValue = 0;
        if (tempRandomValueSeed == 0) {
          tempRandomValue = 60;
        }
        if (tempRandomValueSeed == 1) {
          tempRandomValue = 150;
        }
        bg.stroke(0, noise(x * 0.1, y * 0.1) * tempRandomValue);
        bg.point(x, y);
      }
    }
  } else if (bgKindNumber == 5) {
    bg.translate(allW / 2, bg.height / 2);
    bg.rotate(radians(globalAngle));
    for (let x = -allW; x < allW; x = x + 8) {
      for (let y = -bg.height; y < bg.height; y = y + 16) {
        let circleR = int(5+shafxrand()*4);
        bg.noFill();
        bg.strokeWeight(1+shafxrand()*1);
        bg.stroke(0, 80 - circleR * (8 + shafxrand()*3));
        bg.ellipse(x, y, circleR, circleR);
      }
    }
    for (let x = 4 - allW; x < allW + 4; x = x + 8) {
      for (let y = 8-allH; y < allH + 8; y = y + 16) {
        let circleR = int(5+shafxrand()*4);
        bg.noFill();
        bg.strokeWeight(1+shafxrand()*1);
        bg.stroke(0, 80 - circleR * (8 + shafxrand()*3));
        bg.ellipse(x, y, circleR, circleR);
      }
    }
  }
}


// ===================================
// frontTree
// ===================================
class Root {
  constructor(_x, _y, _r, _a, _d) {
    this.x = _x;
    this.y = _y;
    this.r = _r;
    this.a = _a;
    this.decProportion = _d;
    this.new_a = _a;
    this.shiftR1 = -0.4+shafxrand()*0.7;
    this.shiftR2 = -0.4+shafxrand()*0.7;
  }

  updateRoot(_leafsBack, _leafsFront) {
    this.x = this.x + this.r * 0.3 * cos(radians(this.a));
    this.y = this.y + this.r * 0.3 * sin(radians(this.a));
    this.r = this.r*(0.973+shafxrand()*0.017)*this.decProportion;
    this.new_a = this.a + (-6+shafxrand()*12);
    this.a = this.new_a;
    if (this.r < 35) {
      if (shafxrand()*(2+this.r*0.1) > 1+this.r*0.1) {
        let r_root = shafxrand()*1;
        let randomA = shafxrand()*360;

        if (shafxrand()*2 > 1) {
          let leafR = leafLightColorR[randomLeafLightColorNumber] + shafxrand()*5;
          let leafG = leafLightColorG[randomLeafLightColorNumber] + shafxrand()*5;
          let leafB = leafLightColorB[randomLeafLightColorNumber] + shafxrand()*5;
          _leafsBack.push(
            new leaf(
              this.x + this.r * r_root * cos(radians(randomA)),
              this.y + this.r * r_root * sin(radians(randomA)),
              5+shafxrand()*2,16+shafxrand()*2,shafxrand()*360,leafR,leafG,leafB,130));
          for (let i = 0; i < _leafsBack.length - 1; i++) {
            if (dist(this.x+this.r*r_root*cos(radians(randomA)),
                     this.y+this.r*r_root*sin(radians(randomA)),
                     _leafsBack[i].leafX,_leafsBack[i].leafY) < r_root) {
              _leafsBack.splice(_leafsBack.length - 1, 1);
              break;
            }
          }
          if (shafxrand()*4 > 1) {
            leafR = leafLightColorR[randomLeafLightColorNumber] + shafxrand()*10;
            leafG = leafLightColorG[randomLeafLightColorNumber] + shafxrand()*10;
            leafB = leafLightColorB[randomLeafLightColorNumber] + shafxrand()*10;
            _leafsBack.push(
              new leaf(
                this.x + this.r * r_root * cos(radians(randomA)),
                this.y + this.r * r_root * sin(radians(randomA)),
                5+shafxrand()*2,16+shafxrand()*2,shafxrand()*360,leafR,leafG,leafB,130));
            for (let i = 0; i < _leafsBack.length - 1; i++) {
              if (dist(this.x + this.r * r_root * cos(radians(randomA)),
                       this.y + this.r * r_root * sin(radians(randomA)),
                       _leafsBack[i].leafX,_leafsBack[i].leafY) < r_root) {
                _leafsBack.splice(_leafsBack.length - 1, 1);
                break;
              }
            }
          }
        } else {
          let leafR = leafDarkColorR[randomLeafDarkColorNumber] + shafxrand()*8;
          let leafG = leafDarkColorG[randomLeafDarkColorNumber] + shafxrand()*8;
          let leafB = leafDarkColorB[randomLeafDarkColorNumber] + shafxrand()*8;
          _leafsFront.push(
            new leaf(this.x + this.r * r_root * cos(radians(randomA)),
                     this.y + this.r * r_root * sin(radians(randomA)),
                     2+shafxrand()*3,11+shafxrand()*4,shafxrand()*360,leafR,leafG,leafB,130));
          for (let i = 0; i < _leafsFront.length - 1; i++) {
            if (dist(this.x + this.r * r_root * cos(radians(randomA)),
                     this.y + this.r * r_root * sin(radians(randomA)),
                     _leafsFront[i].leafX,_leafsFront[i].leafY) < r_root) {
              _leafsFront.splice(_leafsFront.length-1, 1);
              break;
            }
          }
        }
      }
      if (shafxrand()*(100 + this.r * 0.1 + Rs.length) > 99 + Rs.length) {
        recursionCircle(_leafsBack, _leafsFront, this.x, this.y, 100, 5);
        let rootA = 15+shafxrand()*35;
        let proportionR = 1.05+shafxrand()*0.18;
        if (shafxrand()*2 > 1) {
          if (rootGrowDec < 1) {
            rootGrowDec = rootGrowDec + 0.001;
          }
          if (Rs.length < rootSizeMax) {
            Rs.push(new Root(this.x,this.y,this.r * proportionR,this.a + rootA,rootGrowDec));
          }
        } else {
          if (rootGrowDec < 1) {
            rootGrowDec = rootGrowDec + 0.001;
          }
          if (Rs.length < rootSizeMax) {
            Rs.push(new Root(this.x,this.y,this.r * proportionR,this.a - rootA,rootGrowDec));
          }
        }
      }
      if (rootCount == 0) {
        if (this.r < 25) {
          let rootA = 25+shafxrand()*30;
          let proportionR = 1.01+shafxrand()*0.22;
          if (rootDir == 1) {
            if (Rs.length < rootSizeMax) {
              Rs.push(new Root(this.x,this.y,this.r * proportionR,this.a + rootA,0.997));
            }
          } else {
            if (Rs.length < rootSizeMax) {
              Rs.push(new Root(this.x,this.y,this.r * proportionR,this.a - rootA,0.997));
            }
          }
          rootCount++;
        }
      }
      if (rootCount == 1) {
        if (this.r < 20) {
          let rootA = 25+shafxrand()*30;
          let proportionR = 1.01+shafxrand()*0.22;
          if (rootDir == 1) {
            if (Rs.length < rootSizeMax) {
              Rs.push(new Root(this.x,this.y,this.r * proportionR,this.a - rootA,0.997));
            }
          } else {
            if (Rs.length < rootSizeMax) {
              Rs.push(new Root(this.x,this.y,this.r * proportionR,this.a + rootA,0.997));
            }
          }
          rootCount++;
        }
      }
    }
  }

  drawRoot(_treePG, _CRsw, _CRsg1, _CRsg2, _CRsb) {
    _treePG.stroke(100, 100, 100, 64);
    _treePG.strokeWeight(this.r * 1.2 + 2);
    _treePG.line(this.x,this.y, this.x+this.r*0.3*cos(radians(this.a)),this.y+this.r*0.3* sin(radians(this.a)));
    _treePG.point(this.x, this.y);
    _treePG.point(this.x+this.r*0.3*cos(radians(this.a)),this.y+this.r*0.3*sin(radians(this.a)));

    _treePG.stroke(30, 30, 30, 200);
    _treePG.strokeWeight(this.r);
    _treePG.line(this.x,this.y,
      this.x + this.r * 0.3 * cos(radians(this.a)),this.y + this.r * 0.3 * sin(radians(this.a)));
    _treePG.point(this.x, this.y);
    _treePG.point(this.x+this.r*0.3*cos(radians(this.a)),this.y+this.r*0.3*sin(radians(this.a)));

    if (this.r > 4) {
      _CRsw.push(new colorRoot(this.x,this.y,
          this.x + this.r * 0.3 * cos(radians(this.a)),this.y + this.r * 0.3 * sin(radians(this.a)),
          this.r * 0.9 - 3,255,255,255,255));

      let newX1 = this.x + this.r * 0.2 * cos(radians(this.a + 90));
      let newY1 = this.y + this.r * 0.2 * sin(radians(this.a + 90));
      let newX2 =this.x +this.r * 0.3 * cos(radians(this.a)) +this.r * 0.2 * cos(radians(this.a + 90));
      let newY2 =this.y +this.r * 0.3 * sin(radians(this.a)) +this.r * 0.2 * sin(radians(this.a + 90));
      _CRsg1.push(new colorRoot(newX1,newY1,newX2,newY2,this.r * 0.5 - 3,191,191,191,255));

      newX1 = this.x + this.r * 0.3 * cos(radians(this.a + 90));
      newY1 = this.y + this.r * 0.3 * sin(radians(this.a + 90));
      newX2 =this.x +this.r * 0.3 * cos(radians(this.a)) +this.r * 0.3 * cos(radians(this.a + 90));
      newY2 =this.y +this.r * 0.3 * sin(radians(this.a)) +this.r * 0.3 * sin(radians(this.a + 90));
      _CRsg2.push(new colorRoot(newX1,newY1,newX2,newY2,this.r * 0.3 - 3,127,127,127,255));
    }

    if (this.r > 2) {
      let textureX1 =this.x + this.r * this.shiftR1 * cos(radians(this.a + 90));
      let textureY1 =this.y + this.r * this.shiftR1 * sin(radians(this.a + 90));
      let textureX2 =this.x+this.r*0.3*cos(radians(this.a))+this.r*this.shiftR1*cos(radians(this.a+90));
      let textureY2 =this.y+this.r*0.3*sin(radians(this.a))+this.r*this.shiftR1*sin(radians(this.a+90));
      _CRsb.push(new colorRoot(textureX1,textureY1,textureX2,textureY2,1,51,51,51,100));
      if (shafxrand()*10 > 9) {
        this.shiftR1 = -0.4+shafxrand()*0.7;
      }
      textureX1 = this.x + this.r * this.shiftR2 * cos(radians(this.a + 90));
      textureY1 = this.y + this.r * this.shiftR2 * sin(radians(this.a + 90));
      textureX2 =this.x+this.r*0.3*cos(radians(this.a))+this.r*this.shiftR2*cos(radians(this.a+90));
      textureY2 =this.y+this.r*0.3*sin(radians(this.a))+this.r*this.shiftR2*sin(radians(this.a+90));
      _CRsb.push(new colorRoot(textureX1,textureY1,textureX2,textureY2,1,38,38,38,100));
      if (shafxrand()*10 > 9) {
        this.shiftR2 = -0.4+shafxrand()*0.7;
      }
    }
  }
}

class colorRoot {
  constructor(_x1, _y1, _x2, _y2, _lw, _r, _g, _b, _a) {
    this.x1 = _x1;
    this.y1 = _y1;
    this.x2 = _x2;
    this.y2 = _y2;
    this.lineWidth = _lw;
    this.R = _r;
    this.G = _g;
    this.B = _b;
    this.A = _a;
  }
  drawColorRoot(_treePG) {
    _treePG.stroke(this.R, this.G, this.B, this.A);
    _treePG.strokeWeight(this.lineWidth * 0.9);
    _treePG.point(this.x1, this.y1);
    _treePG.point(this.x2, this.y2);
    _treePG.strokeWeight(this.lineWidth);
    _treePG.line(this.x1, this.y1, this.x2, this.y2);
  }
}

function recursionCircle(_leafsBack, _leafsFront, x, y, r, n) {
  if (n > 0) {
    if (shafxrand()*3 > 2) {
      if (shafxrand()*2 > 1) {
        let leafLightR = leafLightColorR[randomLeafLightColorNumber];
        let leafLightG = leafLightColorG[randomLeafLightColorNumber];
        let leafLightB = leafLightColorB[randomLeafLightColorNumber];
        _leafsBack.push(new leaf(x,y,5+shafxrand()*1,15+shafxrand()*2,shafxrand()*360,
                                 leafLightR,leafLightG,leafLightB,130));
        for (let i = 0; i < _leafsBack.length - 1; i++) {
          if (dist(x, y, _leafsBack[i].leafX, _leafsBack[i].leafY) < 6) {
            _leafsBack.splice(_leafsBack.length - 1, 1);
            break;
          }
        }
        if (shafxrand()*2 > 1) {
          _leafsBack.push(new leaf(x,y,5+shafxrand()*1,15+shafxrand()*2,shafxrand()*360,
              leafLightR + 20,leafLightG + 20,leafLightB + 20,130));
          for (let i = 0; i < _leafsBack.length - 1; i++) {
            if (dist(x, y, _leafsBack[i].leafX, _leafsBack[i].leafY) < 6) {
              _leafsBack.splice(_leafsBack.length - 1, 1);
              break;
            }
          }
        }
      } else {
        let leafDarkR = leafDarkColorR[randomLeafDarkColorNumber];
        let leafDarkG = leafDarkColorG[randomLeafDarkColorNumber];
        let leafDarkB = leafDarkColorB[randomLeafDarkColorNumber];
        _leafsFront.push(new leaf(x,y,3+shafxrand()*3,12+shafxrand()*4,shafxrand()*360,
            leafDarkR,leafDarkG,leafDarkB,130));
        for (let i = 0; i < _leafsFront.length - 1; i++) {
          if (dist(x, y, _leafsFront[i].leafX, _leafsFront[i].leafY) < 6) {
            _leafsFront.splice(_leafsFront.length - 1);
            break;
          }
        }
      }
    }
    for (let a = 0; a < 360; a = a + 30+shafxrand()*60) {
      let r_proportion = 0.3+shafxrand()*0.4;
      let newX = x + r * r_proportion * cos(radians(a));
      let newY = y + r * r_proportion * sin(radians(a));
      if (shafxrand()*2 > 1) {
        recursionCircle(_leafsBack, _leafsFront, newX, newY, r * 0.5, n - 1);
      }
    }
  }
}

class leaf {
  constructor(_x, _y, _w, _h, _a, _R, _G, _B, _A) {
    this.leafX = _x;
    this.leafY = _y;
    this.leafW = _w;
    this.leafH = _h;
    this.leafA = _a;
    this.leafH_proportion1 = 0.4+shafxrand()*0.02;
    this.leafH_proportion2 = 0.6+shafxrand()*0.17;
    this.R = _R;
    this.G = _G;
    this.B = _B;
    this.A = _A;
  }

  drawLeaf(_treePG) {
    _treePG.push();
    _treePG.translate(this.leafX, this.leafY);
    _treePG.rotate(radians(this.leafA));
    _treePG.noStroke();
    _treePG.fill(this.R, this.G, this.B, this.A);
    _treePG.beginShape();
    _treePG.curveVertex(0, -this.leafH * 0.5);
    _treePG.curveVertex(0, -this.leafH * 0.5);
    _treePG.curveVertex(this.leafW * 0.4, -this.leafH * this.leafH_proportion1);
    _treePG.curveVertex(this.leafW * 0.7, 0);
    _treePG.curveVertex(this.leafW, this.leafH * this.leafH_proportion2);
    _treePG.curveVertex(0, this.leafH);
    _treePG.curveVertex(-this.leafW, this.leafH * this.leafH_proportion2);
    _treePG.curveVertex(-this.leafW * 0.7, 0);
    _treePG.curveVertex(-this.leafW * 0.4,-this.leafH * this.leafH_proportion1);
    _treePG.curveVertex(0, -this.leafH * 0.5);
    _treePG.curveVertex(0, -this.leafH * 0.5);
    _treePG.endShape();
    _treePG.pop();
  }
}

// ===========================
// function
// ===========================

function paintMountain() {
  drawSmallBackTreeFlag = true;
  drawSmallFrontTreeFlag = true;
  drawMountainFlag = true;

  generateLeftMountain(mountainP,
    mountainColorR[randomMountainColorNumber],
    mountainColorG[randomMountainColorNumber],
    mountainColorB[randomMountainColorNumber]);
  generateRightMountain(mountainP,
    mountainColorR[randomMountainColorNumber],
    mountainColorG[randomMountainColorNumber],
    mountainColorB[randomMountainColorNumber]);
  
  let sumL1 = 0;
  for (let i = 0; i < ims.length; i++) {
    sumL1 = sumL1 + ims[i].sumOfLeftDownPoint(mountainP);
  }
  let sumR1 = 0; 
  for (let i = 0; i < ims.length; i++) {
    sumR1 = sumR1 + ims[i].sumOfRightDownPoint(mountainP);
  }
  if (sumL1 > sumR1) {
    frontTreePosition = -1;
    Rs.push(new Root(10+shafxrand()*40,treeFrontPG.height+50,40,-90+(20+shafxrand()*10), rootGrowDec));
    startGrow = 1;
    rootDir = 1;
    sealPx = borderP.width-(140+shafxrand()*30);
    sealPy = borderP.height-(100+shafxrand()*50);
  } else {
    frontTreePosition = 1;
    Rs.push(new Root(treeFrontPG.width-(10+shafxrand()*40), treeFrontPG.height+50, 40, -90-(20+shafxrand()*10), rootGrowDec));
    startGrow = 1;
    rootDir = -1;
    sealPx = 140+shafxrand()*30;
    sealPy = borderP.height-(100+shafxrand()*50);
  }
  
  if (shafxrand()*10 > 9) {
    generateCenterMountain(mountainP,
      mountainColorR[randomMountainColorNumber],
      mountainColorG[randomMountainColorNumber],
      mountainColorB[randomMountainColorNumber]);
  }
}

function calLeftRightPoint(){
  let closedLeftDistance = allW;
  let closedLeftNumber = 0;
  for (let i = 0; i < ims.length; i++) {
    if (abs(ims[i].getMountainLeftBorderPoint().x) < closedLeftDistance) {
      closedLeftDistance = abs(ims[i].getMountainLeftBorderPoint().x);
      closedLeftNumber = i;
    }
  }

  leftPointX = ims[closedLeftNumber].getMountainLeftBorderPoint().x;
  leftPointY = ims[closedLeftNumber].getMountainLeftBorderPoint().y;
  let closedRightDistance = allW;
  let closedRightNumber = 0;
  for (let i = ims_leftNumber + 1; i < ims.length; i++) {
    if (abs(allW - ims[i].getMountainRightBorderPoint().x) < closedRightDistance) {
      closedRightDistance = abs(
        allW - ims[i].getMountainRightBorderPoint().x
      );
      closedRightNumber = i;
    }
  }

  rightPointX = ims[closedRightNumber].getMountainRightBorderPoint().x;
  rightPointY = ims[closedRightNumber].getMountainRightBorderPoint().y;
}

function paintBG() {
  //calLeftRightPoint();
  
  let bg_center_h = 0;
  if (leftPointY < rightPointY) {
    bg_center_h = rightPointY * (float(height) / float(mountainP.height));
  } else {
    bg_center_h = leftPointY * (float(height) / float(mountainP.height));
  }
  init_inkBG(bg_center_h);
}

// init color
function init_color() {
  mountainColorR[0] = 74;
  mountainColorG[0] = 105;
  mountainColorB[0] = 79;
  mountainColorR[1] = 73;
  mountainColorG[1] = 86;
  mountainColorB[1] = 83;
  mountainColorR[2] = 116;
  mountainColorG[2] = 126;
  mountainColorB[2] = 93;
  mountainColorR[3] = 102;
  mountainColorG[3] = 104;
  mountainColorB[3] = 83;
  mountainColorR[4] = 47;
  mountainColorG[4] = 55;
  mountainColorB[4] = 52;
  mountainColorR[5] = 20;
  mountainColorG[5] = 20;
  mountainColorB[5] = 20;
  mountainColorR[6] = 100;
  mountainColorG[6] = 100;
  mountainColorB[6] = 100;
  mountainColorR[7] = 200;
  mountainColorG[7] = 200;
  mountainColorB[7] = 200;
  mountainColorR[8] = 138;
  mountainColorG[8] = 119;
  mountainColorB[8] = 88;
  mountainColorR[9] = 142;
  mountainColorG[9] = 142;
  mountainColorB[9] = 89;
  mountainColorR[10] = 87;
  mountainColorG[10] = 50;
  mountainColorB[10] = 31;

  bgColorR[0] = 20;
  bgColorG[0] = 27;
  bgColorB[0] = 64;
  bgColorR[1] = 27;
  bgColorG[1] = 69;
  bgColorB[1] = 62;
  bgColorR[2] = 71;
  bgColorG[2] = 55;
  bgColorB[2] = 44;
  bgColorR[3] = 16;
  bgColorG[3] = 30;
  bgColorB[3] = 82;//52;
  bgColorR[4] = 69;
  bgColorG[4] = 46;
  bgColorB[4] = 30;
  bgColorR[5] = 43;
  bgColorG[5] = 11;
  bgColorB[5] = 74;
  bgColorR[6] = 21;
  bgColorG[6] = 6;
  bgColorB[6] = 9;
  bgColorR[7] = 0;
  bgColorG[7] = 50;
  bgColorB[7] = 0;
  bgColorR[8] = 36;
  bgColorG[8] = 16;
  bgColorB[8] = 25;  
  bgColorR[9] = 20;
  bgColorG[9] = 0;
  bgColorB[9] = 0;
  bgColorR[10] = 41;
  bgColorG[10] = 14;
  bgColorB[10] = 67;
  bgColorR[11] = 255;
  bgColorG[11] = 255;
  bgColorB[11] = 255;
  bgColorR[12] = 64;
  bgColorG[12] = 27;
  bgColorB[12] = 20;
  bgColorR[13] = 82;
  bgColorG[13] = 30;
  bgColorB[13] = 16;

  leafLightColorR[0] = 122;
  leafLightColorG[0] = 129;
  leafLightColorB[0] = 92;
  leafLightColorR[1] = 91;
  leafLightColorG[1] = 134;
  leafLightColorB[1] = 110;
  leafLightColorR[2] = 85;
  leafLightColorG[2] = 140;
  leafLightColorB[2] = 132;
  leafLightColorR[3] = 221;
  leafLightColorG[3] = 169;
  leafLightColorB[3] = 113;
  leafLightColorR[4] = 144;
  leafLightColorG[4] = 159;
  leafLightColorB[4] = 175;
  leafLightColorR[5] = 180;
  leafLightColorG[5] = 150;
  leafLightColorB[5] = 168;
  leafLightColorR[6] = 60;
  leafLightColorG[6] = 108;
  leafLightColorB[6] = 68;
  leafLightColorR[7] = 140;
  leafLightColorG[7] = 119;
  leafLightColorB[7] = 51;
  leafLightColorR[8] = 98;
  leafLightColorG[8] = 73;
  leafLightColorB[8] = 61;
  leafLightColorR[9] = 111;
  leafLightColorG[9] = 117;
  leafLightColorB[9] = 98;
  leafLightColorR[10] = 110;
  leafLightColorG[10] = 132;
  leafLightColorB[10] = 76;
  leafLightColorR[11] = 250;
  leafLightColorG[11] = 250;
  leafLightColorB[11] = 250;
  leafLightColorR[12] = 200;
  leafLightColorG[12] = 200;
  leafLightColorB[12] = 200;
  leafLightColorR[13] = 150;
  leafLightColorG[13] = 150;
  leafLightColorB[13] = 150;
  leafLightColorR[14] = 190;
  leafLightColorG[14] = 190;
  leafLightColorB[14] = 190;

  leafDarkColorR[0] = 39;
  leafDarkColorG[0] = 47;
  leafDarkColorB[0] = 33;
  leafDarkColorR[1] = 30;
  leafDarkColorG[1] = 51;
  leafDarkColorB[1] = 44;
  leafDarkColorR[2] = 71;
  leafDarkColorG[2] = 84;
  leafDarkColorB[2] = 91;
  leafDarkColorR[3] = 174;
  leafDarkColorG[3] = 90;
  leafDarkColorB[3] = 64;
  leafDarkColorR[4] = 85;
  leafDarkColorG[4] = 93;
  leafDarkColorB[4] = 105;
  leafDarkColorR[5] = 117;
  leafDarkColorG[5] = 91;
  leafDarkColorB[5] = 114;
  leafDarkColorR[6] = 40;
  leafDarkColorG[6] = 71;
  leafDarkColorB[6] = 50;
  leafDarkColorR[7] = 71;
  leafDarkColorG[7] = 75;
  leafDarkColorB[7] = 44;
  leafDarkColorR[8] = 182;
  leafDarkColorG[8] = 80;
  leafDarkColorB[8] = 47;
  leafDarkColorR[9] = 46;
  leafDarkColorG[9] = 52;
  leafDarkColorB[9] = 40;
  leafDarkColorR[10] = 52;
  leafDarkColorG[10] = 62;
  leafDarkColorB[10] = 38;
  leafDarkColorR[11] = 200;
  leafDarkColorG[11] = 200;
  leafDarkColorB[11] = 200;
  leafDarkColorR[12] = 150;
  leafDarkColorG[12] = 150;
  leafDarkColorB[12] = 150;
  leafDarkColorR[13] = 90;
  leafDarkColorG[13] = 90;
  leafDarkColorB[13] = 90;
  leafDarkColorR[14] = 60;
  leafDarkColorG[14] = 60;
  leafDarkColorB[14] = 60;  
}

// The second version
function calCircleDist(x, y, R, i) {
  let max = int(shafxrand()*3 + 1);
  for (let j = 0; j < max; j++) {
    let a = shafxrand()*360;
    let proportion = 0.4+shafxrand()*0.4;
    let newPx = x + R * cos(radians(a));
    let newPy = y + R * sin(radians(a));
    let valFlag = false;
    for (let k = 0; k < 5; k++) {
      a = shafxrand()*360;
      proportion = 0.4+shafxrand()*0.4;
      newPx = x + R * cos(radians(a));
      newPy = y + R * sin(radians(a));
      valFlag = false;
      for (let l = 0; l < mPs.length; l++) {
        let px = mPs[l].x;
        let py = mPs[l].y;
        if (dist(newPx, newPy, px, py) < minDistance) {
          valFlag = true;
          break;
        }
      }
      if (valFlag == true) {
        continue;
      } else {
        break;
      }
    }
    if (i > 0) {
      if (valFlag == false && mPs.length < maxNumber) {
        mPs.push(new createVector(newPx, newPy));
        calCircleDist(newPx, newPy, R * proportion, i - 1);
      }
    }
  }
}

function growMountain(cpx, cpy, mW, mH, mountainNumber, decA, _r, _g, _b) {
  ims.push(
    new Ink_Mountain(cpx,cpy,mW,mH,0.9,-(0.4+shafxrand()*0.2),-(0.4+shafxrand()*0.2),
      decA,_r - int(shafxrand()*2),_g + int(shafxrand()*2),_b - int(shafxrand()*2)));
  let nowMountainNumber = ims.length - 1;
  ims[nowMountainNumber].generate_a_lof_of_point_mountain();
  for (let i = 0; i < mountainNumber; i++) {
    let a = ims[nowMountainNumber].generateInnerPoints().copy();
    mW = mW * (0.6+shafxrand()*0.3);
    mH = mH * (0.7+shafxrand()*0.2);
    ims.push(
      new Ink_Mountain(a.x,a.y,mW,mH,0.9,-0.5,-0.5,decA,
        _r - int(shafxrand()*2),_g + int(shafxrand()*2),_b - int(shafxrand()*2)));
    ims[ims.length - 1].generate_a_lof_of_point_mountain();
  }
}

function generate_a_lot_of_mountains(mx, my, decA, _r, _g, _b) {
  mPs.splice(0, mPs.length);
  calCircleDist(mx, my, 200, 5);
  for (let i = 0; i < mPs.length; i++) {
    let px = mPs[i].x;
    let py = mPs[i].y;
    growMountain(px,py,100+shafxrand()*100,100+shafxrand()*100,
      5,decA,_r - int(shafxrand()*2),_g + int(shafxrand()*2),_b - int(shafxrand()*2));
  }
}

// ====================================
// loadFile
// ====================================
function loadFile() {
  for (let j = 0; j < 5; j++) {
    leafs[j] = createGraphics(200, 200, P2D);
    recursionLeaf(LUs, 100, 100, 65, 7);
    for (let i = 0; i < LUs.length; i++) {
      LUs[i].drawLeaf(leafs[j]);
    }
  }  
}

//////////////////////////////////////////////////////////////
// PLEASE INCLUDE THIS PART INTO YOUR SKETCH SCRIPT
// THE
/////////////////////////////////////////////////////////////


// please call this function when you calculated your StartY and EndY
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

// please use this function to start draw
// this will be called after the offset value is calulated,
// or will be called if no offset value needed (when viewing the NFT alone)
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

