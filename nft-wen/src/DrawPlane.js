import { Draw, Mesh } from "alfrid";
import { mix, random } from "./utils";
import Config from "./Config";
import vs from "shaders/plane.vert";
import fs from "shaders/plane.frag";

class DrawPlane extends Draw {
  constructor() {
    super();

    const { planeSize: s } = Config;

    const mesh = (() => {
      const numX = 200;
      const numY = 10;
      const beltWidth = 0.05;
      const positions = [];
      const indices = [];
      let count = 0;

      const getPos = (i, j) => {
        let x = (i / numX - 0.5) * s * 2.0;
        let z = (j / numY - 0.5) * beltWidth;
        return [x, 0, -z];
      };

      for (let j = 0; j < numY; j++) {
        for (let i = 0; i < numX; i++) {
          positions.push(getPos(i, j));
          positions.push(getPos(i + 1, j));
          positions.push(getPos(i + 1, j + 1));
          positions.push(getPos(i, j + 1));

          indices.push(count * 4 + 0);
          indices.push(count * 4 + 1);
          indices.push(count * 4 + 2);
          indices.push(count * 4 + 0);
          indices.push(count * 4 + 2);
          indices.push(count * 4 + 3);
          count++;
        }
      }

      return new Mesh().bufferVertex(positions).bufferIndex(indices);
    })();

    // instancing
    const numBelts = 300;
    const posOffsets = [];
    const extras = [];
    let t = 0.1;
    for (let i = 0; i < numBelts; i++) {
      const p = random();
      const z = mix(-s, -s * 0.25, p);
      const rot = p * 1.25 + random(-t, t) + 0.25;
      posOffsets.push([-rot, 0, z]);
      extras.push([random(), random(), random()]);
    }
    mesh
      .bufferInstance(posOffsets, "aPosOffset")
      .bufferInstance(extras, "aExtra");

    // const mesh = Geom.plane(s, s, 50, "xz");
    t = 0.25;
    this.setMesh(mesh)
      .useProgram(vs, fs)
      .uniform("uPlaneSize", s)
      .uniform("uCenter", [random(-s * t, s * t), 0, -random(s, s * 2)])
      .uniform("uSeeds", [random(), random(), random()]);
  }
}

export default DrawPlane;
