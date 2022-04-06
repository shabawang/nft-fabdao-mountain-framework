import { Draw, Mesh, Geom } from "alfrid";

import vs from "shaders/mountain.vert";
import fs from "shaders/mountain.frag";

class DrawMountain extends Draw {
  constructor() {
    super();

    const mesh = Geom.plane(10, 10, 100, "xz");

    this.setMesh(mesh).useProgram(vs, fs);
  }
}

export default DrawMountain;
