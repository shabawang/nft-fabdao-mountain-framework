import { GL, Mesh, Draw, Geom } from "alfrid";

import { random, randomGaussian } from "./utils";

import vs from "shaders/petals.vert";
import fs from "shaders/petals.frag";

class DrawSnow extends Draw {
  constructor() {
    super();

    // const mesh = Geom.plane(1, 1, 1);

    const posOffsets = [];
    const extras = [];
    const indices = [];

    const r = 10;
    let num = 2500;
    const z = -5;

    const { sin, PI } = Math;

    while (num--) {
      const p = random(-1, 1);
      const t = 1 - sin((p * 0.5 + 0.5) * PI);
      posOffsets.push([p * r, randomGaussian(-2, 3 + t * 10), z]);
      extras.push([randomGaussian(), random(), random()]);
      indices.push(num);
    }

    const mesh = new Mesh(GL.POINTS)
      .bufferVertex(posOffsets)
      .bufferNormal(extras)
      .bufferIndex(indices);

    this.setMesh(mesh).useProgram(vs, fs).uniform("uOffset", 1);
  }

  draw() {
    GL.disable(GL.DEPTH_TEST);
    super.draw();
    GL.enable(GL.DEPTH_TEST);
  }
}

export default DrawSnow;
