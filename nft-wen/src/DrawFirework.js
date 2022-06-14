import { Draw, Geom } from "alfrid";
import { random } from "./utils";
import Config from "./Config";
import vs from "shaders/firework.vert";
import fs from "shaders/firework.frag";

class DrawFirework extends Draw {
  constructor() {
    super();

    const { moonPosition, superMoon } = Config;
    const mesh = Geom.sphere(0.1, 12);

    const posOffsets = [];
    const extras = [];

    let numFireworks = 2;
    const dir = moonPosition > 0 ? -1 : 1;

    while (numFireworks--) {
      let x = random(-2, 2);
      let y;
      if (numFireworks === 0) {
        y = random(-5, -2);
      } else {
        y = random(1, 4);
      }
      let scale = random(0.5, 0.8);
      let num = 200;
      while (num--) {
        posOffsets.push([x, y, scale]);
        extras.push([random(), random(), random()]);
      }
    }

    mesh
      .bufferInstance(extras, "aExtra")
      .bufferInstance(posOffsets, "aPosOffset");

    this.setMesh(mesh).useProgram(vs, fs);
  }
}

export default DrawFirework;
