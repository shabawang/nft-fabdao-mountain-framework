import { Draw, Geom } from "alfrid";

import { random } from "./utils";

import vs from "shaders/snow.vert";
import fs from "shaders/snow.frag";

class DrawSnow extends Draw {
  constructor() {
    super();

    const mesh = Geom.sphere(1, 12);

    const posOffsets = [];
    const extras = [];

    const r = 5;
    let num = 5000;
    while (num--) {
      posOffsets.push([random(-r, r), random(0, r), random(0, r * 2)]);
      extras.push([random(), random(), random()]);
    }

    mesh
      .bufferInstance(posOffsets, "aPosOffset")
      .bufferInstance(extras, "aExtra");

    this.setMesh(mesh).useProgram(vs, fs);
  }
}

export default DrawSnow;
