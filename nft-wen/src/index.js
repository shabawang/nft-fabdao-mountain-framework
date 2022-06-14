// these are the variables you can use as inputs to your algorithms
// console.log(fxhash); // the 64 chars hex number fed to your algorithm
// console.log(fxrand()); // deterministic PRNG function, use it instead of Math.random()

// note about the fxrand() function
// when the "fxhash" is always the same, it will generate the same sequence of
// pseudo random numbers, always

//----------------------
// defining features
//----------------------
// You can define some token features by populating the $fxhashFeatures property
// of the window object.
// More about it in the guide, section features:
// [https://fxhash.xyz/articles/guide-mint-generative-token#features]
//
// window.$fxhashFeatures = {
//   "Background": "Black",
//   "Number of lines": 10,
//   "Inverted": true
// }

import { GL } from "alfrid";
import Scene from "./SceneApp";
import { randomFloor, random, getRandomElement, logError } from "./utils";
import preload from "./utils/preload";
import "./utils/Capture";

import Config from "./Config";

let canvas;

function _init3D() {
  // apply features
  Config.colorTheme = getRandomElement([
    "Sunset",
    "Night",
    "Green",
    "Foggy",
    "Blue",
  ]);
  const r = 4;
  Config.moonPosition = random(r / 2, r);
  if (random() > 0.5) {
    Config.moonPosition *= -1;
  }
  Config.superMoon = random() > 0.85;
  if (Config.superMoon) {
    Config.moonPosition = random() > 0.5 ? 7 : -7;
  }

  // shooting stars
  let themeIndex = randomFloor(3);
  Config.withFireworks = false;
  Config.withShooringStar = false;
  Config.withMoon = false;
  Config.withMilkyway = random() > 0.5;
  Config.maxHeight = randomFloor(2, 6);

  if (themeIndex === 0) {
    Config.withShooringStar = true;
    Config.meterShower = random() > 0.85;
    Config.withMoon = false;
    const r = 3;
    Config.moonPosition = random(-r, r);
  } else if (themeIndex === 1) {
    Config.withShooringStar = false;
    Config.meterShower = false;
    Config.withMoon = true;
  } else {
    Config.withFireworks = true;
    Config.withMilkyway = false;
  }

  Config.withSnow = random() > 0.5;
  Config.withStretchLine = true;
  Config.pixelated = false;

  Config.withPetals = random() > 0.9;
  Config.withMonolith = false;
  Config.monochrome = random() > 0.9;

  canvas = document.createElement("canvas");
  canvas.id = "main-canvas";
  document.body.appendChild(canvas);

  GL.init(canvas, { alpha: false, preserveDrawingBuffer: true });

  new Scene();
}

preload().then(_init3D, logError);
