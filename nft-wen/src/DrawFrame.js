import { Draw, Geom, ShaderLibs } from "alfrid";
import { random } from "./utils";
import fs from "shaders/frame.frag";

class DrawFrame extends Draw {
  constructor() {
    super();

    this.setMesh(Geom.bigTriangle())
      .useProgram(ShaderLibs.bigTriangleVert, fs)
      .uniform("uWidth", 0.05)
      .uniform("uSeed", random());
  }
}

export default DrawFrame;
