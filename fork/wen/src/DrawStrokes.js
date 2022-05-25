import { GL, Draw, Geom } from "alfrid";
import Config from "./Config";
import { random } from "./utils";
import vs from "shaders/strokes.vert";
import fs from "shaders/strokes.frag";

class DrawStrokes extends Draw {
  constructor(mDensity = 2.5) {
    super();

    this.numSlices = 4;
    this.index = 0;

    const { width, height } = GL;
    const scale = Config.pixelRatio;
    const h = height / this.numSlices;
    const w = width / this.numSlices;

    const gapX = (3 / mDensity) * scale;
    const gapY = (6 / mDensity) * scale;

    const mesh = Geom.plane(3 * scale, 16 * scale, 1);

    this.offsets = [];
    for (let j = 0; j < this.numSlices; j++) {
      for (let i = 0; i < this.numSlices; i++) {
        this.offsets.push([i, j]);
      }
    }

    // instancing
    const posOffsets = [];
    const extras = [];
    const r = 1;
    for (let y = -h / 2; y < h / 2 + gapY; y += gapY) {
      for (let x = -w / 2; x < w / 2 + gapX; x += gapX) {
        posOffsets.push([x + random(-r, r), y + random(-r, r), random()]);
        extras.push([random(), random(), random()]);
      }
    }

    this.totalBlocks = this.offsets.length;

    mesh
      .bufferInstance(posOffsets, "aPosOffset")
      .bufferInstance(extras, "aExtra");

    this.setMesh(mesh).useProgram(vs, fs).uniform("uSeed", random(height));
  }

  draw() {
    if (this.index >= this.totalBlocks) {
      return;
    }

    const { width, height } = GL;
    const w = width / this.numSlices;
    const h = height / this.numSlices;

    let i = 10;
    while (i--) {
      if (this.index >= this.offsets.length) {
        return;
      }
      const o = this.offsets[this.index];
      this.uniform("uOffsetX", -width / 2 + o[0] * w + w / 2);
      this.uniform("uOffsetY", -height / 2 + o[1] * h + h / 2);
      super.draw();
      this.index++;
    }
  }

  get finished() {
    return this.index === this.totalBlocks;
  }

  get percent() {
    return this.index / this.totalBlocks;
  }
}

export default DrawStrokes;
