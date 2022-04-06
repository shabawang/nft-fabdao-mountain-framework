import { Draw, Geom, ShaderLibs } from "alfrid";

import fs from "shaders/combine.frag";

class DrawCombine extends Draw {
  constructor() {
    super();

    this.setMesh(Geom.bigTriangle()).useProgram(ShaderLibs.bigTriangleVert, fs);
  }
}

export default DrawCombine;
