import { GL, Draw, Mesh } from "alfrid";
import { random, randomGaussian } from "./utils";
import Config from "./Config";
import vs from "shaders/shooting-start.vert";
import fs from "shaders/shooting-start.frag";

class DrawShootingStar extends Draw {
  constructor() {
    super();

    let count = 1;
    let num = 100;
    const positions = [];
    const extra = [];
    const indices = [];

    const { meterShower } = Config;

    const { abs } = Math;
    const getPos = () => {
      const y = abs(randomGaussian(0, 1, 5) - 0.5) * 30;
      return [random(), y, random()];
    };

    positions.push([3, 0, 1]);
    extra.push([0, 0, 1]);
    indices.push(0);
    while (num--) {
      positions.push(getPos());
      extra.push([0, 0, 1]);
      indices.push(count);
      count++;
    }

    if (meterShower) {
      let numExtra = 100;
      while (numExtra--) {
        let yOffset = random(1, 10);
        let xOffset = random(1, 25);
        if (random() > 0.5) xOffset *= -1.0;

        positions.push([3, 0, 1]);
        extra.push([xOffset, yOffset, 0]);
        indices.push(count);
        count++;
        num = 100;
        while (num--) {
          positions.push(getPos());
          extra.push([xOffset, yOffset, 0]);
          indices.push(count);
          count++;
        }
      }
    }

    const mesh = new Mesh(GL.POINTS)
      .bufferVertex(positions)
      .bufferData(extra, "aExtra", 3)
      .bufferIndex(indices);

    this.setMesh(mesh)
      .useProgram(vs, fs)
      .uniform("uTranslate", [Config.moonPosition, 10, -10])
      .uniform("uColor", [1, 1, 0.75]);
  }
}

export default DrawShootingStar;
