import { Draw, Geom } from "alfrid";

import Config from "./Config";
import vs from "shaders/mountain.vert";
import fs from "shaders/mountain.frag";

class DrawMountain extends Draw {
  constructor() {
    super();

    const s = Config.planeSize * 2;
    const mesh = Geom.plane(s, s, 100, "xz");

    this.setMesh(mesh)
      .useProgram(vs, fs)
      .uniform("uPlaneSize", s * 0.5);
  }
}

export default DrawMountain;
