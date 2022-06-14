import { GL, FrameBuffer, Draw, Geom, ShaderLibs } from "alfrid";
import { random } from "./utils";
import Config from "./Config";

import fs from "shaders/height.frag";

const generate = (fboSize = 2048) => {
  const fbo = new FrameBuffer(fboSize, fboSize, {
    type: GL.FLOAT,
  });

  new Draw()
    .setMesh(Geom.bigTriangle())
    .useProgram(ShaderLibs.bigTriangleVert, fs)
    .setClearColor(0, 0, 0, 1)
    .bindFrameBuffer(fbo)
    .uniform("uSeed", random())
    .uniform("uNoiseScale", Config.noiseScale)
    .draw();

  return fbo.texture;
};

export default generate;
