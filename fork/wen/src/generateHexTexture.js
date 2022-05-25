import { GL, Mesh, Draw, CameraOrtho, FrameBuffer } from "alfrid";
import { mix, random, randomFloor, getRandomElement } from "./utils";
import Color from "./utils/Color";
import { vec2 } from "gl-matrix";
import Config from "./Config";

// shaders
import vs from "shaders/dots.vert";
import fs from "shaders/dots.frag";

const generateHexTexture = (
  width,
  height,
  mColors,
  mBgColor = 0,
  mScale = 0.75
) => {
  const { pixelRatio } = Config;
  let scale = mScale * pixelRatio;
  let bgColor = mBgColor;

  GL.disable(GL.CULL_FACE);
  GL.disable(GL.DEPTH_TEST);

  const { sin, cos, PI } = Math;
  const RAD = PI / 180;
  const center = [0, 0];
  let mesh;

  let camera = new CameraOrtho();
  let drawLine;
  const total = 400;

  let maxNum = 0;

  let pointAs = [];
  let pointBs = [];
  let colors = [];
  let extras = []; // num, size, seed,

  const initMesh = () => {
    let num = total;
    const positions = [];
    const uvs = [];
    const indices = [];

    pointAs = [];
    pointBs = [];
    colors = [];
    extras = []; // num, size, seed,

    while (num--) {
      positions.push([random(), num, random()]);
      uvs.push([random(), random()]);
      indices.push(num);
    }

    mesh = new Mesh(GL.POINTS)
      .bufferVertex(positions)
      .bufferTexCoord(uvs)
      .bufferIndex(indices);

    drawLine = new Draw()
      .setMesh(mesh)
      .useProgram(vs, fs)
      .uniform("uTotal", total);
  };

  const lineTo = (mPointA, mPointB, mSize, mColor = [1, 1, 1]) => {
    const l = vec2.distance(mPointA, mPointB);
    const density = random(0.4, 0.5) / scale;
    const num = Math.floor(l * density);
    if (num > maxNum) {
      maxNum = num;
      // console.log(maxNum);
    }
    const seed = randomFloor(total);

    // const s = scale < 2 ? 1.5 : 2;
    const s = 0.75;

    pointAs.push(mPointA);
    pointBs.push(mPointB);
    colors.push(mColor);
    extras.push([num, mSize * s * pixelRatio, seed]);
  };

  const draw = () => {
    mesh
      .bufferInstance(pointAs, "aPointA")
      .bufferInstance(pointBs, "aPointB")
      .bufferInstance(colors, "aColor")
      .bufferInstance(extras, "aExtra");
    drawLine.draw();
  };

  const generateMazeTexture = (mColors) => {
    const g = bgColor;
    GL.clear(g, g, g, 1);

    initMesh();

    camera.ortho(0, width, 0, height, 0.1, 100);
    camera.lookAt([0, 0, 5], [0, 0, 0]);
    GL.setMatrices(camera);

    const r = 128 * scale;
    const h = sin(60 * RAD) * r;
    const w = cos(60 * RAD) * r;

    const drawMaze = (tx, ty) => {
      let num = 16;
      const cr = 0.05;
      const color = new Color(getRandomElement(mColors));
      color.saturation += random(-cr, 0);
      color.lightness += random(-cr, 0);

      for (let j = 0; j < 6; j++) {
        const theta0 = 60 * RAD * j;
        const type = randomFloor(3);
        let theta1 = 0;
        let offset = [0, 0];

        if (type < 1) {
          offset = [-w, h];
          theta1 = -120 * RAD;
        } else if (type < 2) {
          offset = [w, h];
          theta1 = 120 * RAD;
        }

        for (let i = 0; i < num; i++) {
          const p = i / num + 0.5 / num;
          const l = r * p;
          let y = p * h;
          let x = -l * 0.5;
          const w = mix(1.2, 2, p);

          const pa = [x, y];
          const pb = [x + l, y];

          vec2.rotate(pa, pa, center, theta1);
          vec2.rotate(pb, pb, center, theta1);
          vec2.add(pa, pa, offset);
          vec2.add(pb, pb, offset);
          vec2.rotate(pa, pa, center, theta0);
          vec2.rotate(pb, pb, center, theta0);

          vec2.add(pa, pa, [tx, ty]);
          vec2.add(pb, pb, [tx, ty]);

          lineTo(pa, pb, w, color.glsl);
        }
      }
    };

    let count = 0;
    for (let j = -r; j < height + r; j += h) {
      count++;
      for (let i = -r; i < width + r; i += r * 3) {
        const offset = count % 2 === 0 ? r * 1.5 : 0;
        drawMaze(i + offset, j);
      }
    }

    draw();
  };

  let fbo = new FrameBuffer(width, height);
  fbo.bind();
  GL.clear(1, 0, 0, 1);

  // console.log("draw", colors);
  generateMazeTexture(mColors);

  fbo.unbind();

  GL.enable(GL.CULL_FACE);
  GL.enable(GL.DEPTH_TEST);
  return fbo.texture;
};

export default generateHexTexture;
