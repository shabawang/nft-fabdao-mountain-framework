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
import Settings from "./Settings";
import { logError, random, getRandomElement } from "./utils";
import preload from "./utils/preload";
import "./utils/Capture";

import "./debug";
import addControls from "./utils/addControl";
import Config from "./Config";

let scene;
let canvas;

function _init3D() {
  if (process.env.NODE_ENV === "development") {
    // Settings.init();
  }

  if (process.env.NODE_ENV !== "development") {
    Config.colorTheme = getRandomElement([
      "Sunset",
      "Night",
      "Green",
      "Foggy",
      "Blue",
    ]);
    Config.withFrame = false;
    Config.withStretchLine = random() > 0.5;
    Config.withSnow = random() > 0.5;
    Config.pixelated = random() > 0.5;
    Config.mountainShade = random() > -0.5;
  }
  // Settings.refresh();
  canvas = document.createElement("canvas");
  canvas.id = "main-canvas";
  document.body.appendChild(canvas);

  GL.init(canvas, { alpha: true, preserveDrawingBuffer: true });

  scene = new Scene();
  if (process.env.NODE_ENV === "development") {
    addControls(scene);
  }
}

preload().then(_init3D, logError);
