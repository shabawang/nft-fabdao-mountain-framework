import { GL, Draw, Mesh } from "alfrid";
import { random } from "./utils";

import vs from "shaders/reflection.vert";
import fs from "shaders/reflection.frag";

class DrawReflection extends Draw {
  constructor() {
    super();

    let num = 2700;
    const positions = [];
    const indices = [];

    const { sin, cos, PI, sqrt, floor } = Math;
    const getPos = () => {
      const r = 3;
      const rz = 50;
      let z = random(-rz, rz);
      let x = random(-r, r);
      const gap = 0.5;
      z = floor(z / gap) * gap + random(-gap * 0.2, gap * 0.2);
      return [x, random(), z];
    };

    while (num--) {
      positions.push(getPos());
      indices.push([num]);
    }

    const mesh = new Mesh(GL.POINTS)
      .bufferVertex(positions)
      .bufferIndex(indices);

    this.setMesh(mesh).useProgram(vs, fs).uniform("uTranslate", [0, 1, -2]);
  }
}

export default DrawReflection;
