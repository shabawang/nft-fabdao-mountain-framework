import { Draw, Geom } from "alfrid";

import { random, randomGaussian } from "./utils";

import vs from "shaders/snow.vert";
import fs from "shaders/snow.frag";

class DrawSnow extends Draw {
  constructor() {
    super();

    const mesh = Geom.sphere(1, 12);

    const posOffsets = [];
    const extras = [];

    const r = 20;
    let num = 1500;
    while (num--) {
      posOffsets.push([random(-r, r), random(0, r), random(-r, r)]);
      extras.push([randomGaussian(), random(), random()]);
    }

    mesh
      .bufferInstance(posOffsets, "aPosOffset")
      .bufferInstance(extras, "aExtra");

    this.setMesh(mesh).useProgram(vs, fs).uniform("uOffset", 1);
  }
}

export default DrawSnow;
