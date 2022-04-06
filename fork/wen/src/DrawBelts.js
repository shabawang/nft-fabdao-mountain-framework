import { Draw, Mesh } from "alfrid";
import { fbm2D } from "./utils/noise";
import Config from "./Config";
import { random } from "./utils";

import vs from "shaders/belt.vert";
import fs from "shaders/belt.frag";

class DrawBelts extends Draw {
  constructor() {
    super();

    const positions = [];
    const indices = [];
    const numSegs = 400;
    const length = 10;
    let count = 0;

    const getPos = (i, j) => {
      const p = i / numSegs;
      return [p * length - length / 2, 0, j];
    };

    for (let i = 0; i < numSegs; i++) {
      positions.push(getPos(i, 1));
      positions.push(getPos(i + 1, 1));
      positions.push(getPos(i + 1, -1));
      positions.push(getPos(i, -1));

      indices.push(count * 4 + 0);
      indices.push(count * 4 + 1);
      indices.push(count * 4 + 2);
      indices.push(count * 4 + 0);
      indices.push(count * 4 + 2);
      indices.push(count * 4 + 3);

      count++;
    }

    const totalBelts = 200;
    const planeSize = 10;
    const posOffsets = [
      [0, 1, random()],
      [planeSize, 1, random()],
    ];
    const extras = [
      [random(), random(), 1],
      [random(), random(), random()],
    ];
    const seed = random(planeSize);
    const threshold = 0.1;
    const t = 0.2;

    let numTries = 0;

    while (posOffsets.length < totalBelts) {
      let z = random(planeSize);
      const n = fbm2D(z, seed, 0.8, 4) + random(-t, t);

      if (n > threshold || numTries++ > 2000) {
        posOffsets.push([z, random(), random()]);
        extras.push([random(), random(), random()]);
      }
    }

    this.posOffsets = posOffsets;
    this.extras = extras;

    const timeDiff = 0.1;

    this.posOffsets = this.posOffsets.sort((a, b) => {
      return b[0] - a[0] + random(-timeDiff, timeDiff);
    });

    this.numBelts = this.posOffsets.length;

    const mesh = new Mesh().bufferVertex(positions).bufferIndex(indices);

    this.setMesh(mesh).useProgram(vs, fs);
  }

  draw() {
    if (this.posOffsets.length === 0) {
      return;
    }
    const posOffset = this.posOffsets.pop();
    const extra = this.extras.pop();
    this.uniform("uPosOffset", posOffset).uniform("uExtra", extra);

    super.draw();
  }

  get hasFinished() {
    return this.posOffsets.length === 0;
  }

  get percent() {
    return 1 - this.posOffsets.length / this.numBelts;
  }
}

export default DrawBelts;
