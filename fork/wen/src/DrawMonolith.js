import { Geom, Draw } from "alfrid";

import { random } from "./utils";
import vs from "shaders/monolith.vert";
import fs from "shaders/monolith.frag";

class DrawMonolith extends Draw {
  constructor() {
    super();

    const mesh = Geom.cube(1, 1, 1);

    const posOffsets = [];
    const extras = [];

    let num = 300;
    const r = 10;
    while (num--) {
      posOffsets.push([random(-r, r) * 0.25, random(), random(-r, r)]);
      extras.push([random(), random(), random()]);
    }

    mesh
      .bufferInstance(posOffsets, "aPosOffset")
      .bufferInstance(extras, "aExtra");

    this.setMesh(mesh).useProgram(vs, fs);
  }
}

export default DrawMonolith;
