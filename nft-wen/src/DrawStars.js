import { Draw, Geom } from "alfrid";

import { random, randomGaussian } from "./utils";

import vs from "shaders/stars.vert";
import fs from "shaders/stars.frag";

class DrawStars extends Draw {
  constructor() {
    super();

    const mesh = Geom.sphere(1, 12);

    const posOffsets = [];
    const extras = [];

    const r = 30;
    let num = 100;

    // avoiding moon position
    while (num--) {
      // let x = random(r * 0.2, r);
      let x = random(0, r);
      if (random() > 0.5) x *= -1;
      posOffsets.push([x, random(r * 0.35, r * 2), random(-r, -r * 2)]);
      extras.push([randomGaussian(), random(), random()]);
    }

    mesh
      .bufferInstance(posOffsets, "aPosOffset")
      .bufferInstance(extras, "aExtra");

    this.setMesh(mesh).useProgram(vs, fs).uniform("uOffset", 1);
  }
}

export default DrawStars;
