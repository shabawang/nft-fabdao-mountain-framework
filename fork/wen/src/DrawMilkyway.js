import { Draw, Geom, GL } from "alfrid";
import { random } from "./utils";
import Config from "./Config";
import vs from "shaders/milkyway.vert";
import fs from "shaders/milkyway.frag";

class DrawMilkyway extends Draw {
  constructor() {
    super();

    const s = 5;
    const mesh = Geom.plane(s, s, 1);

    let num = 20000;
    const posOffsets = [];
    const extras = [];
    const rx = 20;
    let ry = 3;
    while (num--) {
      let x = random(-rx, rx);
      let y = random(-ry, ry);
      posOffsets.push([x, y, random()]);
      extras.push([random(), random(), random(), 0]);
    }

    // stars
    num = 800;
    ry = 5;
    while (num--) {
      let x = random(-rx, rx);
      let y = random(-ry, ry);
      posOffsets.push([x, y, random()]);
      extras.push([random(), random(), random(), 1]);
    }

    mesh
      .bufferInstance(posOffsets, "aPosOffset")
      .bufferInstance(extras, "aExtra");

    let rotation = random(0.8, 0.4);
    if (random() > 0.5) {
      rotation *= -2.0;
    }

    this.setMesh(mesh)
      .useProgram(vs, fs)
      .uniform("uRotation", rotation)
      .uniform("uRange", 3);
  }

  draw() {
    GL.disable(GL.DEPTH_TEST);
    super.draw();
    GL.enable(GL.DEPTH_TEST);
  }
}

export default DrawMilkyway;
